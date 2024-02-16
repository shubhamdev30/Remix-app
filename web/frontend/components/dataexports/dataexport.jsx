import React, { useState, useCallback, useEffect } from 'react';
import {  Popover, Modal, ChoiceList, Box, Icon, Autocomplete, InlineStack, Tag, Text } from '@shopify/polaris';
import { PlusCircleIcon, ExportIcon } from "@shopify/polaris-icons";
import { useSelector } from 'react-redux';
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import { dataapi } from '../../pages/Data/dataapis';
import convertpdf from './convertpdf';
import convertcsv from './convertcsv';
import convertexcel from './convertexcel';

function Dataexports(props) {
  const [emailInput, setEmailInput] = useState("")
  const [emailError, setEmailError] = useState("");
  const [active, setActive] = useState(false);
  const [selections, setSelections] = useState({
    exportType: 'cur_page_data',
    exportFormat: 'csv',
    emails: []
  });
  useEffect(() => {
    setSelections(({
      exportType: 'cur_page_data',
      exportFormat: 'csv',
      emails: []
    }))
  }, [])


  const handleChange = useCallback(() => {
    setActive(!active);
  }, [active]);

  const updateselection = useCallback((value) => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      exportType: value[0],
    }));
  }, []);

  const updatetype = useCallback((value) => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      exportFormat: value[0],
    }));
  }, []);

  const activator = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        padding:"4px 8px"
      }}
      onClick={handleChange}
    >
      <Icon source={ExportIcon} color="base" style={{ padding: '20px' }} />
      Export
    </span>
  );


  const fetch = useAuthenticatedFetch();
  const dataobj = useSelector((state) => {
    return state.users;
  });

  function downloadfile(val) {
    if (val.exportType == "cur_page_data") {
      if (val.exportFormat == "pdf") {
        convertpdf(dataobj.activeobj.default_columns, props.data, dataobj.activeobj.lastactivedate)
      } else if (val.exportFormat == "csv") {
        convertcsv(dataobj.activeobj.default_columns, props.data, "Title", val.emails)
      } else if (val.exportFormat == "excel") {
        convertexcel(dataobj.activeobj.default_columns, props.data, "Title")
      }
    }
    else {
      console.log(val.exportFormat)
      dataapi(
        dataobj.activeobj.Category,
        dataobj.activeobj.lastactivefilterquery,
        dataobj.activeobj.lastactivedate,
        "",
        fetch,
        dataobj.activeobj.default_columns,
        dataobj.activeobj.sorting,
        "",
        "dataexport",
        val.emails,
        val.exportFormat ,
        dataobj.columns
      )
      props.alertbanner(true);
      handleChange();
    }
  }


  const handleAddEmailTag = useCallback(() => {
    if (emailInput.trim() !== '') {
      if (validateEmail(emailInput.trim())) {
        setSelections((prev) => {
          if (prev.emails.includes(emailInput.trim())) {
            setEmailError("Email already exists");
            return prev; // Do not modify the state if the email already exists
          }
          return { ...prev, emails: [...prev.emails, emailInput.trim()] };
        });
        setEmailInput('');
        setEmailError("");
      } else {
        setEmailError("Invalid email format");
      }
    }
  }, [emailInput]);


  const handleEmailInputChange = useCallback((value) => {
    setEmailInput(value);
    setEmailError("");
  }, []);

  const handleRemoveEmailTag = (index) => {
    setSelections((prev) => {
      const newTags = [...prev.emails];
      newTags.splice(index, 1);
      return { ...prev, emails: newTags };
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^.+@.+\w*$/;
    return emailRegex.test(email);
  };


  return (
    <Popover
      active={active}
      open={active}
      activator={activator}
      autofocusTarget="first-node"
      onClose={() => { }}
    >
      <Modal
        title="Export"
        children={
          <Box padding="100">
            <Box padding="300">
              <ChoiceList
                title={<p>Export</p>}
                choices={[
                  { label: "Current Page Data", value: 'cur_page_data' },
                  { label: 'All Data', value: 'All Data' },
                ]}
                selected={[selections.exportType]}
                onChange={updateselection}
              />
            </Box>
            <Box padding="300">
              <ChoiceList
                title={<p>Export as</p>}
                choices={[
                  { label: "Csv", value: 'csv' },
                  { label: 'Excel', value: 'excel' },
                  { label: 'pdf', value: 'pdf' },
                ]}
                selected={[selections.exportFormat]}
                onChange={updatetype}
              />
            </Box>
            {selections.exportType != "cur_page_data" &&
            <Box padding="300">
              <Box paddingBlockEnd="200">
                <Text as="p" fontWeight="medium">Title</Text>
              </Box>
              <Autocomplete
                preferredPosition="before"
                actionBefore={{
                  accessibilityLabel: "Action label",
                  content: "Action with long name",
                  ellipsis: true,
                  helpText: "Add Email",

                  icon: PlusCircleIcon,
                  onAction: handleAddEmailTag
                }}
                options={[]}
                textField={<Autocomplete.TextField
                  onChange={handleEmailInputChange}
                  type="email"
                  value={emailInput}
                  placeholder="Email"
                  autoComplete="off"
                  error={emailError}
                />}
              />
              <Box paddingBlockStart="200" paddingBlockEnd="200">
                <InlineStack gap={400}>
                  {selections.emails && selections.emails.length > 0 && selections.emails.map((tag, index) => (
                    <Tag key={index} onRemove={() => handleRemoveEmailTag(index)}>
                      {tag}
                    </Tag>
                  ))}
                </InlineStack>
              </Box>
            </Box>
        }
          </Box>
        }
        open={active}
        primaryAction={{
          content: <div style={{ padding: '6px 15px' }}>Save</div>,
          onAction: () => {
            downloadfile(selections)
          },
          disabled:selections.emails.length <= 0 && selections.exportType != "cur_page_data" ,
          key: "confirmsave"
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {
              handleChange();
            },
            key: "cancel_popup"
          }
        ]}
        onClose={() => {
          handleChange();
        }}
      />
    </Popover>
  );
}

export default Dataexports;
