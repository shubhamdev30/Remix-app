export const dataapi = (id, querydata, datefilter, currentPage, fetch, default_columns, sorting, pageno,type,emails,exportformet,dataobj) => {

    console.log(dataobj)

    return new Promise((resolve, reject) => {
        function convertdate(dateString,dttype) {
            const inputDate = new Date(dateString);
            let formattedDate;

            const year = inputDate.getUTCFullYear();
            const month = String(inputDate.getUTCMonth() + 1).padStart(2, '0');
            const day = String(inputDate.getUTCDate()).padStart(2, '0');
            const hours = String(inputDate.getUTCHours()).padStart(2, '0');
            if(dttype == "end"){
                formattedDate = `${year}-${month}-${day}T23:59:59Z`;
            }else{
                formattedDate = `${year}-${month}-${day}T00:00:00Z`;
            }
    
            return formattedDate;
        }
        function getCurrencySymbol(currency) {
            try {
              if (!currency) {
                // Handle the case where currency is not provided
                console.warn('Currency code is not provided.');
                return null;
              }
        
              const currencyFormatter = new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: currency,
              });
        
              const parts = currencyFormatter.formatToParts(0);
              for (let part of parts) {
                if (part.type === 'currency') {
                  return part.value;
                }
              }
            } catch (error) {
              console.error('Error getting currency symbol:', error);
            }
            return null; // Return null if no currency symbol is found
          }
        let api_data = {};
        let datequery = {
            createdAt: {
                $gte: convertdate(datefilter.start,""), $lte: convertdate(datefilter.end,"end")
            }
        }
        const greeting = `${(querydata != "") ? JSON.stringify(querydata) : '"{}"'}`;
        let sessionStorageKey = `orders_data_${currentPage}_${greeting}_${JSON.stringify(datequery)}`;
        let storedData = sessionStorage.getItem(sessionStorageKey);
        switch (id) {
            case 'Orders':

                function fetchCurrency() {
                    return fetch(`/api/GetCurrency`)
                        .then((response) => response.json())
                        .then((data) => {
                            api_data["currency"] = data.currency;
                            api_data["country_code"] = data.country_code;
                        });
                }

                function fetchGetcolumnData() {
                    if(dataobj != undefined && dataobj.length <= 0){
                    return fetch(`/api/Getcolumn`)
                        .then((response) => response.json())
                        .then((data) => {
                            api_data["columns"] = data.collection;
                        });
                    }else{
                        return api_data["columns"]=dataobj
                    }
                }

                function fetchOrdersData(page, datequery, querydata) {
                    return new Promise((resolve, reject) => {

                        let qry = "";

                        let qry1 = "";
                        if (querydata !== "") {

                            let jsonObject = {};
                            try {
                                jsonObject = JSON.parse(querydata);
                                jsonObject.orderQuery.processedAt = datequery.createdAt;

                            } catch (error) {
                                console.error('Error parsing JSON:', error);
                            }
                            qry1 = JSON.stringify(jsonObject);


                        }
                        else {

                            let jsonObject = { orderQuery: {}, lineitemsQuery: {} };

                            try {
                                jsonObject.orderQuery.processedAt = datequery.createdAt;

                            } 
                            catch (error) {
                                console.error('Error parsing JSON:', error);
                            }

                            qry = JSON.stringify(jsonObject);


                        }
                        if (storedData) {
                            api_data["api_maindata"] = JSON.parse(storedData);
                            resolve(api_data);
                        }
                        else {
                         

                           const bodydata = {
                            columns:api_data.columns,
                            currency:api_data.currency,
                            countrycode:api_data.country_code,
                            currencysymbol:getCurrencySymbol(api_data.currency),
                            activeColumns:default_columns,
                            sorting:sorting,
                            page:currentPage,
                            currentpage:pageno,
                            datatype:`${(querydata !== "") ? qry1 : qry}`,
                            type:`${(type != undefined) ? type : ""}`,
                            emails:`${(emails != undefined) ? emails : ""}`,
                            exportformet:`${(exportformet != undefined) ? exportformet : ""}`
                            
                           }
                           

                            fetch(`/api/GetOrders`,{
                                method:"POST",
                                body: JSON.stringify(bodydata),
                                headers:{
                                    "Accept":'application/json',
                                    "Content-Type":'application/json'
                                }
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    api_data["api_maindata"] = data;
                                    console.log(api_data);
                                    
                                    resolve(api_data);
                                })
                                .catch((error) => {
                                    console.error(error);
                                    reject(error);
                                });
                        }
                    });
                }

                if (querydata !== "") {
                    if (storedData) {
                        let api_data = JSON.parse(storedData);
                        resolve(api_data);
                    }
                    else {
                        fetchCurrency()
                            .then(() => {
                                return fetchGetcolumnData();
                            }).then(() => {
                                return fetchOrdersData(currentPage, datequery, querydata);
                            })
                            .then((apiData) => {
                                resolve(apiData);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                }
                else {
                    if (storedData) {
                        let api_data = JSON.parse(storedData);
                        resolve(api_data);
                    }
                    else {


                        fetchCurrency()
                            .then(() => {
                                return fetchGetcolumnData();
                            }).then(() => {
                                return fetchOrdersData(currentPage, datequery, querydata);
                            })
                            .then((apiData) => {
                                resolve(apiData);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                }
                break;
            case 'Customer':
            
            function fetchCustomerCurrency() {
                return fetch(`/api/GetCurrency`)
                    .then((response) => response.json())
                    .then((data) => {
                        api_data["currency"] = data.currency;
                        api_data["country_code"] = data.country_code;
                    });
            }

                function fetchcustomercolumnData() {
                    if(dataobj != undefined && dataobj.length <= 0){
                    return fetch(`/api/getcustomercolumn`)
                        .then((response) => response.json())
                        .then((data) => {
                            api_data["columns"] = data.collection;
                        });
                    }else{
                        return api_data["columns"] = dataobj
                    }
                }

                function fetchcustomersdata(page, datequery, querydata) {
                    return new Promise((resolve, reject) => {
                        let qry = JSON.stringify(datequery);
                        let qry1 = "";
                        if (querydata !== "") {
                            qry1 = JSON.stringify(Object.assign(JSON.parse(querydata), datequery));
                            //   sessionStorageKey = `orders_data_${currentPage}_${JSON.stringify(querydata)}_${JSON.stringify(datequery)}`;
                        }
                        if (storedData) {
                            api_data["api_maindata"] = JSON.parse(storedData);
                            resolve(api_data);
                        }
                        else {


                            const bodydata = {
                                columns:api_data.columns,
                                currency:api_data.currency,
                                countrycode:api_data.country_code,
                                currencysymbol:getCurrencySymbol(api_data.currency),
                                activeColumns:default_columns,
                                sorting:sorting,
                                page:currentPage,
                                currentpage:pageno,
                                datatype:`${(querydata !== "") ? qry1 : qry}`,
                                type:`${(type != undefined) ? type : ""}`,
                                emails:`${(emails != undefined) ? emails : ""}`,
                                exportformet:`${(exportformet != undefined) ? exportformet : ""}`
                               }

                            fetch(`/api/GetCustomers`,{
                                method:"POST",
                                body: JSON.stringify(bodydata),
                                headers:{
                                    "Accept":'application/json',
                                    "Content-Type":'application/json'
                                }
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    api_data["api_maindata"] = data;
                                    // sessionStorage.setItem(sessionStorageKey, JSON.stringify(api_data));
                                    resolve(api_data);
                                })
                                .catch((error) => {
                                    console.error(error);
                                    reject(error);
                                });
                        }
                    });
                }


                if (querydata !== "") {
                    if (storedData) {
                        let api_data = JSON.parse(storedData);
                        resolve(api_data);
                    }
                    else {
                        fetchCustomerCurrency()
                        .then(() => {
                            return  fetchcustomercolumnData();
                        }).then(() => {
                                return fetchcustomersdata(currentPage, datequery, querydata);
                            })
                            .then((apiData) => {
                                resolve(apiData);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                }
                else {
                    if (storedData) {
                        let api_data = JSON.parse(storedData);
                        resolve(api_data);
                    }
                    else {
                        fetchCustomerCurrency()
                        .then(() => {
                            return  fetchcustomercolumnData();
                        }).then(() => {
                                return fetchcustomersdata(currentPage, datequery, querydata);
                            })
                            .then((apiData) => {
                                resolve(apiData);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                }
                break;
          
                case 'Products':

            function fetchProductCurrency() {
                return fetch(`/api/GetCurrency`)
                    .then((response) => response.json())
                    .then((data) => {
                        api_data["currency"] = data.currency;
                        api_data["country_code"] = data.country_code;
                    });
            }

                function fetchproductcolumnData() {
                    if(dataobj != undefined && dataobj.length <= 0){
                    
                    return fetch(`/api/getproductcolumn`)
                        .then((response) => response.json())
                        .then((data) => {
                            api_data["columns"] = data.collection;
                        });
                    }else{
                        return api_data["columns"] = dataobj
                    }
                }

                function fetchproductsdata(currentPage, datequery, querydata) {
                    return new Promise((resolve, reject) => {
                        let qry = "";
                        let qry1 = "";
                        if (querydata !== "") {

                            let jsonObject = {};
                            try {
                                jsonObject = JSON.parse(querydata);
                                jsonObject.productQuery.createdAt = datequery.createdAt;

                            } catch (error) {
                                console.error('Error parsing JSON:', error);
                            }
                            qry1 = JSON.stringify(jsonObject);


                        }
                        else {

                            let jsonObject = { productQuery: {}, variantsQuery: {} };

                            try {
                                jsonObject.productQuery.createdAt = datequery.createdAt;

                            } catch (error) {
                                console.error('Error parsing JSON:', error);
                            }

                            qry = JSON.stringify(jsonObject);


                        }
                        if (storedData) {
                            api_data["api_maindata"] = JSON.parse(storedData);
                            resolve(api_data);
                        }
                        else {

                            const bodydata = {
                                columns:api_data.columns,
                                currency:api_data.currency,
                                countrycode:api_data.country_code,
                                currencysymbol:getCurrencySymbol(api_data.currency),
                                activeColumns:default_columns,
                                sorting:sorting,
                                page:currentPage,
                                currentpage:pageno,
                                datatype:`${(querydata !== "") ? qry1 : qry}`,
                                type:`${(type != undefined) ? type : ""}`,
                                emails:`${(emails != undefined) ? emails : ""}`,
                                exportformet:`${(exportformet != undefined) ? exportformet : ""}`
                               }
                               


                            fetch(`/api/Getproducts`,{
                                method:"POST",
                                body: JSON.stringify(bodydata),
                                headers:{
                                    "Accept":'application/json',
                                    "Content-Type":'application/json'
                                }
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    api_data["api_maindata"] = data;
                                    // sessionStorage.setItem(sessionStorageKey, JSON.stringify(api_data));
                                    resolve(api_data);
                                })
                                .catch((error) => {
                                    console.error(error);
                                    reject(error);
                                });
                        }
                    });
                }

                if (querydata !== "") {
                    if (storedData) {
                        let api_data = JSON.parse(storedData);
                        resolve(api_data);
                    }
                    else {
                        fetchProductCurrency().then(() => {
                            return  fetchproductcolumnData();
                        }).then(() => {
                                return fetchproductsdata(currentPage, datequery, querydata);
                            })
                            .then((apiData) => {
                                resolve(apiData);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                }
                else {
                    if (storedData) {
                        let api_data = JSON.parse(storedData);
                        resolve(api_data);
                    }
                    else {
                        fetchProductCurrency().then(() => {
                            return  fetchproductcolumnData();
                        }).then(() => {
                                return fetchproductsdata(currentPage, datequery, querydata);
                            })
                            .then((apiData) => {
                                resolve(apiData);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                }
                break;
            case 'Variants':

            function fetchVariantCurrency() {
                return fetch(`/api/GetCurrency`)
                    .then((response) => response.json())
                    .then((data) => {
                        api_data["currency"] = data.currency;
                        api_data["country_code"] = data.country_code;
                    });
            }

                function fetchvariantcolumnData() {
                    
                    return fetch(`/api/getvariantcolumn`)
                        .then((response) => response.json())
                        .then((data) => {
                            api_data["columns"] = data.collection;
                        });
                }
                function fetchvariantsdata(currentPage, datequery, querydata) {
                    return new Promise((resolve, reject) => {
                        let qry = JSON.stringify(datequery);
                        let qry1 = "";
                        if (querydata !== "") {
                            qry1 = JSON.stringify(Object.assign(JSON.parse(querydata), datequery));
                            //   sessionStorageKey = `orders_data_${currentPage}_${JSON.stringify(querydata)}_${JSON.stringify(datequery)}`;
                        }
                        if (storedData) {
                            api_data["api_maindata"] = JSON.parse(storedData);
                            resolve(api_data);
                        }
                        else {
                            fetch(`/api/Getvariants?page=${currentPage}&datatype=${encodeURIComponent(`${(querydata !== "") ? qry1 : qry}`)}`)
                                .then((response) => response.json())
                                .then((data) => {
                                    api_data["api_maindata"] = data;
                                    // sessionStorage.setItem(sessionStorageKey, JSON.stringify(api_data));
                                    resolve(api_data);
                                })
                                .catch((error) => {
                                    console.error(error);
                                    reject(error);
                                });
                        }
                    });
                }

                if (querydata !== "") {
                    if (storedData) {
                        let api_data = JSON.parse(storedData);
                        resolve(api_data);
                    }
                    else {
                        fetchVariantCurrency().then(()=>{
                            return fetchvariantcolumnData();
                        }).then(() => {
                                return fetchvariantsdata(currentPage, datequery, querydata);
                            })
                            .then((apiData) => {
                                resolve(apiData);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                }
                else {
                    if (storedData) {
                        let api_data = JSON.parse(storedData);
                        resolve(api_data);
                    }
                    else {
                        fetchVariantCurrency().then(()=>{
                            return fetchvariantcolumnData();
                        }).then(() => {
                                return fetchvariantsdata(currentPage, datequery, querydata);
                            })
                            .then((apiData) => {
                                resolve(apiData);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                }
                break;
            default:
                reject("Invalid ID");
                break;
        }
    });
};