import { Button, Modal, LegacyStack, FormLayout, InlineStack, Box, Icon, Autocomplete, Text, Tag, OptionList, Popover } from "@shopify/polaris"
import { useState, useCallback, useEffect } from "react"
import { DeleteIcon, FilterIcon } from "@shopify/polaris-icons";
import { useDispatch, useSelector } from "react-redux";
import filterquery from "./Filterquery";
import { addtag } from "../../filterslice";
import { useAuthenticatedFetch } from "../../hooks";
import Datepick from "../../components/datepick";

function Testfilter(props) {
    const datafields = {
        conditions: {
            string: [
                { value: 'is', label: 'is' },
                { value: 'is not', label: 'is not' },
                { value: 'contains', label: 'contains' },
                { value: 'not contains', label: 'not contains' },
                { value: 'is blank', label: 'is blank' },
                { value: 'is not blank', label: 'is not blank' },
                { value: 'begins with', label: 'begins with' },
                { value: 'ends with', label: 'ends with' }
            ],
            number: [
                { value: 'equal', label: 'equal' },
                { value: 'notequal', label: 'notequal' },
                { value: 'greater than', label: 'greater than' },
                { value: 'less than', label: 'less than' },
                { value: '>=', label: '>=' },
                { value: '<=', label: '<=' },
                { value: 'is blank', label: 'is blank' },
                { value: 'is not blank', label: 'is not blank' }
            ],
            date: [
                { value: 'After', label: 'After' },
                { value: 'Before', label: 'Before' },
                { value: 'Equal', label: 'Equal' },
                { value: 'In Range', label: 'In Range' },
                { value: 'is blank', label: 'is blank' },
                { value: 'is not blank', label: 'is not blank' }
            ],
            bool: [
                { value: 'True', label: 'True' },
                { value: 'False', label: 'False' },
                { value: 'is blank', label: 'is blank' },
                { value: 'is not blank', label: 'is not blank' }
            ],
            array: [
                { value: 'contains', label: 'contains' },
                { value: 'not contains', label: 'not contains' },
                { value: 'is blank', label: 'is blank' },
                { value: 'is not blank', label: 'is not blank' }
            ]
        }
        ,
        tagstype: {
            Order: "string",
            Order_id: "srting",
            Order_date: "date",
            Order_day: "string",
            Order_month: "number",
            Order_month_name: "string",
            Order_year: "number",
            Order_time: "string",
            Order_Updated: "",
            Order_Processed: "",
            Order_Cancelled: "",
        }
    }

    const term = [
        { value: 'and', label: 'and' },
        { value: 'or', label: 'or' }
    ]
    const [termactive, settermactive] = useState(() => {
        let newval = [];
        for (let i = 0; i < props.fields.length; i++) {
            newval[i] = false;
        }
        return newval
    });
    const [conditionactive, setconditionactive] = useState(() => {
        let newval = [];
        for (let i = 0; i < props.fields.length; i++) {
            newval[i] = false;
        }
        return newval
    });
    function termpopoveractive(index) {
        settermactive((trms) => {
            let terms = [...trms];
            terms[index] = terms[index] == false ? true : false
            return terms
        })
    }
    function conditionpopoveractive(index) {

        setconditionactive((cndts) => {
            let conditions = [...cndts];
            conditions[index] = conditions[index] == false ? true : false
            return conditions
        })
    }
    const [active, setActive] = useState(false)
    const [fieldenable, setfieldenable] = useState(false)
    const handleModalChange = useCallback(() => setActive(!active), [active])
    const [tagOptions, settagoptions] = useState(() => {
        let newval = [];
        for (let i = 0; i < props.fields.length; i++) {
            newval[i] = props.newtags;
        }
        return newval
    });
    const [newquery, setnewquery] = useState("");
    const [newfields, setnewfields] = useState(props.fields);
    const [selectedOptions, setSelectedOptions] = useState([])

    const [selectedtags, setSelectedtags] = useState([])
    const [onfilter, setonfilter] = useState(true)
    const [options, setOptions] = useState([])
    const [newoptions, setnewOptions] = useState(() => {
        let newval = [];
        for (let i = 0; i < props.fields.length; i++) {
            newval[i] = [];
        }
        return newval
    })
    const [valueoptions, setvalueOptions] = useState(() => {
        let newval = [];
        for (let i = 0; i < props.fields.length; i++) {
            newval[i] = [];
        }
        return newval
    })
    const [daterangeoptions, setdaterangeoptions] = useState([])
    const [isloadingoptions, setloadingoptions] = useState(false)
    const [isloadingdateoptions, setloadingdateoptions] = useState(false)
    const fetch = useAuthenticatedFetch();
    const data = useSelector((state) => {
        return state.users;
    })


    function currentkeypress(event, val, index) {
        if (event.key == "Enter") {
            if (val != "") {
                updateonblur(index, val, "value")
            }
        }
    }
    useEffect(() => {

        if (props.fields.length > 0) {
            for (let i = 0; i < props.fields.length; i++) {
                settagoptions((value) => {
                    let newval = [...value];
                    newval[i] = props.newtags;
                    return newval;
                })
            }
        }
        else {
            settagoptions([])
        }
        setnewfields(props.fields);
        setnewquery(data.activeobj.lastactivefilterquery)
    }, [active]);



    const dispatch = useDispatch();
    // Api call function 
    let currentApiCall = null;
    let abortController = new AbortController();
    const debounceTime = 300; // Adjust as needed (in milliseconds)

    const makeApiCall = (event, shpy_val, fldtype, index) => {
        console.log("making")
        setloadingoptions(true);

        if (shpy_val !== "" && fldtype !== "array") {

            fetch(`/api/suggestions?query=${encodeURIComponent(event)}&selectedtag=${encodeURIComponent(shpy_val)}&type=${encodeURIComponent(props.activetemp.Category)}`, {
                signal: abortController.signal,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.suggestions.length > 0) {
                        setOptions(data.suggestions.map((item) => ({
                            label: item,
                            value: item,
                        })));
                        setnewOptions((value) => {
                            value[index] = data.suggestions.map((item) => ({
                                label: item,
                                value: item,
                            }))
                            return value;
                        });
                        setvalueOptions((value) => {
                            value[index] = data.suggestions.map((item) => ({
                                label: item,
                                value: item,
                            })).slice(0, 100)
                            return value;
                        });
                    } else {
                        const defaultOption = {
                            label: `Filter on '${event}'`,
                            value: event
                        };
                        setOptions([defaultOption])
                        setnewOptions((value) => {
                            // Make sure to use the default option if data.suggestions is empty
                            value[index] = [defaultOption];
                            return value;
                        });
                    }
                    setfieldenable(false)
                    setloadingoptions(false);
                })
                .catch((error) => console.error(error))
        }
    };
    const makeApidaterangeCall = (event, shpy_val) => {
        // Cancel the previous API call
        if (currentApiCall) {
            abortController.abort();
            abortController = new AbortController();
        }
        const query = event ? `query=${encodeURIComponent(event)}` : '{}';
        // Start a new API call after debounce time
        currentApiCall = setTimeout(() => {
            fetch(`/api/suggestions?${query}&selectedtag=${encodeURIComponent(shpy_val)}&type=${encodeURIComponent(props.activetemp.Category)}`, {
                signal: abortController.signal,
            })
                .then((response) => response.json())
                .then((data) => {
                    setloadingdateoptions(false);
                    setdaterangeoptions(data.suggestions.map((item) => ({
                        label: item,
                        value: item,
                    })));
                })
                .catch((error) => console.error(error));
        }, debounceTime);
    };

    function selectoptiontype(tagvalue) {
        let opttype = "";
        for (const section of props.newtags) {
            if (section.values) {
                for (const value of section.values) {
                    if (value.label === tagvalue) {
                        opttype = value.type;
                    }
                }
            }
        }
        if (opttype == "number") {
            return datafields.conditions.number
        } else if (opttype == "date") {
            return datafields.conditions.date
        } else if (opttype == "boolean") {
            return datafields.conditions.bool
        } else if (opttype == "array") {
            return datafields.conditions.array
        } else {
            return datafields.conditions.string
        }
    }
    function tagtype(tagvalue) {
        let opttype = "";
        for (const section of props.newtags) {
            if (section.values) {
                for (const value of section.values) {
                    if (value.label === tagvalue) {
                        opttype = value.type;
                    }
                }
            }
        }
        return opttype
    }

    const addfilter = () => {
        settermactive((val) => [...val, false])
        setconditionactive((val) => [...val, false])
        settagoptions((value) => {
            value.push(props.newtags)
            return value;
        })
        setnewOptions((value) => {
            value.push([])
            return value;
        })
        setvalueOptions((value) => {
            value.push([])
            return value;
        })
        setnewfields([...newfields, { tag: "", condition: "is", value: "", rangeopt: "", search: "", multiple: [], term: ["or"] }])
    }

    const applyfilter = async () => {
        props.filterquery(newquery)
        props.activefields(newfields);
        handleModalChange()
        dispatch(addtag({ ...data, activeobj: { ...props.activetemp, lastactivefilterquery: newquery, lastactivefilter: newfields } }))
        if (props.curpage > 1) {
            props.refreshfunction(newfields, newquery, "true");
        } else {
            props.filterfunction(newfields, newquery, "true");
        }
        // props.activetags(newfields)
    }

    const removefilter = (index) => {
        setOptions((value) => {
            value.splice(index, 1)[0];
            return value;
        })
        const updatedfields = [...newfields];
        updatedfields.splice(index, 1);
        setnewfields(updatedfields);
        dispatch(addtag({ ...data, tags: JSON.stringify(updatedfields), querydata: JSON.stringify(filterquery(updatedfields, props.newtags, props.activetemp.Category)) }));
        setnewquery(JSON.stringify(filterquery(updatedfields, props.newtags, props.activetemp.Category)));
        settermactive((val) => val.splice(index, 1))
        setconditionactive((val) => val.splice(index, 1))
    }

    const resetfilter = () => {
        setnewfields([]);
    }


    const fieldchange = async (index, event, field) => {
        if (field !== "daterange" && field !== "tag") {
            setnewfields((prevFields) => {
                const updatedData = [...prevFields];
                const updatedField = { ...updatedData[index], [field]: event };
                updatedData[index] = updatedField;
                setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                return updatedData;
            });
        }
        if (field == "tag") {
            function filterOptions(inputText) {
                const escapedEvent = inputText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const filterRegex = new RegExp(escapedEvent, "i");
                let resultOptions = [];

                for (const option of props.newtags) {
                    const filteredValues = option.values.filter(value =>
                        value.label.match(filterRegex)
                    );

                    if (filteredValues.length > 0) {
                        resultOptions.push({
                            label: option.label,
                            values: filteredValues
                        });
                    }
                }
                setnewfields((prevFields) => {
                    const updatedData = [...prevFields];
                    const updatedField = { ...updatedData[index], search: event };
                    updatedData[index] = updatedField;
                    return updatedData;
                });
                return resultOptions;
            }
            settagoptions((val) => {
                const updatedArray = [...val]; // Create a shallow copy of the array to avoid mutating the original array
                updatedArray[index] = filterOptions(event); // Update the element at the specified index
                return updatedArray; // Return the updated array
            });
        }
        if (field == "value") {
            let shpy_val = "";
            let fldtype = "";
            for (let section of props.newtags) {
                for (let value of section.values) {
                    if (value.label === newfields[index].tag) {
                        shpy_val = value.key;
                        fldtype = value.type
                        break;
                    }
                }
            }
            if (newfields[index].condition != "contains" && newfields[index].condition != "not contains" && newfields[index].condition != "begins with" && newfields[index].condition != "ends with") {
                setvalueOptions((val) => {
                    const updatedArray = [...val];
                    if (event !== "") {
                        const escapedEvent = event.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                        const filteredOptions = newoptions[index].filter(obj => obj.label.match(new RegExp(escapedEvent, "i")));
                        updatedArray[index] = [{
                            label: `Filter on '${event}'`,
                            value: event
                        }, ...filteredOptions.slice(0, 100)];
                    } else {
                        updatedArray[index] = newoptions[index].slice(0, 100);
                    }
                
                    return updatedArray;
                });
                
                //     setloadingoptions(true);
                //     makeApiCall(event, shpy_val, fldtype, index);
            }
        }

        if (field == "condition") {
            setnewfields((prevFields) => {
                let updatedData = [...prevFields];
                const updatedField = { ...updatedData[index], multiple: [] };
                updatedData[index] = updatedField;
                return updatedData;
            });
            if (event == "is") {
                setnewfields((prevFields) => {
                    const updatedData = [...prevFields];
                    const updatedField = { ...updatedData[index], term: ["or"] };
                    updatedData[index] = updatedField;
                    return updatedData;
                });
            } else if (event == "is not" || event == "not contains") {
                setnewfields((prevFields) => {
                    const updatedData = [...prevFields];
                    const updatedField = { ...updatedData[index], term: ["and"] };
                    updatedData[index] = updatedField;
                    return updatedData;
                });
            }



            if (event === "True") {

                setnewfields(() => {
                    let updatedData = [...newfields];
                    updatedData[index]["value"] = "true";
                    setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                    return updatedData;
                })
            } else if (event === "False") {
                setnewfields(() => {
                    let updatedData = [...newfields];
                    updatedData[index]["value"] = "false";
                    setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                    return updatedData;
                })

            } else if (event === "is blank") {
                if (field !== "daterange") {
                    setnewfields((prevFields) => {
                        const updatedData = [...prevFields];
                        const updatedField = { ...updatedData[index], "value": "N/A" };
                        updatedData[index] = updatedField;
                        setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                        return updatedData;
                    });
                }

            } else if (event === "is not blank") {
                setnewfields((prevFields) => {
                    const updatedData = [...prevFields];
                    const updatedField = { ...updatedData[index], "value": "N/A" };
                    updatedData[index] = updatedField;
                    setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                    return updatedData;
                });
            }
        }
    }
    const handleClose = () => {
        handleModalChange()
    }

    const activator = <Button onClick={handleModalChange} icon={FilterIcon} pressed={active}>Filters</Button>


    const updateSelection = (index, event, field) => {
        if (field != "daterange") {
            setonfilter(false);
            const selectedValue = event.map(selectedItem => {
                const matchedOption = options.find(option => option.value.includes(selectedItem));

                return matchedOption && matchedOption.label
            })

            setSelectedOptions(event)
            setnewfields((prevFields) => {
                const updatedData = [...prevFields];
                const updatedField = { ...updatedData[index], [field]: selectedValue[0], multiple: event, value: "" };
                updatedData[index] = updatedField;
                setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                return updatedData;
            });


        }

        if (field == "daterange") {
            setnewfields((prevFields) => {
                const updatedData = [...prevFields];
                const updatedField = { ...updatedData[index], "rangeopt": event[0] };
                updatedData[index] = updatedField;
                setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                return updatedData;
            });
        }
    }



    const updateSelectiontags = (index, event, field) => {
        console.log("test")
        setvalueOptions((value) => {
            value[index] = []
            return value;
        });
        setloadingoptions(true);
        props.setdisablefield(() => {
            for (const obj of newfields) {
                for (const key in obj) {
                    if (key !== "rangeopt" && !obj[key]) {
                        return true; // Found a blank key (excluding "rangeopt"), return false
                    }
                }
            }
            return false; // All keys (excluding "rangeopt") are non-blank, return true
        })
        const selectedValue = event[0];

        setSelectedtags(event)

        let shpy_val = "";
        let fldtype = "";
        for (let section of props.newtags) {
            for (let value of section.values) {
                if (value.label === event[0]) {
                    shpy_val = value.key;
                    fldtype = value.type;
                    break;
                }
            }
        }
        if (fldtype == "date") {
            setnewfields((prevFields) => {
                const updatedData = [...prevFields];
                const updatedField = { ...updatedData[index], "condition": selectoptiontype(selectedValue)[0].value, [field]: selectedValue, search: selectedValue, multiple: [], value: "" };
                updatedData[index] = updatedField;
                setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                return updatedData;
            })
        } else {
            setnewfields((prevFields) => {
                const updatedData = [...prevFields];
                const updatedField = { ...updatedData[index], "condition": selectoptiontype(selectedValue)[0].value, [field]: selectedValue, search: selectedValue, multiple: [],value:"" };
                updatedData[index] = updatedField;
                setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                return updatedData;
            })

        }
        setloadingoptions(true);
        makeApiCall("", shpy_val, fldtype, index);
        setdaterangeoptions([...new Set(props.currentpagedata.flatMap(entry => entry[shpy_val] || []))].map((opt) => ({ value: opt, label: opt })));

        if (event === "True") {
            setnewfields((prevFields) => {
                const updatedData = [...prevFields];
                const updatedField = { ...updatedData[index], "value": "true" };
                updatedData[index] = updatedField;
                setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                return updatedData;
            });
        } else if (event === "False") {
            setnewfields((prevFields) => {
                const updatedData = [...prevFields];
                const updatedField = { ...updatedData[index], "value": "false" };
                updatedData[index] = updatedField;
                setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                return updatedData;
            });
        } else if (event === "is blank") {
            setnewfields((prevFields) => {
                const updatedData = [...prevFields];
                const updatedField = { ...updatedData[index], "value": "N/A" };
                updatedData[index] = updatedField;
                setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                return updatedData;
            });

        } else if (event === "is not blank") {
            setnewfields((prevFields) => {
                const updatedData = [...prevFields];
                const updatedField = { ...updatedData[index], "value": "N/A" };
                updatedData[index] = updatedField;
                setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                return updatedData;
            });
        }
    }



    function generateAutocompleteOptions(index) {
        const customLabels = new Set(props.activecolumns);

        const filteredTagOptions = tagOptions[index].map(data => ({
            title: data.label,
            options: data.values
                .filter(field => !customLabels.has(field.label))
                .map(field => ({
                    value: field.label,
                    label: field.label,
                    type: field.type,
                })),
        }));


        const autocompleteOptions = [
            {
                title: "Active",
                options: tagOptions[index].flatMap((obj) =>
                    obj.values
                        .filter((valueObj) => props.activecolumns.includes(valueObj.label))
                        .map((valueObj) => {
                            if (valueObj.type !== "number" && valueObj.label != "Product Created At" && valueObj.label != "Created At" && valueObj.label != "Order Created Date") {
                                return {
                                    value: valueObj.label,
                                    label: valueObj.label,
                                }
                            }
                        })
                ),
            },
            ...filteredTagOptions,
        ];
        // Filter arr1 to remove objects with labels matching tags in arr2
        const tagSet = new Set(newfields.map(item => item.tag));
        if (autocompleteOptions.length > 0) {
            return autocompleteOptions.map(section => ({
                ...section,
                options: section.options.filter((option) => {
                    if (option != undefined && option.type != "number" && option.label != "Product Created At" && option.label != "Created At" && option.label != "Order Created Date") {
                        return !tagSet.has(option.label)
                    }
                })
            }));
        }

    }
    function rmopttag(i, index) {
        setnewfields((prevFields) => {
            const updatedData = [...prevFields];
            const updatedField = { ...updatedData[index], multiple: [...updatedData[index].multiple] };

            // Assuming multiple is an array in your updatedField
            if (updatedField.multiple && Array.isArray(updatedField.multiple)) {
                updatedField.multiple.splice(i, 1); // Remove the element at index i
            }

            updatedData[index] = updatedField;

            setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
            return updatedData;
        });
    }
    function updateonblur(index, event, val) {
        if (event != "") {
            setnewfields((prevFields) => {
                const updatedData = [...prevFields];
                const updatedField = { ...updatedData[index], multiple: [...updatedData[index].multiple, event], value: "" };
                updatedData[index] = updatedField;
                setnewquery(JSON.stringify(filterquery(updatedData, props.newtags, props.activetemp.Category)));
                return updatedData;
            });
        }
    }

    function updateonfocus(even, index) {
        let shpy_val = "";
        let fldtype = "";
        for (let section of props.newtags) {
            for (let value of section.values) {
                if (value.label === newfields[index].tag) {
                    shpy_val = value.key;
                    fldtype = value.type
                    break;
                }
            }
        }

        if(even.target.value == ""){
            setvalueOptions((val) => {
                let updatedArray = [...val];         
                        updatedArray[index] = newoptions[index].slice(0, 100);             
                return updatedArray;
            });
        }
        if(newoptions[index].length == 0){
            makeApiCall("", shpy_val, fldtype, index);
        }
    }


    return (
        <div>
            <Modal
                activator={activator}
                open={active}
                onClose={handleClose}
                title="Manage filters"
                primaryAction={{
                    content: (
                        <div style={{ padding: '6px 15px' }}>
                           Apply filters
                        </div>
                    ),
                    onAction: applyfilter,
                    disabled: newfields.length > 0 || (newfields.length == 0 && props.fields.length > 0) ? newfields.some(obj => Object.keys(obj).filter(key => key !== 'rangeopt').some(key => typeof obj[key] === 'string' && obj["multiple"].length == 0 && obj["condition"] != "is blank" && obj["condition"] != "is not blank" )) : "true"
                    ,
                    key: "apply_filter"
                }}
                secondaryActions={[
                    {
                        content: "Reset",
                        onAction: resetfilter,
                        key: "reset_filter"
                    }
                ]}
            >
                <Box padding="100">
                    {newfields.length == 0 &&
                        <Box  paddingInlineStart="300" paddingBlockStart="300" paddingBlockEnd="400" borderColor="border" borderBlockEndWidth="025">
                            <Text as="p" fontWeight="medium">
                                You currently have no filters set.
                            </Text>
                        </Box>
                    }
                    {newfields.map((data, index) => (
                        <Box paddingInlineStart="300" paddingInlineEnd="300" paddingBlockStart="300" paddingBlockEnd="300" borderColor="border" borderBlockEndWidth="025" key={index}>
                            <LegacyStack vertical>
                                <FormLayout>
                                    <LegacyStack>
                                        <LegacyStack.Item fill>
                                            <Autocomplete
                                                options={generateAutocompleteOptions(index)}
                                                selected={[data.tag]}
                                                onSelect={(event) => updateSelectiontags(index, event, "tag")}
                                                textField={
                                                    <Autocomplete.TextField
                                                        onChange={(event) => fieldchange(index, event, "tag")}
                                                        placeholder="Select Filters"
                                                        value={data.search}
                                                        autoComplete="off"

                                                    />
                                                }
                                                shouldHideTitle={true}
                                            />

                                        </LegacyStack.Item>
                                        <LegacyStack.Item>
                                            <Popover
                                                active={conditionactive[index]}
                                                activator={<Button onClick={() => conditionpopoveractive(index)} disclosure disabled={(data.tag != "") ? false : true}><div style={{ padding: "2px 5px" }}>{data.condition}</div></Button>}
                                                onClose={() => conditionpopoveractive(index)}

                                            >
                                                <OptionList
                                                    options={selectoptiontype(data.tag, index, "condition")}
                                                    selected={[data.condition]}
                                                    onChange={(event) => fieldchange(index, event[0], "condition")}
                                                />
                                            </Popover>
                                        </LegacyStack.Item>
                                        <LegacyStack.Item>
                                            <div className="flrmv_btn"><Button onClick={() => removefilter(index)}><Icon source={DeleteIcon} /></Button></div>
                                        </LegacyStack.Item>
                                    </LegacyStack>
                                    {!(data.condition == "True" || data.condition == "False" || data.condition == "is blank" || data.condition == "is not blank") ? (
                                        <LegacyStack>
                                            {tagtype(data.tag) !== "date" &&
                                                <LegacyStack.Item fill>
                                                    <Autocomplete
                                                        options={isloadingoptions ? [{ label: <h2>Loading...</h2>, value: 'loading', disabled: true }] : valueoptions[index].length == 0 || data.condition == "contains" || data.condition == "not contains" || data.condition == "begins with" || data.condition == "ends with" ? "" : valueoptions[index]}
                                                        selected={data.multiple}
                                                        onSelect={(event) => updateSelection(index, event, "value")}
                                                        disabled={(data.tag != "") ? false : true}
                                                        allowMultiple
                                                        textField={
                                                            <Autocomplete.TextField
                                                                onChange={(event) => {
                                                                    fieldchange(index, event, "value")
                                                                }}
                                                                onFocus={(even) => {
                                                                    if (data.condition == "contains" || data.condition == "begins with" || data.condition == "ends with" || data.condition == "not contains") {
                                                                        document.addEventListener('keydown', (eve) => currentkeypress(eve, even.target.value, index))
                                                                    } else {
                                                                        if (data.value == "") {
                                                                            updateonfocus(even, index)
                                                                        }
                                                                    }
                                                                }}
                                                                placeholder={data.condition == "In Range" ? "First Date" : "Search"}
                                                                value={data.value}
                                                                onBlur={(event) => { data.condition == "contains" || data.condition == "begins with" || data.condition == "ends with" || data.condition == "not contains" ? updateonblur(index, event.target.value, "value") : undefined }}
                                                                disabled={(data.tag != "" && fieldenable == false) ? false : true}
                                                                autoComplete="off"
                                                            />
                                                        }
                                                    />
                                                </LegacyStack.Item>

                                            }
                                            {tagtype(data.tag) == "date" &&
                                                <LegacyStack.Item fill>
                                                    <Datepick
                                                        dateselect={data.value}
                                                        index={index}
                                                        type="daterange"
                                                        updateSelection={(idx, evnt) => updateSelection(idx, evnt, "value")}
                                                        fieldchange={(idx, evnt) => fieldchange(idx, evnt, "value")}
                                                    />
                                                </LegacyStack.Item>
                                            }
                                            {data.condition == "In Range" &&
                                                <LegacyStack.Item fill>
                                                    <Datepick
                                                        dateselect={data.rangeopt}
                                                        index={index}
                                                        type="daterange"
                                                        updateSelection={(idx, evnt) => updateSelection(idx, evnt, "daterange")}
                                                        fieldchange={(idx, evnt) => fieldchange(idx, evnt, "daterange")}
                                                    />
                                                </LegacyStack.Item>
                                            }
                                            {tagtype(data.tag) != "date" &&
                                                <LegacyStack.Item>
                                                    <Popover
                                                        active={termactive[index]}
                                                        activator={<Button onClick={() => termpopoveractive(index)} disclosure disabled={(data.condition == "is" || data.condition == "" || data.condition == "is not" || data.condition == "not contains" || data.condition == "ends with" || data.condition == "begins with") ? true : false}><div style={{ padding: "3px 5px" }}>{data.term[0]}</div></Button>}
                                                        onClose={() => termpopoveractive(index)}

                                                    >
                                                        <OptionList
                                                            options={term}
                                                            selected={data.term[0]}
                                                            onChange={(event) => fieldchange(index, event, "term")}
                                                        />
                                                    </Popover>
                                                </LegacyStack.Item>
                                            }
                                        </LegacyStack>
                                    ) : null}
                                </FormLayout>
                            </LegacyStack>
                            {(tagtype(data.tag) != "date" && data.multiple.length != 0 ) && (
                                <Box paddingBlockStart="100">
                                    <InlineStack gap={200}>
                                        {
                                            data.multiple.map((option, i) => (
                                                option !== '' && (
                                                    <div className="custom-truncate custom-max-width">
                                                        <Tag key={option} index={i} onRemove={() => { rmopttag(i, index) }}>
                                                            {data.condition.charAt(0).toUpperCase() + data.condition.slice(1)} {option}
                                                        </Tag>
                                                    </div>
                                                )
                                            ))

                                        }
                                    </InlineStack>
                                </Box>
                            )}
                        </Box>
                    ))}
                    <Box paddingInlineStart="300" paddingBlockStart="400" paddingBlockEnd="300">
                        <Button disabled={props.loading == false ? false : true} onClick={addfilter}>Add filter</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

export default Testfilter;