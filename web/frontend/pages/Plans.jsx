import { Page, Grid, Box, InlineStack, BlockStack, Button, Icon, Card, Popover  } from "@shopify/polaris"
import { CheckIcon, XIcon, InfoIcon } from "@shopify/polaris-icons";
import React, { useEffect, useState } from "react"
import { useAuthenticatedFetch } from "../hooks";
import { useSelector } from "react-redux";
import Sk_plans from "../Skeleto/sk_plans";

function Plans() {
  const [loading, setloading] = useState(true);
  const dataobj = useSelector((state) => {
    return state.users;
  })
  const [planloading, setplanloading] = useState(true);
  const [allplans, setallplans] = useState([]);
  const [activeplans, setactiveplans] = useState("");
  const [shopplan, setshopplan] = useState({});
  const fetch = useAuthenticatedFetch();
  useEffect(() => {
   
    setactiveplans(dataobj.plan.billing.name)
    Promise.all([
      fetch('/api/getplans').then((response) => response.json()),
      fetch('/api/getactiveplan').then((response) => response.json()),
    ])
    .then(([plandata,activeplan]) => {
        if(dataobj.plan.length > 0){
     
        setactiveplans(dataobj.plan.billing.name)
        }else{
         
       
          setactiveplans(activeplan.collection[0].name)
        }
        setshopplan(plandata.shopplan)
        setallplans(plandata.collection)
        setloading(false);
      })
      .catch((error) => {
        // Handle errors if necessary
        console.error(error);
        setloading(false); // Set loading to false in case of an error
      });
    // }
  }, []);

  const queryParameters = new URLSearchParams(window.location.search)
  const myappplan = queryParameters.get("myappplan");
  let test = false;
  if (myappplan) {
    test = true;
  }
  
  const postPayment = async (name, price) => {
    setplanloading(name);
    const returnurl = await fetch('/api/post-billing', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name, shop: dataobj.plan.shop, test: test, price })
    });
    const url = await returnurl.json();
    window.open(url.data, '_top');
  }

  const [activePopover, setActivePopover] = useState(null);

  const togglePopover = (index) => {
    setActivePopover(activePopover === index ? null : index);
  };


  return <>
    {!loading ?(
      <Page
        fullWidth
        title="Plans"
      >
        <Grid>
          {allplans.map((obj, index) => {
            // console.log(obj.plan_id);
            // console.log(activeplans);
            return (
              <Grid.Cell key={index} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }} >
                <Card background={obj.plan_id == activeplans ? "bg-surface-inverse" : "bg-fill"}>
                <div className={obj.avail == "true" ? "" : "card_disabled" } style={obj.avail !== 'true' ? { opacity: 0.7 } : {}}>
                 <div class="fl">
                  
                  <Box paddingBlockStart="300" paddingBlockEnd="600" >
                    <h1 style={obj.plan_id == activeplans ? { color: '#FFFFFF', fontSize: "20px",marginBottom:"5px" } : { fontSize: "20px",marginBottom:"5px" }} className="plan_card">{obj.plan_name}</h1>
                    <p style={obj.plan_id == activeplans ? { color: '#FFFFFF' } : {}}>{`( ${obj.plan_type})`}</p>
                  </Box>
                  {obj.avail !== "true"  ? ( 
                 <div key={index} style={{ marginBottom: '20px' }}>
                 <div onClick={() => togglePopover(index)}>
                   <Icon source={InfoIcon} tone="base" />
                 </div>
                 <Popover
                   active={activePopover === index}
                   onClose={() => togglePopover(index)}
                   activator={<div />}
                 >
                   <Popover.Section>
                     <p>This plan is not compatible with your current shopify plan.</p>
                   </Popover.Section>
                 </Popover>
               </div>
                   ): (<div></div>)}
                 
                  </div>
                  <BlockStack gap="300">
                    {obj["plan_features"].map(element => (
                      <Box key={element.feature} paddingBlockStart="2" paddingBlockEnd="2">
                        <InlineStack align="start">
                          {element.available == "true" ? (
                          <CheckIcon style={obj.plan_id == activeplans ? { width: '20px', height: '20px', marginRight: "10px", fill: "#FFFFFF" } : { width: '20px', height: '20px', marginRight: "10px" }} />
                          ):(<XIcon style={obj.plan_id == activeplans ? { width: '20px', height: '20px', marginRight: "10px", fill: "#FFFFFF" } : { width: '20px', height: '20px', marginRight: "10px" }} />
                          )}
                          <p style={obj.plan_id == activeplans ? { color: '#FFFFFF' } : {}}>{element.feature}</p>
                        </InlineStack>
                      </Box>
                    ))}
                    <Box paddingBlockStart="200" paddingBlockEnd="200">
                      <InlineStack align="center">
                        <Button disabled={obj.plan_id == activeplans  || obj.avail !== 'true'} fullWidth loading={obj.plan_id == planloading} onClick={() => postPayment(obj.plan_id, obj.price)}>{(obj.plan_id == activeplans) ? "Active Plan" : "Select Plan"}</Button>
                      </InlineStack>
                    </Box>
                  </BlockStack>
              </div>
                </Card>
              </Grid.Cell>
            );
          })}
        </Grid>
      </Page>
    ):<Sk_plans/>}
  </>;
}

export default Plans