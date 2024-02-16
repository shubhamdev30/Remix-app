import { Box, Button, DatePicker, InlineGrid, InlineStack, Icon, OptionList, Popover, Scrollable, Select, TextField, BlockStack, useBreakpoints } from "@shopify/polaris";
import { ArrowRightIcon, CalendarIcon } from "@shopify/polaris-icons";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addtag } from "../../filterslice";

// This example is for guidance purposes. Copying it will come with caveats.
function DateRangePicker(props) {
    function convertdate(dateString, type) {
        console.log(dateString);
        const inputDate = new Date(dateString);
        let formattedDate;
    
        const year = inputDate.getFullYear();
const month = String(inputDate.getMonth() + 1).padStart(2, '0');
const day = String(inputDate.getDate()).padStart(2, '0');
const hours = String(inputDate.getHours()).padStart(2, '0');
const minutes = String(inputDate.getMinutes()).padStart(2, '0');
const seconds = String(inputDate.getSeconds()).padStart(2, '0');
    
        if (type == "end") {
            formattedDate = `${year}-${month}-${day}T23:59:59Z`;
        } else {
            formattedDate = `${year}-${month}-${day}T00:00:00Z`;
        }
    
        console.log(formattedDate)
        return formattedDate;
    }
    
    const { mdDown, lgUp } = useBreakpoints();
    const shouldShowMultiMonth = lgUp;
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const yesterday = new Date(
        new Date(new Date().setDate(today.getDate() - 1)).setHours(0, 0, 0, 0)
    );

    const dispatch = useDispatch();
    const dataobj = useSelector((state) => {
        return state.users;
    })
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);

    const ranges = [
        {
            title: "Custom",
            alias: "Custom",
            period: {
                since: new Date(props.currentdate.start),
                until: new Date(props.currentdate.end)
            },
        },
        {
            title: "Today",
            alias: "today",
            period: {
                since: new Date(new Date()),
                until: new Date(new Date()),
            },
        },
        {
            title: "Yesterday",
            alias: "yesterday",
            period: {
                since: yesterday,
                until: yesterday,
            },
        },
        {
            title: "Last 7 days",
            alias: "last7days",
            period: {
                since: new Date(
                    new Date(new Date().setDate(today.getDate() - 7)).setHours(0, 0, 0, 0)
                ),
                until: new Date(new Date()),
            }
        },
        {
            title: "Last 30 days",
            alias: "last30days",
            period: {
                since: new Date(
                    new Date(new Date().setDate(today.getDate() - 30)).setHours(0, 0, 0, 0)
                ),
                until: new Date(new Date()),
            }
        },
        {
            title: "Last 90 days",
            alias: "last90days",
            period: {
                since: new Date(
                    new Date(new Date().setDate(today.getDate() - 90)).setHours(0, 0, 0, 0)
                ),
                until: new Date(new Date()),
            }
        },
        {
            title: "Last 365 days",
            alias: "last365days",
            period: {
                since: new Date(
                    new Date(new Date().setDate(today.getDate() - 365)).setHours(0, 0, 0, 0)
                ),
                until: new Date(new Date()),
            }
        },
        {
            title: "Last Month",
            alias: "lastMonth",
            period: {
                since: new Date(
                    new Date(today.getFullYear(), today.getMonth() - 1, 1).setHours(0, 0, 0, 0)
                ),
                until: new Date(today.getFullYear(), today.getMonth(), 0),
            }
        },
        {
            title: "Last Year",
            alias: "lastYear",
            period: {
                since: new Date(today.getFullYear() - 1, 0, 1),
                until: new Date(today.getFullYear() - 1, 11, 31),
            }
        },
        {
            title: "Week to Date",
            alias: "weekToDate",
            period: {
                since: new Date(
                    today.setDate(today.getDate() - today.getDay())
                ),
                until: new Date(new Date()),
            }
        },
        {
            title: "Month to Date",
            alias: "monthToDate",
            period: {
                since: new Date(today.getFullYear(), today.getMonth(), 1),
                until: new Date(new Date()),
            }
        },
        {
            title: "Year to Date",
            alias: "yearToDate",
            period: {
                since: new Date(today.getFullYear(), 0, 1),
                until: new Date(new Date()),
            }
        },
        {
            title: "Quater 1",
            alias: "quater1",
            period: {
                since: new Date(today.getFullYear(), 0, 1),
                until: new Date(today.getFullYear(), 2, 31),
            }
        },
        {
            title: "Quater 2",
            alias: "quater2",
            period: {
                since: new Date(today.getFullYear(), 3, 1),
                until: new Date(today.getFullYear(), 5, 30),
            }
        },
        {
            title: "Quater 3",
            alias: "quater3",
            period: {
                since: new Date(today.getFullYear(), 6, 1),
                until: new Date(today.getFullYear(), 8, 30),
            }
        },
        {
            title: "Quarter 4",
            alias: "quarter4",
            period: {
                since: new Date(
                    today.getFullYear(), 9, 1),
                until: new Date(today.getFullYear(), 11, 31),
            }
        },
    ];
    function findDateRangeByAlias(alias) {
        const foundRange = ranges.find(range => range.alias === alias);
        return foundRange || ranges[0]; // If not found, default to the first range
    }
    const [popoverActive, setPopoverActive] = useState(false);
    const [activeDateRange, setActiveDateRange] = useState(findDateRangeByAlias(props.activedtformet));
    const [inputValues, setInputValues] = useState({});
    const [showValues, setshowValues] = useState({});
    const [{ month, year }, setDate] = useState({
        month: activeDateRange.period.since.getMonth(),
        year: activeDateRange.period.since.getFullYear(),
    });
    const datePickerRef = useRef(null);
    const VALID_YYYY_MM_DD_DATE_REGEX = /^\d{4}-\d{1,2}-\d{1,2}/;


    function isDate(date) {
        return !isNaN(new Date(date).getDate());
    }

    function format_date(input_date) {
        console.log(activeDateRange)
        const dateObject = new Date(input_date);
        const day = dateObject.getDate();
        const month = dateObject.toLocaleString('default', { month: 'long' }).toLowerCase();
        const year = dateObject.getFullYear();
        const formatted_date = `${day} ${month} ${year}`;
        console.log(formatted_date)
        if (dateObject == "Invalid Date") {
            return "Invalid Date";
        } else {
            return formatted_date;
        }

    }



    function isValidYearMonthDayDateString(date) {
        return VALID_YYYY_MM_DD_DATE_REGEX.test(date) && isDate(date);
    }



    function isValidDate(date) {
        return date.length === 10 && isValidYearMonthDayDateString(date);
    }
    function parseYearMonthDayDateString(input) {
        const [year, month, day] = input.split("-");
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    function formatDateToYearMonthDayDateString(date) {
        const year = String(date.getFullYear());
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        if (month.length < 2) {
            month = String(month).padStart(2, "0");
        }
        if (day.length < 2) {
            day = String(day).padStart(2, "0");
        }
        return [year, month, day].join("-");
    }



    function formatDate(date) {
        return formatDateToYearMonthDayDateString(date);
    }


    function nodeContainsDescendant(rootNode, descendant) {
        if (rootNode === descendant) {
            return true;
        }
        let parent = descendant.parentNode;
        while (parent != null) {
            if (parent === rootNode) {
                return true;
            }
            parent = parent.parentNode;
        }
        return false;
    }


    function isNodeWithinPopover(node) {
        return datePickerRef?.current
            ? nodeContainsDescendant(datePickerRef.current, node)
            : false;
    }


    function handleStartInputValueChange(value) {
        setInputValues((prevState) => {
            return { ...prevState, since: value };
        });
        setshowValues((prevState) => {
            return { ...prevState, since: value };
        });
        if (isValidDate(value)) {
            const newSince = parseYearMonthDayDateString(value);
            setActiveDateRange((prevState) => {
                const newPeriod =
                    prevState.period && newSince <= prevState.period.until
                        ? { since: newSince, until: prevState.period.until }
                        : { since: newSince, until: newSince };
                return {
                    ...prevState,
                    period: newPeriod,
                };
            });

            props.activedate((prevState) => {
                const newPeriod =
                    prevState.period && newSince <= prevState.period.until
                        ? { since: newSince, until: prevState.period.until }
                        : { since: newSince, until: newSince };
                const updatedate = {
                    ...prevState,
                    period: newPeriod,
                };
                return {
                    start: convertdate(updatedate.period.since,""),
                    end: convertdate(updatedate.period.until,"end")
                }
            });

            // Check if the selected range is "Custom" and update it
            if (activeDateRange.title !== "Custom") {
                const customRange = findDateRangeByAlias("Custom");
                setActiveDateRange(customRange);
            }
        }
    }


    function handleEndInputValueChange(value) {
        setInputValues((prevState) => ({ ...prevState, until: value }));
        setshowValues((prevState) => ({ ...prevState, until: value }));
        if (isValidDate(value)) {
            const newUntil = parseYearMonthDayDateString(value);
            setActiveDateRange((prevState) => {
                const newPeriod =
                    prevState.period && newUntil >= prevState.period.since
                        ? { since: prevState.period.since, until: newUntil }
                        : { since: newUntil, until: newUntil };
                return {
                    ...prevState,
                    period: newPeriod,
                };
            });

            // Check if the selected range is "Custom" and update it
            if (activeDateRange.title !== "Custom") {
                const customRange = findDateRangeByAlias("Custom");
                setActiveDateRange(customRange);
            }
        }
    }

    function handleInputBlur({ relatedTarget }) {
        const isRelatedTargetWithinPopover =
            relatedTarget != null && isNodeWithinPopover(relatedTarget);
        // If focus moves from the TextField to the Popover
        // we don't want to close the popover
        if (isRelatedTargetWithinPopover) {
            return;
        }
        setPopoverActive(false);
    }
    function handleMonthChange(month, year) {
        setDate({ month, year });
    }
    function handleCalendarChange({ start, end }) {
        const newDateRange = ranges.find((range) => {
            return (
                range.period.since.valueOf() === start.valueOf() &&
                range.period.until.valueOf() === end.valueOf()
            );
        }) || {
            title: "Custom",
            alias: "Custom",
            period: {
                since: start,
                until: end,
            },
        };
        setActiveDateRange(newDateRange);
        props.activedate({
            start: convertdate(newDateRange.period.since,""),
            end: convertdate(newDateRange.period.until,"end")
        });
    }
    function apply() {
        console.log(activeDateRange)
        console.log(dataobj.activeobj)
        props.setactdtformet(activeDateRange.alias)
        dispatch(addtag({
            ...dataobj, activeobj: {
                ...dataobj.activeobj, datafrom: activeDateRange.alias, lastactivedate: {
                    start: convertdate(activeDateRange.period.since,""),
                    end: convertdate(activeDateRange.period.until,"end")
                }
            }
        }))
        props.reloadpage(activeDateRange.alias);
        setPopoverActive(false);
    }
    function cancel() {
        setPopoverActive(false);
    }
    useEffect(() => {
        if (activeDateRange) {
            setInputValues({
                since: formatDate(activeDateRange.period.since),
                until: formatDate(activeDateRange.period.until),
            });
            setshowValues({
                since: formatDate(activeDateRange.period.since),
                until: formatDate(activeDateRange.period.until),
            });
            function monthDiff(referenceDate, newDate) {
                return (
                    newDate.month -
                    referenceDate.month +
                    12 * (referenceDate.year - newDate.year)
                );
            }
            const monthDifference = monthDiff(
                { year, month },
                {
                    year: activeDateRange.period.until.getFullYear(),
                    month: activeDateRange.period.until.getMonth(),
                }
            );
            if (monthDifference > 1 || monthDifference < 0) {
                setDate({
                    month: activeDateRange.period.until.getMonth(),
                    year: activeDateRange.period.until.getFullYear(),
                });
            }
        }
        props.activedate({
            start: convertdate(activeDateRange.period.since,""),
            end: convertdate(activeDateRange.period.until,"end")
        })

    }, [activeDateRange]);
    const buttonValue =
        activeDateRange.title === "Custom"
            ? activeDateRange.period.since.toDateString() +
            " - " +
            activeDateRange.period.until.toDateString()
            : activeDateRange.title;

    console.log(month)
    return (
        <Popover
            active={popoverActive}
            autofocusTarget="none"
            preferredAlignment="left"
            preferredPosition="below"
            fluidContent
            sectioned={false}
            fullHeight
            activator={
                <Button
                    size="slim"
                    pressed={popoverActive}
                    icon={CalendarIcon}
                    onClick={() => setPopoverActive(!popoverActive)}
                >
                    {buttonValue}
                </Button>
            }
            onClose={() => setPopoverActive(false)}
        >
            <Popover.Pane fixed>
                <InlineGrid
                    columns={{
                        xs: "1fr",
                        mdDown: "1fr",
                        md: "max-content max-content",
                    }}
                    gap={0}
                    ref={datePickerRef}>
                    <Box
                        maxWidth={mdDown ? "516px" : "212px"}
                        width={mdDown ? "100%" : "212px"}
                        paddingBlockEnd={{ xs: 1, md: 0 }}
                        borderInlineEndWidth="025"
                        borderColor="border"
                    >
                        {mdDown ? (
                            <Select
                                label="dateRangeLabel"
                                labelHidden
                                onChange={(value) => {
                                    const result = ranges.find(
                                        ({ title, alias }) => title === value || alias === value
                                    );
                                    setActiveDateRange(result);
                                    props.setactdtformet(value)
                                    props.activedate({
                                        start: convertdate(result.period.since,""),
                                        end: convertdate(result.period.until,"end")
                                    });

                                }}
                                value={activeDateRange?.title || activeDateRange?.alias || ""}
                                options={ranges.map(({ alias, title }) => title || alias)}
                            />
                        ) : (
                            <Scrollable style={{ height: "334px" }}>
                                <OptionList
                                    options={ranges.map((range) => ({
                                        value: range.alias,
                                        label: range.title,
                                    }))}
                                    selected={activeDateRange.alias}
                                    onChange={(value) => {
                                        setActiveDateRange(
                                            ranges.find((range) => range.alias === value[0])
                                        );
                                        props.setactdtformet(value[0])
                                        let newchange = ranges.find((range) => range.alias === value[0]);
                                        props.activedate(
                                            {
                                                start: convertdate(newchange.period.since,""),
                                                end: convertdate(newchange.period.until,"end")
                                            });
                                    }}
                                />
                            </Scrollable>
                        )}
                    </Box>
                    <Box padding={{ xs: 400 }} maxWidth={mdDown ? "320px" : "516px"}>
                        <BlockStack gap="400">
                            <InlineStack wrap={false} gap="100">
                                <div style={{ flexGrow: 1 }}>
                                    <TextField
                                        role="combobox"
                                        label={"Since"}
                                        labelHidden
                                        value={inputValues.since}
                                        onFocus={() => { setInputValues((prevState) => ({ ...prevState, since: showValues.since })) }}
                                        onBlur={() => { setInputValues((prevState) => ({ ...prevState, since: (format_date(showValues.since) == "Invalid Date") ? format_date(formatDate(activeDateRange.period.since)) : format_date(showValues.since) })) }}
                                        onChange={handleStartInputValueChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <Icon source={ArrowRightIcon} tone="subdued" />
                                <div style={{ flexGrow: 1 }}>
                                    <TextField
                                        role="combobox"
                                        label={"Until"}
                                        labelHidden
                                        value={inputValues.until}
                                        onFocus={() => setInputValues((prevState) => ({ ...prevState, until: showValues.until }))}
                                        onBlur={() => setInputValues((prevState) => ({ ...prevState, until: (format_date(showValues.until) == "Invalid Date") ? format_date(formatDate(activeDateRange.period.until)) : format_date(showValues.until) }))}
                                        onChange={handleEndInputValueChange}
                                        autoComplete="off"
                                    />
                                </div>
                            </InlineStack>
                            <div>
                                <DatePicker
                                    month={month}
                                    year={year}
                                    selected={{
                                        start: activeDateRange.period.since,
                                        end: activeDateRange.period.until,
                                    }}
                                    onMonthChange={handleMonthChange}
                                    onChange={handleCalendarChange}
                                    multiMonth={shouldShowMultiMonth}
                                    allowRange
                                />
                            </div>
                        </BlockStack>
                    </Box>
                </InlineGrid>
            </Popover.Pane>
            <Popover.Pane fixed>
                <Box borderBlockStartWidth="025" borderColor="border" paddingInlineStart="300" paddingInlineEnd="100" paddingBlockStart="100" paddingBlockEnd="300">
                    <Popover.Section>
                        <InlineStack align="end">
                            <Box paddingInlineEnd="200">
                                <Button onClick={cancel}>Cancel</Button>
                            </Box>
                            <Box>
                                <Button disabled={props.loading == false ? false : true} variant="primary" onClick={() => apply()}>
                                    <div style={{ padding: "6px 12px" }}>
                                        Apply
                                    </div>
                                </Button>
                            </Box>
                        </InlineStack>
                    </Popover.Section>
                </Box>
            </Popover.Pane>

        </Popover>
    );
}


export default DateRangePicker