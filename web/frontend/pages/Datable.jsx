import {
  Pagination,
  Spinner,
  InlineStack,
  BlockStack,
  Box,
  Page,
  ButtonGroup,
  Tag,
  Card,
  Toast,
  EmptyState,
  Layout,
  Text,
  Banner,
  Icon,
} from "@shopify/polaris";
import { useState, useEffect, useCallback } from "react";
import DateRangePicker from "./Data/Datepicker";
import { useAuthenticatedFetch } from "../hooks";
import { PrintIcon, SaveIcon,DuplicateIcon } from "@shopify/polaris-icons";
import FullDataTableExample from "./Data/newdatatable";
import Columnsnew from "./Data/ColumnsNew";
import filterquery from "./Data/Filterquery";
import { dataapi } from "./Data/dataapis";
import Dataexports from "../components/dataexports/dataexport";
import Renametitle from "../components/dataexports/Renametitle";
import Delete_report from "./Data/Deletereport";
import Schedule from "../components/Schedule/Schedule";
import { useLocation, useNavigate, NavLink,} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addtag } from "../filterslice";
import Ordersdatable from "./Ordersdatatable";
import Activecol from "../components/activecol";
import Productsdatatable from "./productsdatable";
import NotFound from "./NotFound";
import Testfilter from "./Data/tesfilter";
import Sk_table from "../Skeleto/sk_table";
function Datatable() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dataid = queryParams.get("id") || "0";

  const dispatch = useDispatch();
  const dataobj = useSelector((state) => {
    return state.users;
  });
  const navt = useNavigate();

  const [MoreCount, setMoreCount] = useState(0);

  const [toast, setactivetoast] = useState(false);
  const [pageloader, setpageloader] = useState(true);
  const [opacityload, setopacityload] = useState(true);
  const [templatedata, settemplatedata] = useState();
  const [activefiltertag, setactivefiltertag] = useState([]);
  const [querydata, setquerydata] = useState("");
  const [disablefield, setdisablefield] = useState(true);
  const fetch = useAuthenticatedFetch();
  const [myOrders, setmyOrders] = useState([]);
  const [freshd, setfreshd] = useState([]);
  const [freshdlength, setfreshdlength] = useState(0);
  const [allobj, setallobj] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [activedtformet, setactdtformet] = useState("");
  const [activecomp, setactivecomp] = useState(true);
  const [Reportitle, setreportitle] = useState("");
  const [datefilter, setdatefilter] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [onfilter, setonfilter] = useState(false);
  const [activedaterange, setactivedaterange] = useState("");
  const [empty, setempty] = useState(false);
  const [paginate, setpaginate] = useState(false);
  const [columndata, setcolumndata] = useState([]);
  const [savingdata, setsavingdata] = useState(false);
  const [duplicatedata, setduplicatedata] = useState(false);
  const [activecolumns, setactivecolumns] = useState([]);
  const [currency, setcurrency] = useState("");
  const [countryCode, setcountryCode] = useState("");
  const [currencysymbol, setcurrencysymbol] = useState("");
  const [marktag, setmarktag] = useState([]);
  const [errorpage, seterrorpage] = useState(false);
  const [activeplan, setactiveplan] = useState({});
  const [activebanner, setactivebanner] = useState(false);

  let sessionStorageKey = `template__${currentPage}_${dataid}_${JSON.stringify(
    activedaterange
  )}`;
  let storedData = sessionStorage.getItem(sessionStorageKey);
  function getCurrentTime() {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = String(currentTime.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(currentTime.getDate()).padStart(2, "0");
    const hours = String(currentTime.getHours()).padStart(2, "0");
    const minutes = String(currentTime.getMinutes()).padStart(2, "0");
    const seconds = String(currentTime.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  function getCurrencySymbol(currency) {
    try {
      if (!currency) {
        // Handle the case where currency is not provided
        console.warn("Currency code is not provided.");
        return null;
      }

      const currencyFormatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency,
      });

      const parts = currencyFormatter.formatToParts(0);
      for (let part of parts) {
        if (part.type === "currency") {
          return part.value;
        }
      }
    } catch (error) {
      console.error("Error getting currency symbol:", error);
    }
    return null; // Return null if no currency symbol is found
  }

  function updateDates(selectionOption) {
    // Get the current date
    const currentDate = new Date();

    // Initialize the start and last date variables
    let startDate = "";
    let lastDate = "";

    // Switch based on the selection option
    switch (selectionOption) {
      case "today":
        startDate = new Date(new Date());
        lastDate = new Date(new Date());
        break;
    case "alltime":
      startDate = new Date(2006, 0, 1); 
      lastDate =  new Date(new Date()); 
      break;
      case "yesterday":
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 1);
        lastDate = new Date(currentDate);
        lastDate.setDate(currentDate.getDate() - 1); 
        
        break;
      case "last7days":
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 7); // Set to 7 days ago
        lastDate = new Date(currentDate);
        break;
      case "last30days":
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 30); // Set to 30 days ago
        lastDate = new Date(currentDate);
        break;
      case "last90days":
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 90); // Set to 90 days ago
        lastDate = new Date(currentDate);
        break;
      case "last365days":
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 365); // Set to 90 days ago
        lastDate = new Date(currentDate);
        break;
      case "lastMonth":
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        );
        lastDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        );
        break;
      case "lastQuarter":
        const quarterStartMonth = Math.floor(currentDate.getMonth() / 3) * 3;
        startDate = new Date(
          currentDate.getFullYear(),
          quarterStartMonth - 3,
          1
        );
        lastDate = new Date(currentDate.getFullYear(), quarterStartMonth, 0);
        break;
      case "lastYear":
        startDate = new Date(currentDate.getFullYear() - 1, 0, 1);
        lastDate = new Date(currentDate.getFullYear() - 1, 11, 31);
        break;
      case "weekToDate":
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the first day of the week
        lastDate = new Date(currentDate);
        break;
      case "monthToDate":
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        lastDate = new Date(currentDate);
        break;
      case "quarterToDate":
        const quarterStartMonthQTD = Math.floor(currentDate.getMonth() / 3) * 3;
        startDate = new Date(
          currentDate.getFullYear(),
          quarterStartMonthQTD,
          1
        );
        lastDate = new Date(currentDate);
        break;
      case "yearToDate":
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        lastDate = new Date(currentDate);
        break;
      case "quater1":
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        lastDate = new Date(currentDate.getFullYear(), 2, 31);
        break;
      case "quater2":
        startDate = new Date(currentDate.getFullYear(), 3, 1);
        lastDate = new Date(currentDate.getFullYear(), 5, 30);
        break;
      case "quater3":
        startDate = new Date(currentDate.getFullYear(), 6, 1);
        lastDate = new Date(currentDate.getFullYear(), 8, 30);
        break;
      case "quarter4":
        startDate = new Date(currentDate.getFullYear(), 9, 1);
        lastDate = new Date(currentDate.getFullYear(), 11, 31);
        break;
      default:
        // Handle default case if needed
        break;
    }

    function formatDate(date,dttype) {
      let formattedDate;
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      if(dttype == "end"){
        formattedDate = `${year}-${month}-${day}T23:59:59Z`;
    }else{
        formattedDate = `${year}-${month}-${day}T00:00:00Z`;
    }

    return formattedDate;
    }

    // Update the object
    const dateObj = {
      start: formatDate(startDate,""),
      end: formatDate(lastDate,"end"),
    };
    return dateObj;
  }
  useEffect(() => {
    getActive(dataid);
    setactiveplan(dataobj.plan);
   
  }, [activecolumns]);

  function getActive(dataid) {
    if (
      Object.keys(dataobj.activeobj).length == 0 ||
      dataobj.activeobj == undefined ||
      dataobj.activeobj.report_id != dataid
    ) {
      fetch(`/api/getshoptemplates`)
        .then((response) => response.json())
        .then((data) => {
          let activeobj = data.collection.find(
            (obj) => obj.report_id == dataid
          );
          if (activeobj != undefined) {
            seterrorpage(false);
            settemplatedata(activeobj);
            setactivefiltertag(activeobj.lastactivefilter);
            setmarktag(activeobj.lastactivefilter);
            setactdtformet(activeobj.datafrom);
            setquerydata(activeobj.lastactivefilterquery);
            setactivecolumns(activeobj.default_columns);
            setreportitle(activeobj.title);
            if (Object.keys(activeobj.lastactivedate).length !== 0) {
              if (activeobj.datafrom == "Custom") {
                setdatefilter(activeobj.lastactivedate);
              } else {
                setdatefilter(updateDates(activeobj.datafrom));
              }
            }
            // fetchdata(activeobj)
            dispatch(addtag({ ...dataobj, activeobj: activeobj }));
          } else {
            seterrorpage(true);
            setpageloader(false);
          }
        });
    } else {
      settemplatedata(dataobj.activeobj);
      setactivefiltertag(dataobj.activeobj.lastactivefilter);
      setmarktag(dataobj.activeobj.lastactivefilter);
      setquerydata(dataobj.activeobj.lastactivefilterquery);
      setactivecolumns(dataobj.activeobj.default_columns);
      setactdtformet(dataobj.activeobj.datafrom);
      setreportitle(dataobj.activeobj.title);
      if (Object.keys(dataobj.activeobj.lastactivedate).length !== 0) {
        if (dataobj.activeobj.datafrom == "Custom") {
          setdatefilter(dataobj.activeobj.lastactivedate);
        } else {
          setdatefilter(updateDates(dataobj.activeobj.datafrom));
        }
      }
      dispatch(addtag({ ...dataobj, activeobj: dataobj.activeobj }));

      // console.log(dataobj.activeobj);
      fetchdata(dataobj.activeobj);
    }
  }

  const updatecolumns = (value) => {
    setactivecolumns(value);

    if (Object.keys(dataobj.activeobj).length != 0) {
      dispatch(
        addtag({
          ...dataobj,
          activeobj: { ...dataobj.activeobj, default_columns: value },
        })
      );
    } else {
      dispatch(
        addtag({
          ...dataobj,
          activeobj: { ...templatedata, default_columns: value },
        })
      );
    }
  };
  const duplicatereport = () => {
    let createreportid = new Date().toISOString().replace(/[-T:.]/g, "");
    setduplicatedata(true);
    let newsavedata = JSON.stringify({
      ...templatedata,
      title: `${Reportitle}-Copy`,
      default_columns: activecolumns,
      lastactivefilterquery: querydata,
      lastactivefilter: activefiltertag,
      lastactivedate: datefilter,
      reporttype: "custom",
      report_id: createreportid,
      datafrom: activedtformet,
      updated: getCurrentTime(),
    });
    fetch(`/api/savereport/?data=${encodeURIComponent(newsavedata)}`)
      .then((response) => response.json())
      .then((data) => {
        setduplicatedata(false);
        getActive(createreportid);
        navt(`/Datable?id=${createreportid}`);
      });
  };
  const updatefilterquery = (value) => {
    setquerydata(value);
  };

  const savedata = () => {
    let createreportid = new Date().toISOString().replace(/[-T:.]/g, "");
    setsavingdata(true);
    let newsavedata = JSON.stringify({
      ...templatedata,
      title: Reportitle,
      default_columns: activecolumns,
      lastactivefilterquery: querydata,
      lastactivefilter: activefiltertag,
      lastactivedate: datefilter,
      reporttype: "custom",
      report_id:
        templatedata.reporttype == "pre"
          ? createreportid
          : templatedata.report_id,
      datafrom: activedtformet,
      updated: getCurrentTime(),
    });
    fetch(`/api/savereport/?data=${encodeURIComponent(newsavedata)}`)
      .then((response) => response.json())
      .then((data) => {
        setsavingdata(false);
        toggleActive();
      });
  };

  const filterfunction = (val, newquery, pgnum) => {
    fetchdata({ tags: val, newquery: newquery });
    setmarktag(val);
  };

  const fetchdata = (val) => {
    if(val && val.opacityload != undefined){
      setopacityload(false)
    }else{
      setopacityload(true)   
    }
    let activedate;
    let query =
      val && val.newquery !== undefined
        ? val.newquery
        : val && val.lastactivefilterquery !== undefined
          ? val.lastactivefilterquery
          : querydata;
    let sorting =
      val && val.sorting !== undefined
        ? val.sorting
        : dataobj.activeobj.sorting?.index
          ? dataobj.activeobj.sorting
          : {};

    if (Object.keys(dataobj.activeobj).length != 0) {
      console.log(sorting,Object.keys(dataobj.activeobj).length);
      dispatch(
        addtag({
          ...dataobj,
          activeobj: {
            ...templatedata,
            title: Reportitle,
            default_columns: activecolumns,
            lastactivefilterquery: query,
            lastactivefilter: val && val.tags !== undefined ? val.tags : activefiltertag,
            lastactivedate: datefilter,
            datafrom: activedtformet,
            sorting: sorting,
            },
          })
          );
        }
        console.log(dataobj);
        setIsLoading(true);
    let activetemptype =
      templatedata != undefined ? templatedata.Category : val.Category;
    let pgnum = val && val.pgnum == "true" ? 1 : currentPage;
    if (val && val.lastactivedate != undefined) {
      if (val.datafrom == "Custom") {
        activedate = val.lastactivedate;
      } else {
        activedate = updateDates(val.datafrom);
      }
    } else {
      activedate = datefilter;
    }

    const pageno = val?.pageno ? val.pageno : 0;
    //  let up_sorting = dataobj.activeobj.sorting?.index ? dataobj.activeobj.sorting : {};

    dataapi(
      activetemptype,
      query,
      activedate,
      pgnum,
      fetch,
      activecolumns,
      sorting,
      pageno,
      "",
      "",
      "",
      dataobj.columns,
    )
      .then((data) => {
        // set currency and country code
        console.log(data)
        const currencySymbol = getCurrencySymbol(data.currency);
        setcurrency(data.currency);
        setcountryCode(data.country_code);
        setcurrencysymbol(currencySymbol);
        // set columndata
        setcolumndata(data.columns);
        // dispatch(
        //   addtag({
        //     ...dataobj,
        //     columns:data.columns,
        //     })
        // );
        if (Object.keys(dataobj.activeobj).length != 0) {
          dispatch(
            addtag({
              ...dataobj,
              columns:data.columns,
              activeobj: {
                ...templatedata,
                title: Reportitle,
                default_columns: activecolumns,
                lastactivefilterquery: query,
                lastactivefilter:
                  val && val.tags !== undefined ? val.tags : activefiltertag,
                  lastactivedate: datefilter,
                  datafrom: activedtformet,
                  sorting: sorting,
                },
              })
              );
            }
 
        

        // set main data
        setmyOrders(data.api_maindata.collection);
        setallobj(data.api_maindata.allobj);
        if (pageno == 0) {
          setfreshd(data.api_maindata.freshdata);
          setfreshdlength(data.api_maindata.freshdata.length);
        } else {
          let  allfreshdata = [...freshd, ...data.api_maindata.freshdata];
          let newdata = allfreshdata.filter((value, index, array)=>{
            console.log(array.indexOf(value))
          })
          console.log(allfreshdata)
          console.log(newdata)
          setfreshdlength(allfreshdata.length);
          setfreshd(allfreshdata);
        }
        setTotalPages(data.api_maindata.totalPages);
        setCurrentPage(pageno);
        setempty(data.api_maindata.anotherl === 0);
        setMoreCount(data.api_maindata.anotherl);
        setMoreCount((prevCount) => {
          const updatedCount = prevCount + data.api_maindata.anotherl;

          if (data.api_maindata.anotherl < 20) {
            if (data.api_maindata.currentPage == data.api_maindata.totalPages) {
              setpaginate(true);
            } else {
              setpaginate(false);
            }
          } else {
            setpaginate(true);
          }
          return updatedCount;
        });
        setIsLoading(false);
        setonfilter(true);
        setpageloader(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // console.log(freshd);

  const toggleActive = useCallback(
    () => setactivetoast((active) => !active),
    []
  );
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const removeTag = (value) => {
    const updatedfields = [...activefiltertag];
    updatedfields.splice(value, 1);
    setactivefiltertag(updatedfields);
    setmarktag(updatedfields);
    setquerydata(
      JSON.stringify(
        filterquery(updatedfields, columndata, templatedata.Category)
      )
    );
    fetchdata({
      newquery: JSON.stringify(
        filterquery(updatedfields, columndata, templatedata.Category)
      ),
      rmtag: "yes",
    });
    dispatch(
      addtag({
        ...dataobj,
        activeobj: {
          ...templatedata,
          lastactivefilter: updatedfields,
          lastactivefilterquery: JSON.stringify(
            filterquery(updatedfields, columndata, templatedata.Category)
          ),
        },
      })
    );
  };

  const tagMarkup = marktag.map(
    (option, i) =>
      option.tag !== "" && (
        <div className="custom-truncate custom-max-width-home">
          <Tag
            key={option.tag}
            index={i}
            onRemove={() => {
              removeTag(i);
            }}
          >
            {option.tag} {option.condition} {option.multiple.join(" Or ")}
          </Tag>
        </div>
      )
  );

  const handleSort = (index, direction) => {
    setCurrentPage(0);
    function findKeyByLabel(labelToSearch) {
      for (const section of columndata) {
        for (const item of section.values) {
          if (item.label === labelToSearch) {
            return item.key;
          }
        }
      }
      return null;
    }
    var ColumnKey = findKeyByLabel(activecolumns[index]);
console.log(ColumnKey);
    settemplatedata({
      ...templatedata,
      sorting: { index: ColumnKey, direction: direction },
    });
    fetchdata({ sorting: { index: ColumnKey, direction: direction }, pageno: 0 });
  };



  function backhome() {
    navt("/plans");
  }

  const loadNextPage = async (event) => {
    event.preventDefault();
  
    setCurrentPage(currentPage + 1);
    fetchdata({ pageno: currentPage + 1 ,opacityload:opacityload})
  };

  return <>
    {!pageloader && !errorpage && (
      <Page
        backAction={{ content: "Products", onAction: () => navt("/") }}
        title={
          <Text variant="headingLg" as="h1">
            {Reportitle}
          </Text>
        }
        secondaryActions={[
          {
            content: (
              <Dataexports
                dataquery={querydata}
                columndata={columndata}
                currency={currency}
                alertbanner = {setactivebanner}
                template={templatedata}
                countrycode={countryCode}
                activecolumn={activecolumns}
                data={freshd}
                title={templatedata.title}
                date={datefilter}
              />
            ),
            key: "Dataexport",
          },
            templatedata.reporttype == "custom" && {
            content:<span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding:"4px 8px"
            }}
            onClick={() => duplicatereport()}
          >
            { duplicatedata ? (
                <Spinner accessibilityLabel="Saving" size="small" />
              ) : (
                <>
                <Icon source={DuplicateIcon} color="base" style={{ padding: '20px' }} />
                Duplicate
                </>
              )}
          </span>
          },
          {
            content: (
              <Schedule
                report_id={templatedata.report_id}
                tempdata={dataobj.activeobj}
              />
            ),
            key: "Schedule",
          },
          {
            content:<span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding:"4px 8px"
            }}
            onClick={() => window.print()}
          >
            <Icon source={PrintIcon} color="base" style={{ padding: '20px' }} />
            Print
          </span>
          },
          templatedata.reporttype == "custom" && {
            content: (
              <Delete_report
              reporttitle={Reportitle}
                reportid={templatedata.report_id}
              />
            ),
            key: "deletetemplate",
          },
          {
            content: (
              <Renametitle
                updatetitle={setreportitle}
                reporttitle={Reportitle}
              />
            ),
            key: "Renametemplate",
          },
          {
            content:<span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding:"4px 8px"
            }}
            onClick={() => templatedata.reporttype == "pre" ? duplicatereport() : savedata()}
          >
            {savingdata || duplicatedata ? (
                <Spinner accessibilityLabel="Saving" size="small" />
              ) : (
                <>
                <Icon source={SaveIcon} color="base" style={{ padding: '20px' }} />
               Save Report
                </>
              )}
          </span>
          },
        ]}
        fullWidth
        >
        <Box>
          <BlockStack gap="500">
          
            <InlineStack>
            <div class="group-result">
              <ButtonGroup>
                <DateRangePicker
                  activedate={setdatefilter}
                  setdaterange={setactivedaterange}
                  activedaterange={activedaterange}
                  currentdate={datefilter}
                  reloadpage={fetchdata}
                  activedtformet={activedtformet}
                  setactdtformet={setactdtformet}
                  loading={isLoading}
                />
                {
                  <Testfilter
                    currentpagedata={freshd}
                    activecolumns={activecolumns}
                    newtags={columndata}
                    curpage={currentPage}
                    refreshfunction={() => setCurrentPage(0)}
                    filterfunction={(newfields, newquery, val) => {
                      filterfunction(newfields, newquery);
                    }}
                    filterquery={setquerydata}
                    activefields={setactivefiltertag}
                    fields={activefiltertag}
                    activetemp={templatedata}
                    disablefield={disablefield}
                    setdisablefield={setdisablefield}
                    loading={isLoading}
                    />
                  }
                {
                  <Columnsnew
                  newtags={columndata}
                  curpage={currentPage}
                    refreshfunction={() => setCurrentPage(0)}
                    filterfunction={(newfields, newquery, val) => {
                      filterfunction(newfields, newquery);
                    }}
                    columnsupdate={updatecolumns}
                    activecolumns={activecolumns}
                    loading={isLoading}
                  />
                }
                {
                  <Activecol
                    newtags={columndata}
                    loading={isLoading}
                    columnsupdate={updatecolumns}
                    activecolumns={activecolumns}
                    setactivecomp={setactivecomp}
                    activecomp={activecomp}
                  />
                }
              </ButtonGroup>

             <Text>Showing {freshdlength} results.</Text>

             </div>
            </InlineStack>
         
            {activebanner &&
            <Banner title="Your data are exporting" fullWidth onDismiss={() => setactivebanner(false)}>
              <p>Your export will be delivered on your emails. Depending on how many data you’re exporting, this could take a few moments.</p>
            </Banner>
}       
            <Box style={{ marginBottom: "50px" }}>
              {activecolumns.length !== 0 || freshd.length < 1 ? (
                templatedata.Category === "Orders" ? (
                  <Ordersdatable
                    loading={isLoading}
                    handleSort={handleSort}
                    tagmarkup={tagMarkup}
                    tagcount={marktag.length}
                    currencysymbol={currencysymbol}
                    currency={currency}
                    opacityload={opacityload}
                    countryCode={countryCode}
                    data={freshd}
                    empty={empty}
                    activecolumns={activecolumns}
                    columndata={columndata}
                    style={{ marginBottom: "20px" }}
                    dataType={templatedata.Category}
                  />
                ) : templatedata.Category === "Products" ? (
                  <Productsdatatable
                    loading={isLoading}
                    handleSort={handleSort}
                    tagcount={marktag.length}
                    tagmarkup={tagMarkup}
                    currencysymbol={currencysymbol}
                    opacityload={opacityload}
                    currency={currency}
                    countryCode={countryCode}
                    data={freshd}
                    empty={empty}
                    activecolumns={activecolumns}
                    columndata={columndata}
                    dataType={templatedata.Category}
                  />
                ) : (
                  <FullDataTableExample
                    currencysymbol={currencysymbol}
                    handleSort={handleSort}
                    currency={currency}
                    countryCode={countryCode}
                    loading={isLoading}
                    data={freshd}
                    empty={empty}
                    tagcount={marktag.length}
                    opacityload={opacityload}
                    tagmarkup={tagMarkup}
                    activecolumns={activecolumns}
                    columndata={columndata}
                    dataType={templatedata.Category}
                    />
                    )
              ) : (
                <EmptyState
                  heading="No Active Columns Found"
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>Customize Your New Columns.</p>
                </EmptyState>
              )}
              {allobj.length === 1 && allobj[0].rows.length == 300 && (
                <Layout>
                  <Layout.Section>
                    <Card sectioned>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <NavLink external={false} onClick={loadNextPage}>
                          {isLoading ? <Spinner size="small" /> : "Load More"}

                        </NavLink>
                      </div>
                    </Card>
                  </Layout.Section>
                </Layout>
              )}
              {empty == false &&
                paginate == true &&
                isLoading == false &&
                totalPages > 1 && (
                  <Card>
                    <Box
                      paddingBlockStart="2"
                      paddingBlockEnd="2"
                      display="flex"
                    >
                      <Pagination
                        hasPrevious={currentPage > 1}
                        hasNext={currentPage < totalPages}
                        onPrevious={() => {
                          setIsLoading(true);
                          handlePageChange(currentPage - 1);
                        }}
                        onNext={() => {
                          setIsLoading(true);
                          handlePageChange(currentPage + 1);
                        }}
                      />
                    </Box>
                  </Card>
                )}
            </Box>
          </BlockStack>
        </Box>
        {toast && <Toast content="Saved" onDismiss={toggleActive} />}
      </Page>
    )}
    {pageloader && <Sk_table />}
    {errorpage && <NotFound />}
  </>;
}
export default Datatable;
