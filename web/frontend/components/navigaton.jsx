import React from "react";
import {
  Navigation,
  Box,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ChatIcon,
  HomeIcon,
  ClockIcon,
  SearchResourceIcon,
  MarketsIcon,
} from "@shopify/polaris-icons";
import TrackComponent from "../pages/track";
function Navbar({ setShowBanner, showBanner, status, setStatus }) {




  const dataobj = useSelector((state) => {
    return state.users;
  });
  const navt = useNavigate();
  return (
    <Navigation location={location.pathname}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <Navigation.Section
          separator
          items={[
            {
              label: "Dashboard",
              onClick: () => {
                navt("/");
              },
              selected: location.pathname === "/" ? true : false,
              icon: HomeIcon,
            },
            {
              label: "Schedules",
              icon: ClockIcon,
              selected: location.pathname === "/scheduledata" ? true : false,
              onClick: () => {
                  navt("/scheduledata");
              },
            },
            {
              label: "Custom Reports",
              icon: SearchResourceIcon,
              selected:location.pathname === "/cusreportspage" || dataobj.activeobj.reporttype == "custom" ? true :false,
              onClick: () => {
              
                  navt("/cusreportspage");
              
              },
            },
            {
              label: "Plans",
              icon: MarketsIcon,
              selected: location.pathname === "/plans" ? true : false,
              onClick: () => {
                navt("/plans");
              },
            },
            // {
            //   label: "Settings",
            //   icon: SettingsMinor,
            //   onClick: () => {
            //     navt("/settings");
            //   },
            // },
          ]}
          action={{
            icon: ChatIcon,
            accessibilityLabel: "Contact support",
          }}
        />
  
      
          {status != "completed !!" && (
        <Box paddingBlockEnd="0" paddingBlockStart="400" paddingInlineStart="400" paddingInlineEnd="400">
        <TrackComponent setShowBanner={setShowBanner} showBanner={showBanner} setStatus={setStatus} status={status}/>
        </Box>
       ) }

        {status == "completed !!" && (
        <Box paddingBlockEnd="0" paddingBlockStart="400" paddingInlineStart="400" paddingInlineEnd="400">
        <TrackComponent setShowBanner={setShowBanner} showBanner={showBanner} setStatus={setStatus} status={status}/>
        </Box>
       ) }
      </div>
        {/* <Box paddingBlockEnd="500" paddingInlineStart="400" paddingInlineEnd="400" >
          <Button fullWidth icon={StarFilledMinor} onClick={()=> window.open('https://apps.shopify.com/report-expert/reviews', '_blank')}>Leave a review</Button> 
       </Box> */}
    </Navigation>
  );
}

export default Navbar;
