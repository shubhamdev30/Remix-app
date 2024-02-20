import { Page,Box,Button} from "@shopify/polaris"
import React, { useState } from 'react'
import { useAuthenticatedFetch } from '../hooks';
import TrackComponent from "./track";

function Settings({setShowBanner,showBanner,setStatus,status}) {

  let fetch = useAuthenticatedFetch();
  let [showManualtracker, setshowManualtracker] = useState(false);
  function cancel() {
    if(showManualtracker){
      setshowManualtracker(false);
      
    }else{
      setshowManualtracker(true);
      let fet = fetch("/api/GetBulk");

    }


   }

  return (
    <Page
    backAction={{ content: 'Settings', onAction: () => { window.history.back() } }}
    title={"Settings"}
    fullWidth
  >
    <Box >
    <Button size="large" onClick={cancel} >Sync Data</Button>
    <Box paddingBlockStart="400">
    <TrackComponent setShowBanner={setShowBanner} showBanner={showBanner} setStatus={setStatus} status={status}/>
    </Box>
   
    </Box>
    </Page>
  )
}

export default Settings