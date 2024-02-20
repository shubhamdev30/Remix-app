import React, { useState, useEffect, useCallback } from "react";
import {
  LegacyCard,
  ResourceList,
  ResourceItem,
  Text,
  Icon,
  Modal,
  Toast,
  Spinner,
  Badge,
  Page,
  Loading,
  EmptyState,
  Box,
  BlockStack,
} from "@shopify/polaris";
import { DeleteIcon, EditIcon, ListBulletedIcon, PauseCircleIcon, PlayIcon } from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "../hooks";
import Schedule from "../components/Schedule/Schedule";
import { useSelector } from "react-redux";
import Sk_schedule from "../Skeleto/sk_schedule";

function Scheduledata() {
  const dataobj = useSelector((state) => {
    return state.users;
  })
  const fetch = useAuthenticatedFetch();
  const [items, setItems] = useState([]);
  const [loading, setdolading] = useState(true);
  const [onspinner, offspinner] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [scheduleupdate, setscheduleupdate] = useState(false);
  const [scheduleupdateid, setscheduleupdateid] = useState("");
  const [templatesdata, settemplatesdata] = useState([]);
  const [schedulehistory, setschedulehistory] = useState([]);
  const [test, settest] = useState(false);
  const [hisload, sethisload] = useState(false);
  
  const [toast, setactivetoast] = useState(false);
  
  const shistory = (id) => {
    settest((active) => !active)
    sethisload(true)
    fetch('/api/getschedulehistory').then((response) => response.json()).then((data) => {
        
      console.log(data.collection);      
      setschedulehistory(data.collection.filter((item) => item.sh_id == id));
      sethisload(false)
    })
  }
  useEffect(() => {
    // let scheduleInfoData = sessionStorage.getItem("scheduleInfoData");
    // let shoptemplatesData = sessionStorage.getItem("shoptemplatesData");
    // if(scheduleInfoData  != undefined && shoptemplatesData != undefined){
    //   setItems(JSON.parse(scheduleInfoData));
    //   settemplatesdata(JSON.parse(shoptemplatesData))
    //   setdolading(false); 
    // }else{
    Promise.all([
      fetch('/api/getschedules').then((response) => response.json()),
      fetch('/api/getshoptemplates').then((response) => response.json()),
      fetch('/api/getschedulehistory').then((response) => response.json()),
    ])
      .then(([schedulesData, shopTemplatesData, schedulehistorys]) => {
        setItems(schedulesData.data);
        settemplatesdata(shopTemplatesData.collection)
        setdolading(false);
        // sessionStorage.setItem("scheduleInfoData", JSON.stringify(schedulesData.data));
        // sessionStorage.setItem("shoptemplatesData", JSON.stringify(shopTemplatesData.collection));
        //  // Set loading to false after both requests are complete
      })
      .catch((error) => {
        // Handle errors if necessary
        console.error(error);
        setdolading(false); // Set loading to false in case of an error
      });
    // }
  }, []);


  const toggleActive = useCallback(() => setactivetoast((active) => !active), []);
  const handleDeleteSchedule = () => {
    offspinner(true)
    fetch(`/api/deleteschedule?data={"sh_id":"${deleteItemId}"}`)
      .then((response) => response.json())
      .then((data) => {
        setItems((prevItems) => prevItems.filter((item) => item.sh_id !== deleteItemId));
        setDeleteItemId(null);
        offspinner(false)
        setactivetoast(true)
      })
  };
  const activestatus = (id) => {
    offspinner(true)
    let a = {};
    const updatedItems = items.map((item) => {
      if (item.sh_id === id) {
        // Toggle the status between "active" and "Draft"
        item.status = item.status === "active" ? "Draft" : "active";
        a = item;
      }
      return item;
    });
    setItems(updatedItems);
    fetch(`/api/saveschedule?data=${encodeURIComponent(JSON.stringify(a))}`)
      .then((response) => response.json())
      .then((data) => {
        setscheduleupdate(false)
        offspinner(false)
        fetch(`/api/manageschedule?shdata=${encodeURIComponent(JSON.stringify(items.find(obj => obj.sh_id === id)))}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          })
      })
  };

  return <>
    {!loading ? (
      <Page title="Schedules"
      backAction={test !== false ? {content: 'Products', onAction:()=>settest(false)} : null}
        primaryAction={{ content: <Schedule templates={templatesdata} title="New Schedule" updateitems={setItems} type="new" /> ,key:"create_schedule"}}
        fullWidth>
          <div className="schedule_page_data">
        {test !== true &&
          <LegacyCard>
            {items.length > 0 ?
              <ResourceList
                resourceName={{ singular: "customer", plural: "customers" }}
                items={items}
                renderItem={(item) => {
                  const {
                    _id,
                    title,
                    sh_id,
                    interval,
                    day,
                    month,
                    date,
                    hours,
                    formet,
                    timezone,
                    status
                  } = item;

                  item["timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;


                  const shortcutActions = [
                    {
                      content: (
                        <div
                        className="schedule_page_btn"
                        onClick={() => {
                          shistory(sh_id)
                        }}
                        >
                          <Icon
                            source={ListBulletedIcon}
                            color="base"
                          />
                        </div>
                      ),
                    },
                    {
                      content: (
                        <div
                        className="schedule_page_btn"
                          onClick={() => setDeleteItemId(sh_id)}
                        >
                          <Icon
                            source={DeleteIcon}
                            color="base"
                          />
                        </div>
                      ),
                    },
                    {
                      content: <Schedule
                      templates={templatesdata}
                        sh_data={item}
                        updateitems={setItems}
                      />
                    },
                    {
                      content: (
                        item.status == "active" ?
                          <div  className="schedule_page_btn" onClick={() => {
                            setscheduleupdate(true)
                            setscheduleupdateid(sh_id)
                          }}>
                            <Icon
                              source={PauseCircleIcon}
                              color="base" />
                          </div>
                          :
                          <div className="schedule_page_btn" onClick={() => {
                            setscheduleupdate(true);
                            setscheduleupdateid(sh_id)
                          }}>
                            <Icon
                              source={PlayIcon}
                              color="base"
                            />
                          </div>
                      ),
                    },
                  ];

                  return (
                    <ResourceItem
                      key={sh_id}
                      id={sh_id}
                      accessibilityLabel={`View details for ${name}`}
                      shortcutActions={shortcutActions}
                    >
                      <Box paddingBlockStart="100" paddingBlockEnd="100">
                        <Text variant="bodyMd" fontWeight="bold" as="h3">
                          Title : <span style={{ fontWeight: 'normal' }}>{title}</span>
                        </Text>
                      </Box>
                      <Box paddingBlockStart="100" paddingBlockEnd="100">
                        <Text variant="bodyMd" as="h3" fontWeight="bold">
                          Formet : <span style={{ fontWeight: 'normal' }}>{formet}</span>
                        </Text>
                      </Box>
                      <Box paddingBlockStart="100" paddingBlockEnd="100">
                        <Text variant="bodyMd" as="h3" fontWeight="bold">
                          Interval : <span style={{ fontWeight: 'normal' }}>{interval}</span>
                        </Text>
                      </Box>
                      <Box paddingBlockStart="100" paddingBlockEnd="100">
                        <Text variant="bodyMd" as="h3" fontWeight="bold">
                          Status : {status == "active" ? <Badge status="success">Active</Badge> : <Badge status="info">Draft</Badge>}
                        </Text>
                      </Box>

                      {/* Modal for confirming deletion */}
                      {deleteItemId === sh_id && (
                        <Modal
                          open={true}
                          onClose={() => setDeleteItemId(null)}
                          title="Delete Schedule"
                          primaryAction={{
                            content: (
                              <div style={{ padding: '4px' }}>
                                {onspinner ? (
                                  <Spinner accessibilityLabel="Small spinner example" size="small" />
                                ) : (
                                  <Icon source={DeleteIcon} color="base" />
                                )}
                              </div>
                            ),
                            destructive: true,
                            onAction: handleDeleteSchedule,
                            key:"confirm_p"
                          }}
                          secondaryActions={[
                            {
                              content: "Cancel",
                              onAction: () => setDeleteItemId(null),
                              key:"cancel_p"
                            },
                          ]}
                        >
                          <Modal.Section>
                            <BlockStack>
                              <p>Are you sure you want to delete this schedule?</p>
                            </BlockStack>
                          </Modal.Section>
                        </Modal>
                      )}
                      <Modal
                        open={scheduleupdate}
                        onClose={() => setscheduleupdate(false)}
                        title="Change Schedule"
                        primaryAction={{
                          content: (
                            <div style={{ padding: '6px 15px' }}>
                              {onspinner ? (
                                <Spinner accessibilityLabel="Small spinner example" size="small" />
                              ) : (
                                "Save"
                              )}
                            </div>
                          ),
                          destructive: true,
                          onAction: () => activestatus(scheduleupdateid),
                          key:"schedule_act"
                        }}
                        secondaryActions={[
                          {
                            content: "Cancel",
                            onAction: () => setscheduleupdate(false),
                            key:"schedule_canc"
                          },
                        ]}
                      >
                        <Modal.Section>
                          <BlockStack>
                            <p>Do you want to change this schedule?</p>
                          </BlockStack>
                        </Modal.Section>
                      </Modal>
                    </ResourceItem>
                  );
                }}
              />
              : <EmptyState
                heading="No Schedules Found"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
              </EmptyState>}
          </LegacyCard>
        }
        </div>
        {test == true &&
          <LegacyCard>
          {!hisload ? (
            schedulehistory.length > 0 ? (
              <ResourceList
                resourceName={{ singular: "customer", plural: "customers" }}
                items={schedulehistory}
                renderItem={(item) => {
                  const { _id, reportname, time, emails, interval, title } = item;
                  return (
                    <ResourceItem key={_id} id={_id}>
                      <Box paddingBlockStart="100" paddingBlockEnd="100">
                        <Text as="p" variant="bodyMd" fontWeight="medium">
                          {interval} report {reportname} successfully sent to email(s): {emails.join(",")}
                        </Text>
                        <Text variant="bodyMd" as="h3">
                          {time}
                        </Text>
                      </Box>
                    </ResourceItem>
                  );
                }}
              />
            ) : (
              <EmptyState
                heading="No Any Schedules Found Here"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              />
            )
          ) : (
            <Loading />
          )}
        </LegacyCard>
        
        }
      </Page>
    ) : <Sk_schedule />}
    {toast &&
      <Toast content="Schedule Deleted" onDismiss={toggleActive} />
    }
  </>;
}

export default Scheduledata;
