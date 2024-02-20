import React, { useState,useRef, useEffect } from "react";
import {
  Button,
  Modal,
  TextField,
  ChoiceList,
  Box,
  Text,
  BlockStack,
  Spinner,
  useBreakpoints,
  Scrollable,
  OptionList,
  LegacyStack,
  InlineStack,
} from "@shopify/polaris";
import { useAuthenticatedFetch, useNavigate } from "@shopify/app-bridge-react";
function Create_custom_report(props) {
  function getCurrentTime() {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = String(currentTime.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(currentTime.getDate()).padStart(2, "0");
    const hours = String(currentTime.getHours()).padStart(2, "0");
    const minutes = String(currentTime.getMinutes()).padStart(2, "0");
    const seconds = String(currentTime.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  const { value: mdDown } = useBreakpoints();
  const fetch = useAuthenticatedFetch();
  const [activesave, setActivesave] = useState(true);
  const openreport = useNavigate();

  useEffect(() => {
    let createreportid = new Date().toISOString().replace(/[-T:.]/g, '');
    props.updatecustomreport({ ...props.customreport, report_id: createreportid });
  }, []);

  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [saveloader, setsaveloader] = useState(false);

  const showoutput = () => {
    setsaveloader(true);
    let savedata = JSON.stringify({ ...props.customreport, updated: getCurrentTime() });
    fetch(`/api/savereport/?data=${encodeURIComponent(savedata)}`)
      .then((response) => response.json())
      .then((data) => {
        setsaveloader(false);
        openreport(`/Datable?id=${props.customreport.report_id}`);
      });
  };

  const activator = (
    <Button onClick={() => setModalOpen(true)}>Create Custom Report</Button>
  );

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const changeselection = (value, heading) => {
    setSelected(value);
    setActivesave(true);
    if (heading === "Orders") {
      fetch(`/api/Getcolumn`)
        .then((response) => response.json())
        .then((data) => {
          setActivesave(false);
          props.updatecustomreport({
            ...props.customreport,
            default_columns: data.collection.find((obj) => obj.label === value[0]).values.map((value) => value.label),
            Category: heading,
            type: value[0],
          });
        });
    } else if (heading === "Customer") {
      fetch(`/api/getcustomercolumn`)
        .then((response) => response.json())
        .then((data) => {
          setActivesave(false);
          props.updatecustomreport({
            ...props.customreport,
            default_columns: data.collection.find((obj) => obj.label === value[0]).values.map((value) => value.label),
            Category: heading,
            type: value[0],
          });
        });
    }
    else if (heading === "Products") {
      fetch(`/api/getproductcolumn`)
        .then((response) => response.json())
        .then((data) => {
          setActivesave(false);
          props.updatecustomreport({
            ...props.customreport,
            default_columns: data.collection.find((obj) => obj.label === value[0]).values.map((value) => value.label),
            Category: heading,
            type: value[0],
          });
        });
    }
   

  };

  const [clickedValue, setClickedValue] = useState(null);
  const scrollRef = useRef(null);

  const handleTextClick = (value) => {
    setClickedValue(value);
    const index = Object.keys(filteredOptions).findIndex((heading) => heading === value);
    if (index !== -1) {
      const offset = 200;
      scrollRef.current.scrollTo(0, scrollRef.current.children[index].offsetTop - offset);
    }
  };

  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value) => {
    setSearchValue(value);
    props.updatecustomreport({ ...props.customreport, title: value });
  };

  const columndata = () => {
    const formattedData = {};
    props.newtags.forEach((entry) => {
      const keylabel = entry.label;
      formattedData[keylabel] = entry.values.map((item) => ({ label: item.label, value: item.label }));
    });
    return formattedData;
  };

  const filteredOptions = columndata();
  const [activeDateRange, setActiveDateRange] = useState(Object.keys(filteredOptions)[0]);
  return <>
      <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent:"center",
        cursor: 'pointer',
        padding:"4px 7px"
      }}
      onClick={() => setModalOpen(true)}
    >
      Create Custom Report
    </span>
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      title="Create Custom Report"
    >
      <Modal.Section>
        <TextField
          autoComplete="off"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Title"
          label={<Text as="p" fontWeight="medium">Title</Text>}
        />
      </Modal.Section>
      <Box>
        <LegacyStack>
          <LegacyStack.Item fill         
          >
            <Box>
            <Scrollable style={{ height: "334px" }}>
              <OptionList
                options={Object.keys(filteredOptions).map((range) => ({
                  value: range,
                  label: range,
                }))}
                selected={activeDateRange}
                onChange={(value) => {
                  setActiveDateRange(() => {
                    handleTextClick(Object.keys(filteredOptions).find((range) => range === value[0]))
                    return Object.keys(filteredOptions).find((range) => range === value[0])
                  }

                  );
                }}
              />
            </Scrollable>
            </Box>
            </LegacyStack.Item>
          <LegacyStack.Item fill>
            <Box   borderColor="border" borderInlineStartWidth="025" paddingInlineStart="300"  paddingBlockStart="300" paddingBlockEnd="300">
            <BlockStack gap="1">
              <div className="scrollable" ref={scrollRef}>
                {Object.keys(filteredOptions).map((heading) => (
                  <div key={heading}>
                    <Box paddingBlockStart="1">
                      <Box paddingBlockStart="1" paddingBlockEnd="1">
                        <Text variant="headingMd" as="h3">{heading}</Text>
                      </Box >
                      <div className="ffl">
                        <ChoiceList
                          onChange={(value) => { changeselection(value, heading) }}
                          choices={filteredOptions[heading]}
                          selected={selected}
                        />
                      </div>
                    </Box>
                  </div>
                ))}
              </div>
            </BlockStack>
            </Box>
          </LegacyStack.Item>
        </LegacyStack>
      </Box>
      <Box borderBlockStartWidth="025"  borderColor="border">
      <Modal.Section>
        <InlineStack align="space-between">
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={showoutput} disabled={activesave}>
          <span style={{padding:"6px 15px"}}>
            {saveloader ? (
              <Spinner accessibilityLabel="Saving" size="small" />
            ) : (
              "Create"
            )}
            </span>
          </Button>
          </InlineStack>
      </Modal.Section>
      </Box>
    </Modal>
  </>;
}

export default Create_custom_report;
