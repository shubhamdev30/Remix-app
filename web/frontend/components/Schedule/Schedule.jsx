import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  ChoiceList,
  Icon,
  Modal,
  Popover,
  Select,
  Spinner,
  TextField,
  Tag,
  Text,
  InlineStack,
  Autocomplete,
  BlockStack,
} from "@shopify/polaris";
import { CalendarTimeIcon, EditIcon, PlusCircleIcon } from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "../../hooks";

function Schedule(props) {
  const [datepopover, setdatePopover] = useState(false);
  const [onspinner, offspinner] = useState(false);
  const [emailInput, setEmailInput] = useState("")
  const [emailError, setEmailError] = useState("");
  const [userTimeZone, setUserTimeZone] = useState('');

  const toggledatePopover = useCallback(
    () => setdatePopover((popoverActive) => !popoverActive),
    []
  );

  const selecttemplate = (value) => {
    const matchedOption = props.templates.map((obj) => ({
      value: obj.report_id,
      label: obj.title,
    })).find(option => {
      return option.value.match(value)
    })
    return matchedOption
  };

  const dateactivator = (
    <Button onClick={toggledatePopover} disclosure>
      Select date
    </Button>
  );

  const fetch = useAuthenticatedFetch();
  const [schd_values, setschd_values] = useState(
    props.sh_data != undefined
      ? props.sh_data
      : {
        sh_id: "",
        title: "",
        interval: "",
        time: "",
        day: "1",
        month: "",
        date: "",
        hours: "",
        tempdata: (props.tempdata && props.tempdata.report_id == props.report_id) ? JSON.stringify(props.tempdata) : "",
        formet: "csv",
        status: "active",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        template: props.report_id != undefined ? props.report_id : props.templates[0].report_id,
        emails: [],
        datafrom: "last_day"
      }
  );

  const [active, setActive] = useState(false);
  const [index, setindex] = useState(0);
  const [inputValue, setInputValue] = useState(props.templates != undefined ? selecttemplate(schd_values.template).label : "")

  const handleintervalChange = (value) => {
    setschd_values({ ...schd_values, interval: value[0] });
  };

  const handleAddEmailTag = useCallback(() => {
    if (emailInput.trim() !== '') {
      if (validateEmail(emailInput.trim())) {
        setschd_values((prev) => {
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

  const validateEmail = (email) => {
    const emailRegex = /^.+@.+\w*$/;
    return emailRegex.test(email);
  };

  const handleTimeChange = (value) => {
    setschd_values({ ...schd_values, time: value });
  };

  const handleEmailInputChange = useCallback((value) => {
    setEmailInput(value);
    setEmailError("");
  }, []);

  const handleDayChange = (value) => {
    setschd_values({ ...schd_values, day: value[0] });
  };

  const handletitleChange = (value) => {

    setschd_values({ ...schd_values, title: value });
  };

  const handlemonthChange = (value) => {
    setschd_values({ ...schd_values, month: value[0] });
  };
  const handledateChange = (value) => {
    setschd_values({ ...schd_values, date: value[0] });
  };
  const handlehoursChange = (value) => {
    setschd_values({ ...schd_values, hours: value });
  };
  const handleformetChange = (value) => {
    setschd_values({ ...schd_values, formet: value });
  };

  const handletimezoneChange = (value) => {
    setschd_values({ ...schd_values, timezone: value });
  };


  const handletemplateChange = (value) => {
    props.tempdata && props.tempdata.report_id == value ?
      setschd_values({ ...schd_values, tempdata: "", template: value[0] }) :
      setschd_values({ ...schd_values, template: value[0] })
    setInputValue(selecttemplate(value).label)
  };

  const daysOptions = [
    { label: 'Monday', value: 'monday' },
    { label: 'Tuesday', value: 'tuesday' },
    { label: 'Wednesday', value: 'wednesday' },
    { label: 'Thursday', value: 'thursday' },
    { label: 'Friday', value: 'friday' },
    { label: 'Saturday', value: 'saturday' },
    { label: 'Sunday', value: 'sunday' },
  ];

  const allmonths = [
    { label: 'January', value: 'january' },
    { label: 'February', value: 'february' },
    { label: 'March', value: 'march' },
    { label: 'April', value: 'april' },
    { label: 'May', value: 'may' },
    { label: 'June', value: 'june' },
    { label: 'July', value: 'july' },
    { label: 'August', value: 'august' },
    { label: 'September', value: 'september' },
    { label: 'October', value: 'october' },
    { label: 'November', value: 'november' },
    { label: 'December', value: 'december' },
  ];

  const intervals = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  const formets = [
    { label: 'Csv', value: 'csv' },
    { label: 'Pdf', value: 'pdf' },
    { label: 'Excel', value: 'excel' },
  ];

  const TZ = [
    { "label": "Atlantic/Azores", "value": "Atlantic/Azores" },
    { "label": "Atlantic/Cape_Verde", "value": "Atlantic/Cape_Verde" },
    { "label": "Atlantic/South_Georgia", "value": "Atlantic/South_Georgia" },
    { "label": "America/Sao_Paulo", "value": "America/Sao_Paulo" },
    { "label": "America/Argentina/Buenos_Aires", "value": "America/Argentina/Buenos_Aires" },
    { "label": "America/Godthab", "value": "America/Godthab" },
    { "label": "America/St_Johns", "value": "America/St_Johns" },
    { "label": "America/Halifax", "value": "America/Halifax" },
    { "label": "America/La_Paz", "value": "America/La_Paz" },
    { "label": "America/Cuiaba", "value": "America/Cuiaba" },
    { "label": "America/Santiago", "value": "America/Santiago" },
    { "label": "America/Bogota", "value": "America/Bogota" },
    { "label": "America/New_York", "value": "America/New_York" },
    { "label": "America/Indiana/Indianapolis", "value": "America/Indiana/Indianapolis" },
    { "label": "America/Costa_Rica", "value": "America/Costa_Rica" },
    { "label": "America/Chicago", "value": "America/Chicago" },
    { "label": "America/Monterrey", "value": "America/Monterrey" },
    { "label": "America/Edmonton", "value": "America/Edmonton" },
    { "label": "America/Phoenix", "value": "America/Phoenix" },
    { "label": "America/Chihuahua", "value": "America/Chihuahua" },
    { "label": "America/Denver", "value": "America/Denver" },
    { "label": "America/Tijuana", "value": "America/Tijuana" },
    { "label": "America/Anchorage", "value": "America/Anchorage" },
    { "label": "Pacific/Honolulu", "value": "Pacific/Honolulu" },
    { "label": "Pacific/Apia", "value": "Pacific/Apia" },
    { "label": "Africa/Monrovia", "value": "Africa/Monrovia" },
    { "label": "Europe/London", "value": "Europe/London" },
    { "label": "Europe/Berlin", "value": "Europe/Berlin" },
    { "label": "Europe/Belgrade", "value": "Europe/Belgrade" },
    { "label": "Europe/Paris", "value": "Europe/Paris" },
    { "label": "Europe/Belgrade", "value": "Europe/Belgrade" },
    { "label": "Africa/Lagos", "value": "Africa/Lagos" },
    { "label": "Europe/Istanbul", "value": "Europe/Istanbul" },
    { "label": "Africa/Cairo", "value": "Africa/Cairo" },
    { "label": "Africa/Harare", "value": "Africa/Harare" },
    { "label": "Europe/Riga", "value": "Europe/Riga" },
    { "label": "Asia/Jerusalem", "value": "Asia/Jerusalem" },
    { "label": "Europe/Minsk", "value": "Europe/Minsk" },
    { "label": "Africa/Windhoek", "value": "Africa/Windhoek" },
    { "label": "Asia/Baghdad", "value": "Asia/Baghdad" },
    { "label": "Asia/Kuwait", "value": "Asia/Kuwait" },
    { "label": "Europe/Moscow", "value": "Europe/Moscow" },
    { "label": "Africa/Nairobi", "value": "Africa/Nairobi" },
    { "label": "Asia/Tehran", "value": "Asia/Tehran" },
    { "label": "Asia/Muscat", "value": "Asia/Muscat" },
    { "label": "Asia/Baku", "value": "Asia/Baku" },
    { "label": "Asia/Tbilisi", "value": "Asia/Tbilisi" },
    { "label": "Asia/Yerevan", "value": "Asia/Yerevan" },
    { "label": "Asia/Kabul", "value": "Asia/Kabul" },
    { "label": "Asia/Yekaterinburg", "value": "Asia/Yekaterinburg" },
    { "label": "Asia/Tashkent", "value": "Asia/Tashkent" },
    { "label": "Asia/Calcutta", "value": "Asia/Calcutta" },
    { "label": "Asia/Kathmandu", "value": "Asia/Kathmandu" },
    { "label": "Asia/Novosibirsk", "value": "Asia/Novosibirsk" },
    { "label": "Asia/Almaty", "value": "Asia/Almaty" },
    { "label": "Asia/Colombo", "value": "Asia/Colombo" },
    { "label": "Asia/Rangoon", "value": "Asia/Rangoon" },
    { "label": "Asia/Bangkok", "value": "Asia/Bangkok" },
    { "label": "Asia/Krasnoyarsk", "value": "Asia/Krasnoyarsk" },
    { "label": "Asia/Shanghai", "value": "Asia/Shanghai" },
    { "label": "Asia/Irkutsk", "value": "Asia/Irkutsk" },
    { "label": "Asia/Singapore", "value": "Asia/Singapore" },
    { "label": "Australia/Perth", "value": "Australia/Perth" },
    { "label": "Asia/Taipei", "value": "Asia/Taipei" },
    { "label": "Asia/Tokyo", "value": "Asia/Tokyo" },
    { "label": "Asia/Seoul", "value": "Asia/Seoul" },
    { "label": "Asia/Yakutsk", "value": "Asia/Yakutsk" },
    { "label": "Australia/Adelaide", "value": "Australia/Adelaide" },
    { "label": "Australia/Darwin", "value": "Australia/Darwin" },
    { "label": "Australia/Brisbane", "value": "Australia/Brisbane" },
    { "label": "Australia/Sydney", "value": "Australia/Sydney" },
    { "label": "Pacific/Guam", "value": "Pacific/Guam" },
    { "label": "Australia/Hobart", "value": "Australia/Hobart" },
    { "label": "Asia/Vladivostok", "value": "Asia/Vladivostok" },
    { "label": "Pacific/Guadalcanal", "value": "Pacific/Guadalcanal" },
    { "label": "Pacific/Auckland", "value": "Pacific/Auckland" },
    { "label": "Pacific/Fiji", "value": "Pacific/Fiji" },
    { "label": "Pacific/Tongatapu", "value": "Pacific/Tongatapu" }
  ];

  const handleRemoveEmailTag = (index) => {
    setschd_values((prev) => {
      const newTags = [...prev.emails];
      newTags.splice(index, 1);
      return { ...prev, emails: newTags };
    });
  };

  const handleChange = useCallback(() => {
    if (props.type !== undefined && props.type == 'new') {
      let createreportid = new Date().toISOString().replace(/[-T:.]/g, '');
      setschd_values({
        sh_id: createreportid,
        title: '',
        interval: '',
        time: '',
        day: "1",
        month: "",
        date: "",
        tempdata: props.tempdata && props.tempdata.report_id == props.report_id ? JSON.stringify(props.tempdata) : "",
        hours: '',
        formet: 'csv',
        status: 'active',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        template: props.report_id !== undefined ? props.report_id : props.templates[0].report_id,
        emails: [],
        datafrom: "last_day"
      });
    }
    setActive(!active);
  }, [active, props]);

  const indexchange = useCallback(() => {
    offspinner(true);
    fetch(`/api/saveschedule?data=${encodeURIComponent(JSON.stringify(schd_values))}`)
      .then((response) => response.json())
      .then((data) => {
        offspinner(false);
        if (props.updateitems !== undefined) {
          props.updateitems((data) => {
            const filteredArray = data.filter((obj) => obj.sh_id !== schd_values.sh_id);
            return [...filteredArray, schd_values];
          });
        }
        fetch(`/api/manageschedule?shdata=${encodeURIComponent(JSON.stringify(schd_values))}`)
          .then((response) => response.json())
          .then((data) => {
          });
        handleChange();
      });
  }, [fetch, handleChange, props, schd_values]);

  const activator = props.sh_data == undefined ? (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: "center",
        cursor: 'pointer',
        padding: "4px 8px"
      }}
      onClick={() => handleChange()}
    >
      <Icon source={CalendarTimeIcon} color="base" style={{ marginRight: '8px' }} />
      {props.title !== undefined ? "New Schedule" : "Schedule"}
    </span>
  ) : (
    <div className="schedule_page_btn" onClick={() => handleChange()}>
      <Icon source={EditIcon} color="base" />
    </div>
  );

  const [options, setOptions] = useState(props.templates != undefined ? props.templates.map((obj) => ({
    value: obj.report_id,
    label: obj.title,
  })) : "")

  const updateText = (value) => {
    console.log(value)
    setInputValue(value)

    if (value === "") {
      setOptions(props.templates.map((obj) => ({
        value: obj.report_id,
        label: obj.title,
      })))
      return
    }

    const filterRegex = new RegExp(value, "i")
    const resultOptions = props.templates.map((obj) => ({
      value: obj.report_id,
      label: obj.title,
    })).filter(option =>
      option.label.match(filterRegex)
    )

    console.log(resultOptions)
    setOptions(resultOptions)
  }
  const onblurSelection = () => {
    setInputValue(selecttemplate(schd_values.template).label)
  }



  useEffect(() => {
    console.log("testing")
    let createreportid = new Date().toISOString().replace(/[-T:.]/g, '');
    if (props.sh_data !== undefined) {
      setschd_values({ ...schd_values, sh_id: props.sh_data.sh_id });
    } else {
      setschd_values({ ...schd_values, sh_id: createreportid });
    }
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimeZone(detectedTimeZone);
    if (props.templates != undefined) {
      setInputValue(selecttemplate(schd_values.template).label)
    }

  }, [active]);

  return (
    <Modal
      activator={activator}
      open={active}
      onClose={handleChange}
      title={`Schedule Report`}
      primaryAction={{
        content: (
          <div style={{ padding: '6px 15px' }}>
            {onspinner ? (
              <Spinner accessibilityLabel="Small spinner example" size="small" />
            ) : (
              'Start'
            )}
          </div>
        ),
        onAction: () => indexchange(),

        disabled:
          !schd_values.interval ||
          (schd_values.interval === 'daily' &&
            (schd_values.title === '' || schd_values.time === '' ||
              schd_values.emails.length === 0 ||
              schd_values.formet === '')) ||
          (schd_values.interval === 'weekly' &&
            (schd_values.title === '' || schd_values.time === '' ||
              schd_values.emails.length === 0 ||
              schd_values.formet === '' ||
              schd_values.day.length === 0)) ||
          (schd_values.interval === 'monthly' &&
            (schd_values.title === '' || schd_values.date.length === 0 ||
              schd_values.time === '' ||
              schd_values.formet === '' ||
              schd_values.emails.length === 0)) ||
          (schd_values.interval === 'yearly' &&
            (schd_values.title === '' || schd_values.date.length === 0 ||
              schd_values.time === '' || schd_values.month.length === 0 ||
              schd_values.formet === '' ||
              schd_values.emails.length === 0))
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: () => {
            setindex(0);
            handleChange()
          },
        },
      ]}
    >
      <Modal.Section style={{ padding: 0 }}>
        {index === 0 && (
          <BlockStack gap="300">
            <TextField
              label={<Text as="p" fontWeight="medium">Title</Text>}
              value={schd_values.title}
              onChange={handletitleChange}
              autoComplete="off"
            />
            {/* {props.templates !== undefined && (
              <Select
              label={<Text as="p" fontWeight="medium">Select Report</Text>}
              options={props.templates.map((obj) => ({
                  value: obj.report_id,
                  label: obj.title,
                }))}
                value={schd_values.template}
                onChange={handletemplateChange}
                />
                )} */}
            {props.templates !== undefined && (
              <Autocomplete
                options={options}
                selected={schd_values.template}
                onSelect={handletemplateChange}
                textField={<Autocomplete.TextField
                  onChange={updateText}
                  label={<Text as="p" fontWeight="medium">Select Report</Text>}
                  value={inputValue}
                  onBlur={() => onblurSelection()}
                  placeholder="Search"
                  autoComplete="off"
                />}
              />
            )}
            <ChoiceList
              title={<Text as="p" fontWeight="medium">Schedule Interval</Text>}
              choices={intervals}
              selected={schd_values.interval}
              onChange={handleintervalChange}
            />
            {schd_values.interval === 'weekly' && (
              <ChoiceList
                title={<Text as="p" fontWeight="medium">Select Days</Text>}
                choices={daysOptions}
                selected={schd_values.day}
                onChange={handleDayChange}
              />
            )}
            {schd_values.interval === 'yearly' && (
              <ChoiceList
                title={<Text as="p" fontWeight="medium">Select Month</Text>}
                choices={allmonths}
                selected={schd_values.month}
                onChange={handlemonthChange}
              />
            )}
            {/* {['monthly', 'yearly'].includes(schd_values.interval) && (
              <Popover
                active={monthpopover}
                activator={
                  <Button onClick={togglemonthPopover} disclosure>
                    Select Month
                  </Button>
                }
                onClose={togglemonthPopover}
              >
                <Box padding="4">
                  <ChoiceList
                    title="Select Month"
                    choices={monthOptions}
                    selected={schd_values.month}
                    onChange={handlemonthChange}
                    allowMultiple
                  />
                </Box>
              </Popover>
            )} */}
            {['monthly', 'yearly'].includes(schd_values.interval) && (
              <Popover
                active={datepopover}
                activator={dateactivator}
                onClose={toggledatePopover}
              >
                <Box padding="200">
                  <ChoiceList
                    title={<Text as="p" fontWeight="medium">Select Date</Text>}
                    choices={Array.from({ length: 31 }, (_, i) => ({
                      label: (i + 1).toString(),
                      value: (i + 1).toString(),
                    }))}
                    selected={schd_values.date}
                    onChange={handledateChange}
                  />
                </Box>
              </Popover>
            )}
            {schd_values.interval === 'hourly' && (
              <Select
                label={<Text as="p" fontWeight="medium">Select Hour</Text>}
                options={Array.from({ length: 23 }, (_, i) => ({
                  label: (i + 1).toString(),
                  value: (i + 1).toString(),
                }))}
                onChange={handlehoursChange}
                value={schd_values.hours}
              />
            )}
            <Select
              label={<Text as="p" fontWeight="medium">Select Time Zone</Text>}
              options={TZ}
              value={schd_values.timezone}
              onChange={handletimezoneChange}
            />
            {schd_values.interval !== '' && (
              <TextField
                label={<Text as="p" fontWeight="medium">Schedule Time</Text>}
                type="time"
                value={schd_values.time}
                onChange={handleTimeChange}
              />
            )}
            {schd_values.interval !== '' && (
              <Select
                label={<Text as="p" fontWeight="medium">Select Format</Text>}
                options={formets}
                value={schd_values.formet}
                onChange={handleformetChange}
              />
            )}

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
            <InlineStack gap={400}>
              {schd_values.emails && schd_values.emails.length > 0 && schd_values.emails.map((tag, index) => (
                <Tag key={index} onRemove={() => handleRemoveEmailTag(index)}>
                  {tag}
                </Tag>
              ))}
            </InlineStack>
          </BlockStack>
        )}
      </Modal.Section>
    </Modal>
  );
}

export default Schedule;
