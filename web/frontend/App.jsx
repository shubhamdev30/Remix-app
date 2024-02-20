import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { useState } from 'react'
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import { Provider } from "react-redux";
import reduxstore from "./reduxstore";
import { Box, Frame } from "@shopify/polaris";
import Navbar from "./components/navigaton";
import HomePage from "./pages/dashbord";

export default function App() {
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const [showBanner, setShowBanner] = useState(true);
  const [status, setStatus] = useState("");
  
  return (
    <Provider store = {reduxstore}>
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: "Schedules",
                  destination: "/scheduledata",
                },
                {
                  label: "Custom Reports",
                  destination: "/cusreportspage",
                },
                {
                  label: "Plans",
                  destination: "/plans",
                },
              ]}
            />
            <HomePage ruts = {<Routes pages={pages} setShowBanner={setShowBanner} showBanner={showBanner} setStatus={setStatus} status={status} />} setShowBanner={setShowBanner} showBanner={showBanner} setStatus={setStatus} status={status} />
            
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
    </Provider>
  );
}
