import {
  LegacyCard,
  ResourceList,
  ResourceItem,
  Text,
  Modal,
  Spinner,
  Page,
  EmptyState,
  Toast,
  Card
} from "@shopify/polaris"
import React, { useCallback, useEffect, useState } from "react"
import { useAuthenticatedFetch } from "../hooks";
import Delete_report from "./Data/Deletereport";
import { useNavigate } from "react-router-dom";
import Create_custom_report from "./Data/Create_custom_report";
import Sk_customreport from "../Skeleto/sk_customreport";


function Customreportspage() {
  let defaultdate = () => {
    function convertdate(dateString,dttype) {
      const inputDate = new Date(dateString);
      let formattedDate;

      const year = inputDate.getUTCFullYear();
      const month = String(inputDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(inputDate.getUTCDate()).padStart(2, '0');
      if(dttype == "end"){
          formattedDate = `${year}-${month}-${day}T23:59:59Z`;
      }else{
          formattedDate = `${year}-${month}-${day}T00:00:00Z`;
      }

      return formattedDate;
  }
    let obj = {};
    obj["start"] = convertdate(new Date(new Date(new Date().setHours(0, 0, 0, 0))).setFullYear(new Date(new Date().setHours(0, 0, 0, 0)).getFullYear() - 1),""),
      obj["end"] = convertdate(new Date(
        new Date(new Date().setDate(new Date(new Date().setHours(0, 0, 0, 0)).getDate() - 1)).setHours(0, 0, 0, 0)),"end")
    return obj;
  }
  const [cusreportfields, setcusreportfields] = useState([]);
  const navt = useNavigate();
  const [onspinner, setonspinner] = useState(false);
  const [customreportdata, setcustomreportdata] = useState({ title: "", Category: "", type: "", report_id: "", default_columns: [], lastactivefilter: [], lastactivefilterquery: "", lastactivedate: defaultdate(), reporttype: "custom", updated: "", datafrom: "lastYear" });
  const [loading, setdolading] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [items, setItems] = useState([]);
  const [toast, setactivetoast] = useState(false);
  const toggleActive = useCallback(() => setactivetoast((active) => !active), []);
  const fetch = useAuthenticatedFetch();
  
  function getTimeAgo(lastSeenTime) {
    const currentTime = new Date();
    const lastSeen = new Date(lastSeenTime);
    const timeDifferenceInSeconds = Math.floor((currentTime - lastSeen) / 1000);

    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // Approximate number of days in a month
    const years = Math.floor(months / 12); // Approximate number of months in a year

    if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return 'just now';
    }
}

  useEffect(() => {
    Promise.all([
      fetch(`/api/Getfieldsinfo`).then((response) => response.json()),
      fetch(`/api/getshoptemplates`).then((response) => response.json()),
    ])
      .then((data) => {

        const customItems = data[1].collection.filter(
          (item) => item.reporttype === "custom"
        );
        setItems(customItems)
        const fieldsInfoData = data[0].collection;
        // Set the state variables
        setcusreportfields(fieldsInfoData);
        setdolading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setdolading(false)
      });
  }, []);

  return (
    <>
    <div className="cus_report_page">
      {!loading ? (
        <Page title="Custom Reports" 
        primaryAction={{ content:  <Create_custom_report newtags={cusreportfields}
        customreport={customreportdata}
        updatecustomreport={setcustomreportdata}/> ,key:"create_cusrp"}}
          fullWidth
        >
          <Card padding="0">
            {items.length > 0 ?
              <ResourceList
                resourceName={{ singular: "customer", plural: "customers" }}
                items={items}
                renderItem={item => {
                  const { title, type, report_id, updated } = item
                  const shortcutActions = [{
                    content: <Delete_report reporttitle={title} reportid={report_id} crpage={"cusreport"} updatedata={setItems} fortoast = {toggleActive}/>
                  }
                  ]

                  return (
                    <ResourceItem
                      id={report_id}
                      shortcutActions={shortcutActions}
                      accessibilityLabel={`View details for ${title}`}
                      name={title}
                      onClick={() => {
                        navt(`/Datable?id=${report_id}`);
                      }}
                    >
                      <Text as="p" fontWeight="medium">
                       {title}
                      </Text>
                      <Text variant="bodyMd" as="h3" fontWeight="bold">
                         <span style={{ fontWeight: 'normal' }}>{getTimeAgo(updated)}</span>
                      </Text>

                      {deleteItemId === report_id && (
                        <Modal
                          open={true}
                          onClose={() => setDeleteItemId(null)}
                          title="Delete Custom Report"
                          primaryAction={{
                            content: (
                              onspinner ? (
                                <Spinner accessibilityLabel="Small spinner example" size="small" />
                              ) : (
                                "Delete"
                              )
                            ),
                            destructive: true,
                            onAction: handleDeleteSchedule,
                            key:"delete_confirm"
                          }}
                          secondaryActions={[
                            {
                              content: "Cancel",
                              onAction: () => setDeleteItemId(null),
                              key:"cancel_pop"
                            },
                          ]}
                        >
                          <Modal.Section>
                            <p>Are you sure you want to delete
                              <Text as="p" fontWeight="bold">
                                {title}
                              </Text>
                            </p>
                          </Modal.Section>
                        </Modal>
                      )}
                    </ResourceItem>
                  )
                }}
              />
              : <EmptyState
                heading="No Reports Found"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
              </EmptyState>}
          </Card>
          {toast &&
          <Toast content="Deleted" onDismiss={toggleActive} />
        }
        </Page>
      ) : <Sk_customreport />}
      </div>
    </>
  )
}
export default Customreportspage;