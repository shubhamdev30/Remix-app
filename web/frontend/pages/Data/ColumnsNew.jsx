import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  InlineGrid,
  OptionList,
  Popover,
  Scrollable,
  TextField,
  BlockStack,
  useBreakpoints,
  ChoiceList,
  Text,
  Tooltip,
  InlineStack,
} from "@shopify/polaris";
import { LayoutColumns3Icon } from "@shopify/polaris-icons";
import { disable } from "@shopify/app-bridge/actions/LeaveConfirmation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function Columnsnew(props) {
  const dispatch = useDispatch();
  const dataobj = useSelector((state) => {
    return state.users;
  });
  const { mdDown } = useBreakpoints();
  const [popoverActive, setPopoverActive] = useState(false);
  const [selectDisable, setselectDisable] = useState(false);
  const datePickerRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [selected, setSelected] = useState(props.activecolumns);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const [countActive, setCountActive] = useState(false);

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const [clickedValue, setClickedValue] = useState(null);
  const scrollRef = useRef(null);

  const columndata = () => {
    const formattedData = {};
    let activecol = [];
    props.newtags.forEach((entry) => {
      const keylabel = entry.label;
      formattedData[keylabel] = entry.values.map((item) => {
      if(props.activecolumns.includes(item.label)){
        activecol.push({
          label: item.label,
        value: item.label,
        dis: item.dis,
        })
      }
      return {
        label: item.label,
        value: item.label,
        dis: item.dis,
      }
    });
    });
    if(activecol.length > 0){
      return {Active: activecol,...formattedData};
    }else{
      return formattedData;
    }
  };

  const filteredOptions = Object.entries(columndata()).reduce((acc, [group, options]) => {
    let filteredGroupOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (filteredGroupOptions.length > 0) {
      acc[group] = filteredGroupOptions;
    } else {
      acc[group] = [];
    }
    return acc;
  }, {});

  const renderChoice = (choice) => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>{choice.label}</span>
        {choice.dis !== "" && (
          <Tooltip content={choice.dis} accessibilityLabel={`Info for ${choice.label}`}>
            <div style={{ marginLeft: "4px" }}>
              <button
                type="button"
                onClick={() => handleInfoClick(choice)}
                style={{ background: "transparent", border: "none" }}
              >
                <span role="img" aria-label="info">
                  ℹ️
                </span>
              </button>
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  const changeselection = (value) => {
    let newval = value;
    function findKeyByLabel(labelToSearch) {
      for (const section of props.newtags) {
        for (const item of section.values) {
          if (item.label === labelToSearch) {
            return item.type;
          }
        }
      }
      return null; // Label not found
    }
    if(value.length > selected.length){
      if( findKeyByLabel(value[value.length -1]) == "string" || findKeyByLabel(value[value.length -1]) == "String"){
      let last_element = newval.pop();
      newval = [last_element,...newval]
      }
    }

    setSelected(newval);
    console.log(newval)
    const array = [];
    array.push(newval);
    setCountActive(array[0].length);
    setselectDisable(false);
  };
  
  const addcolumn = ()=>{
    setPopoverActive(false)
    props.columnsupdate(selected);   
    setselectDisable(true);
  }

  const [activeDateRange, setActiveDateRange] = useState(Object.keys(filteredOptions)[0]);

  const handleTextClick = (value) => {
    setClickedValue(value);
    const index = Object.keys(filteredOptions).findIndex((heading) => heading === value);

    if (index !== -1) {
      const offset = 70;
      if(!Object.values(filteredOptions).every((options) => options.length == 0)){
      scrollRef.current.scrollTo(0, scrollRef.current.children[index].offsetTop - offset);
      }
    }
  };
  useEffect(() => {
    console.log(selected)
    setSelected(props.activecolumns)
  }, [props.activecolumns]);
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
        <Button onClick={togglePopoverActive} icon={LayoutColumns3Icon} pressed={popoverActive}>
          Columns: {`${props.activecolumns.length}`} Active
        </Button>
      }
      onClose={() => {setPopoverActive(false);setSelected(props.activecolumns);}}
    >
      <div style={{minWidth:"500px"}}>
      <Popover.Pane fixed>
        <Box padding="300" borderColor="border" borderBlockEndWidth="025">
          <TextField
            autoComplete="off"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search columns"
          />
        </Box>
        <InlineGrid
          columns={{
            xs: "1fr",
            mdDown: "1fr",
            md: "max-content max-content",
          }}
          gap={0}
          ref={datePickerRef}
        >
          <Box
            maxWidth={mdDown ? "516px" : "212px"}
            width={mdDown ? "100%" : "212px"}
            borderColor="border"
            borderInlineEndWidth="025"
          >
            {Object.keys(filteredOptions).length > 0 && (
              <Scrollable style={{ height: "334px"}}>
                <OptionList
              
                  options={Object.keys(filteredOptions).map((range) => ({
                    value: range,
                    label: range,
                  }))}
                  selected={activeDateRange}
                  onChange={(value) => {
                    setActiveDateRange(() => {
                      handleTextClick(
                        Object.keys(filteredOptions).find((range) => range === value[0])
                      );
                      return Object.keys(filteredOptions).find((range) => range === value[0]);
                    });
                  }}
                />
              </Scrollable>
            )}
          </Box>
          <Box  paddingInlineStart="300" paddingInlineEnd="100" paddingBlockStart="100" maxWidth={mdDown ? "320px" : "516px"}  width={"290px"}>
            <BlockStack gap="400">
              <div className={!Object.values(filteredOptions).every((options) => options.length === 0) ? "scrollable" : "scrollable cus_center"} ref={scrollRef} style={{ height: "334px" }}>
                {!Object.values(filteredOptions).every((options) => options.length === 0) ? (
                  <>
                    {Object.keys(filteredOptions).map((heading) => (
                      <div key={heading}>
                        {filteredOptions[heading].length > 0 && (
                          <Box paddingBlockStart="200">
                            <Box paddingBlockStart="100" paddingBlockEnd="200">
                              <Text variant="headingMd" as="h3">
                                {heading}
                              </Text>
                            </Box>

                            <div className="ffl">
                              <ChoiceList
                                onChange={changeselection}
                                choices={filteredOptions[heading].map((choice) => ({
                                  label: renderChoice(choice),
                                  value: choice.value,
                                }))}
                                selected={selected}
                                allowMultiple
                                disabled=     {
                                  (props.loading == true) && (
                                    disable
                                  )
                                }

                              />
                            </div>
                          </Box>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <Text>No data found</Text>
                )}
              </div>
            </BlockStack>
          </Box>
        </InlineGrid>
      </Popover.Pane>
      <Popover.Pane fixed>
                    <Box  borderBlockStartWidth="025" borderColor="border" paddingInlineStart="300" paddingInlineEnd="100" paddingBlockStart="100" paddingBlockEnd="300">
                <Popover.Section>
                        <InlineStack align="end">
                            <Box paddingInlineEnd="200">
                                <Button onClick={() => {setPopoverActive(false);setSelected(props.activecolumns)}}>Cancel</Button>
                            </Box>
                            <Box>
                                <Button disabled={props.loading == false ? false : true} variant="primary" onClick={()=>addcolumn()}>
                                    <div style={{padding:"6px 15px"}}>
                                    Apply
                                    </div>
                                </Button>
                            </Box>
                        </InlineStack>
                </Popover.Section>
                    </Box>
            </Popover.Pane>
            </div>
    </Popover>
  );
}

export default Columnsnew;
