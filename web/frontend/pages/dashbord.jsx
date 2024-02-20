
import { useAppBridge } from "@shopify/app-bridge-react";
import { Fullscreen } from "@shopify/app-bridge/actions";
import applogo from "../../app_logo.png"
import {
  AppProvider,
  ContextualSaveBar,
  FormLayout,
  Frame,
  Loading,
  Modal,
  TextField,
  Toast,
  TopBar,
  Spinner,
  Icon,
  Button
} from "@shopify/polaris"
import { MaximizeIcon,MinimizeIcon } from "@shopify/polaris-icons";
import { useState, useCallback, useRef, useEffect } from "react"
import Navbar from "../components/navigaton";
import { useAuthenticatedFetch } from "../hooks";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addtag } from "../filterslice";
import en from "@shopify/polaris/locales/en.json";


function HomePage(props) {
  const {setShowBanner,showBanner,setStatus,status} = props;
  const location = useLocation();
  const dispatch = useDispatch();
  const dataobj = useSelector((state) => {
    return state.users;
  })
  if(location.pathname !== "/Datable"){
    dispatch(addtag({ ...dataobj, activeobj: "",columns:""}))
  }
  const app = useAppBridge();
  const [isFullscreen, setFullscreen] = useState(true);
  const [textFullscreen, settextFullscreen] = useState("Minimize");
  const fullscreen = Fullscreen.create(app);
  const [isButtonDisabled, setisButtonDisabled] = useState(false);
  const [syncbuttonText, setsyncbuttonText] = useState("Sync Data");
  const handleActionClick = (e) => {
    if (isFullscreen) {
      settextFullscreen("Minimize")
      fullscreen.dispatch(Fullscreen.Action.ENTER);
      setFullscreen(false);
    } else {     
      settextFullscreen("Fullscreen")
      fullscreen.dispatch(Fullscreen.Action.EXIT);
      setFullscreen(true);
    }
  }
  const [shopname, setshopname] = useState("");
  const [loading, setloading] = useState(true);
  const fetch = useAuthenticatedFetch();


   function cancel() {

    fetch("/api/GetBulk")
  .then(response => {
    if (response.ok) {
      // Process the successful response here
    } else {
      // Log the error details
      console.error('API request failed. Status:', response.status);
      // Optionally, you can log more details like response.statusText, response.headers, etc.
      return response.text(); // or response.json() if the error response is in JSON format
    }
  })
  .then(errorDetails => {
    // If you returned response.text() or response.json() in the error case, you can log it here
    console.error('Error details:', errorDetails);
  })
  .catch(error => {
    // Catch any other unexpected errors during the fetch request
    console.error('Unexpected error:', error);
  });


    setTimeout(() => { 
      setStatus("");
      setShowBanner(true);
     
    }, 2000);
   
    
   }
   const handleEscapeKeyPress = (event) => {
    if (event.keyCode === 27) { // 27 is the key code for the escape key
      settextFullscreen("Fullscreen")
      fullscreen.dispatch(Fullscreen.Action.EXIT);
      setFullscreen(true);
    }
  };

  useEffect(() => { 
    document.addEventListener('keydown', handleEscapeKeyPress);
    handleActionClick ()
    // Create promises for each fetch operation
    const fetchShopName = fetch("/api/getshopname").then((response) => response.json());
    const fetchShopData = fetch("/api/get-shop").then((response) => response.json());
  
    // Use Promise.all to wait for both promises to resolve
    Promise.all([fetchShopName, fetchShopData])
      .then(([shopNameData, shopData]) => {
        setshopname(shopNameData);
        dispatch(addtag({ ...dataobj, plan: { "shop": shopData.data, "billing": shopData.billingdata } }));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error as needed (e.g., set an error state)
      })
      .finally(() => {
        setloading(false); // Set loading to false regardless of success or failure
      });
  
  }, []);
  const defaultState = useRef({
    nameFieldValue: shopname
  })
  const skipToContentRef = useRef(null)

  const [toastActive, setToastActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [userMenuActive, setUserMenuActive] = useState(false)
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false)
  const [modalActive, setModalActive] = useState(false)
  const [nameFieldValue, setNameFieldValue] = useState(
    defaultState.current.nameFieldValue
  )
  const [emailFieldValue, setEmailFieldValue] = useState(
    defaultState.current.emailFieldValue
  )
  const [storeName, setStoreName] = useState(
    defaultState.current.nameFieldValue
  )
  const [supportSubject, setSupportSubject] = useState("")
  const [supportMessage, setSupportMessage] = useState("")

  const handleSubjectChange = useCallback(value => setSupportSubject(value), [])
  const handleMessageChange = useCallback(value => setSupportMessage(value), [])
  const handleDiscard = useCallback(() => {
    setEmailFieldValue(defaultState.current.emailFieldValue)
    setNameFieldValue(defaultState.current.nameFieldValue)
    setIsDirty(false)
  }, [])
  const handleSave = useCallback(() => {
    defaultState.current.nameFieldValue = nameFieldValue
    defaultState.current.emailFieldValue = emailFieldValue

    setIsDirty(false)
    setToastActive(true)
    setStoreName(defaultState.current.nameFieldValue)
  }, [emailFieldValue, nameFieldValue])
  const handleSearchResultsDismiss = useCallback(() => {
    setSearchActive(false)
    setSearchValue("")
  }, [])
  const toggleToastActive = useCallback(
    () => setToastActive(toastActive => !toastActive),
    []
  )
  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive(userMenuActive => !userMenuActive),
    []
  )
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        mobileNavigationActive => !mobileNavigationActive
      ),
    []
  )
  const toggleModalActive = useCallback(
    () => setModalActive(modalActive => !modalActive),
    []
  )

  const logo = {
    topBarSource:
      applogo,
    width: 150,
    url: '#',
    accessibilityLabel: 'Shopify',
  };

  const toastMarkup = toastActive ? (
    <Toast onDismiss={toggleToastActive} content="Changes saved" />
  ) : null
  const secondaryMenuMarkup = (
    <div  style={{
      display: 'flex',
      alignItems: 'center',
    }}>
          <Button 
        primary
        disabled={status == "completed !!" ? false : true}
        onClick={status == "completed !!" ? cancel : null}
      >
        {status == "completed !!" ? "Sync Data" : "Syncing"}
      </Button>
      
  <div style={{marginLeft:"10px"}}>
  <TopBar.Menu
        activatorContent={
          <span
            style={{
              display: 'inline-flex', // Use inline-flex to align horizontally
              alignItems: 'center',   // Vertically center children
              cursor: 'pointer',
            }}
          
          >
            <Icon source={textFullscreen == "Fullscreen" ? MaximizeIcon : MinimizeIcon} color="base" style={{ marginRight: '8px'}} />
            {textFullscreen}
           
          </span>
          
        }
  
        onOpen={handleActionClick}
      />
  </div>
    </div>
   
  );

  
  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message="Unsaved changes"
      saveAction={{
        onAction: handleSave
      }}
      discardAction={{
        onAction: handleDiscard
      }}
    />
  ) : null

  const userMenuMarkup = (
    <TopBar.UserMenu
      name={shopname}
      detail={storeName}
      initials={shopname.charAt(0).toUpperCase()}
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
    />
  )

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
     secondaryMenu={secondaryMenuMarkup}
     
      searchResultsVisible={searchActive}
      onSearchResultsDismiss={handleSearchResultsDismiss}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  )

  const loadingMarkup = isLoading ? <Loading /> : null

  const modalMarkup = (
    <Modal
      open={modalActive}
      onClose={toggleModalActive}
      title="Contact support"
      primaryAction={{
        content: "Send",
        onAction: toggleModalActive
      }}
    >
      <Modal.Section>
        <FormLayout>
          <TextField
            label="Subject"
            value={supportSubject}
            onChange={handleSubjectChange}
            autoComplete="off"
          />
          <TextField
            label="Message"
            value={supportMessage}
            onChange={handleMessageChange}
            autoComplete="off"
            multiline
          />
        </FormLayout>
      </Modal.Section>
    </Modal>
  )
  return (
    <>
      {!loading ?
        <AppProvider
          i18n={en}
        >
          <Frame
            topBar={topBarMarkup}
            logo={logo}
            navigation={<Navbar setShowBanner={setShowBanner} showBanner={showBanner} setStatus={setStatus} status={status} />}
            showMobileNavigation={mobileNavigationActive}
            onNavigationDismiss={toggleMobileNavigationActive}
            skipToContentTarget={skipToContentRef}
          >
            {contextualSaveBarMarkup}
            {loadingMarkup}
            {props.ruts}
            {toastMarkup}
            {modalMarkup}
          </Frame>
        </AppProvider>
        : <Spinner />}
    </>
  )
}

export default HomePage;
