import {Card, DatePicker, Icon, Popover, TextField } from "@shopify/polaris";
import { useEffect, useRef, useState } from "react";
import { CalendarIcon } from "@shopify/polaris-icons";

function Datepick(props) {
  // Set your initial date string in the desired format
  function formatDate(inputDateString) {
    const date = new Date(inputDateString);
  
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
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

  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    props.dateselect !== "" ? new Date(props.dateselect) : new Date()
  );
  const [{ month, year }, setDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });
  const datePickerRef = useRef(null);

  function isNodeWithinPopover(node) {
    return datePickerRef?.current ? nodeContainsDescendant(datePickerRef.current, node) : false;
  }

  function handleInputValueChange(value) {
    console.log(props.dateselect);
  }

  function handleOnClose({ relatedTarget }) {
    setVisible(false);
  }

  function handleMonthChange(month, year) {
    setDate({ month, year });
  }

  function handleDateSelection({ end: newSelectedDate }) {
    console.log(newSelectedDate)
    props.updateSelection(props.index,[formatDate(newSelectedDate)])
    props.fieldchange(props.index,formatDate(newSelectedDate))
    setSelectedDate(newSelectedDate);
    setVisible(false);
  }

   function handleInputBlur({ relatedTarget }) {
     const isRelatedTargetWithinPopover =
     relatedTarget != null && isNodeWithinPopover(relatedTarget);
     // If focus moves from the TextField to the Popover
     // we don't want to close the popover
     if (isRelatedTargetWithinPopover) {
       return;
      }
    }

  useEffect(() => {
    if (selectedDate) {
      setDate({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      });
    }
  }, [selectedDate]);

  return (
    <Popover
      active={visible}
      autofocusTarget="none"
      preferredAlignment="left"
      fullWidth
      preferInputActivator={false}
      preferredPosition="below"
      preventCloseOnChildOverlayClick
      onClose={handleOnClose}
      activator={
        <TextField
          role="combobox"
          prefix={<Icon source={CalendarIcon} />}
          value={props.dateselect !== "" ? props.dateselect : formatDate(selectedDate)}
          onFocus={() => setVisible(true)}
          onBlur={handleInputBlur}
          onChange={handleInputValueChange}
          autoComplete="off"
        />
      }
    >
      <Card ref={datePickerRef} fullWidth>
        <DatePicker
        fullWidth
          month={month}
          year={year}
          selected={selectedDate}
          onMonthChange={handleMonthChange}
          onChange={handleDateSelection}
        />
      </Card>
    </Popover>
  );
}

export default Datepick;
