import * as XLSX from 'xlsx';
import fs from 'fs';
import nodemailer from 'nodemailer';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import emailcsv from './sendcsv.js';
import emailexcel from './sendexcel.js';
import sendpdf from './sendpdf.js';

export async function Scheduletask(database, shdata, globeldb, countrcd, curncy, ShopData) {

    function getCurrentTimeFormatted() {
        // Get the current date and time
        var currentDate = new Date();

        // Extract day, month, year, hours, and minutes
        var day = currentDate.getDate();
        var monthIndex = currentDate.getMonth();
        var year = currentDate.getFullYear();
        var hours = currentDate.getHours();
        var minutes = currentDate.getMinutes();

        // Function to pad single-digit numbers with a leading zero
        function padZero(number) {
            return (number < 10 ? '0' : '') + number;
        }

        // Function to get the month name
        function getMonthName(monthIndex) {
            var months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            return months[monthIndex];
        }

        // Format the time as "DD Month YYYY at HH:mm"
        var formattedTime = `${day} ${getMonthName(monthIndex)} ${year} at ${padZero(hours)}:${padZero(minutes)}`;

        // Return the formatted time
        return formattedTime;
    }
    function getCurrencySymbol(currency) {
        try {
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


    let bodydata = {
        currency: curncy,
        countrycode: countrcd,
        currencysymbol: getCurrencySymbol(curncy),
        type: "schedule_export",
        emails: shdata.emails,
        exportformet: shdata.formet

    }



    function updateDates(selectionOption) {
        const currentDate = new Date();
        let startDate = "";
        let lastDate = "";

        switch (selectionOption) {
            case "daily":
                startDate = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
                lastDate = new Date(currentDate);
                break;
            case "weekly":
                startDate = new Date(currentDate.getTime() - (6 * 24 * 60 * 60 * 1000)); 
                lastDate = new Date(currentDate);
                break;
            case "monthly":
                startDate = new Date(currentDate.getTime() - (29 * 24 * 60 * 60 * 1000));
                lastDate = new Date(currentDate);
                break;
            case "yearly":
                startDate = new Date(currentDate.getTime() - (364 * 24 * 60 * 60 * 1000));
                lastDate = new Date(currentDate);
                break;
            default:
                // Handle default case if needed
                break;
        }
    
        function formatDate(date, dttype) {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            
            if (dttype == "end") {
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
            } else {
                // For start time, use the same format
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
            }
        }
    
        // Update the object
        const dateObj = {
            start: formatDate(startDate, "start"),
            end: formatDate(lastDate, "end"),
        };
        return dateObj;
    }
    

    let selecttemplate;
    let selectdatetime;
    console.log('Connecting to MongoDB...');
    try {
        console.log('Connected to MongoDB');
        console.log(shdata)

        console.log('Fetching data from MongoDB...');
        if (shdata.tempdata != "") {
            selecttemplate = [JSON.parse(shdata.tempdata)]
        } else {
            let pretemp_coll = globeldb.collection("Premadetemplates");
            let get_coll = database.collection("Templates");
            const shoptemp = await get_coll.find({ report_id: shdata.template }).toArray();
            const precollection = await pretemp_coll.find({ report_id: shdata.template }).toArray();
            selecttemplate = [...precollection, ...shoptemp]
        }
        bodydata = { ...bodydata, activeColumns: selecttemplate[0].default_columns, sorting: selecttemplate[0].sorting != undefined ? selecttemplate[0].sorting : {} }
        selectdatetime = updateDates(shdata.interval)
        if (selecttemplate[0].Category == "Orders") {
            let lastactquery = (selecttemplate[0].lastactivefilterquery != "") ? JSON.parse(selecttemplate[0].lastactivefilterquery) : { "orderQuery": {}, "lineitemsQuery": {} };
            lastactquery.orderQuery.createdAt = { $gte: selectdatetime.start, $lte: selectdatetime.end }
            bodydata = { ...bodydata, datatype: lastactquery }
            bodydata["columns"] = await globeldb.collection("Columns").find().toArray();
            let get_coll = database.collection("Orders");

            const page = parseInt(bodydata.page) || 0;

            let query = bodydata.datatype;

            // constant for this call
            let columndata = bodydata.columns;
            let activecolumns = bodydata.activeColumns;
            let sorting = bodydata.sorting;
            let currency = bodydata.currency;
            let countryCode = bodydata.countrycode;
            let currencysymbol = bodydata.currencysymbol;


            let datatype = bodydata.type;
            let sendemails = bodydata.emails;
            let exportformet = bodydata.exportformet;

            let lineitemsQuery = query.lineitemsQuery;
            let orderQuery = query.orderQuery;
            let pageno = bodydata.currentpage;
            var activeobj = [];

            function findKeyByLabel(labelToSearch) {
                for (const section of columndata) {
                    for (const item of section.values) {
                        if (item.label === labelToSearch) {
                            return item;
                        }
                    }
                }
                return null; // Label not found
            }

            const group_obj = {
                _id: {}
            }

            const merge_obj2 = {};
            const value_index = []


            const updatedlineitemsquery = {}
            const updatedorderquery = {}


            let l_sorting_obj = {
                "_id": -1,
            };


            for (const key in orderQuery) {
                updatedorderquery["order_obj." + key] = orderQuery[key];
            }

            activecolumns.forEach((key, i) => {
                const activeitem = findKeyByLabel(key);


                for (const key in lineitemsQuery) {
                    if (key == activeitem.key) {
                        if (activeitem.type == "String" || activeitem.type == "string") {
                            updatedlineitemsquery[key] = lineitemsQuery[key];
                        }
                    }
                }



                if (sorting.index == activeitem.key) {

                    if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
                        l_sorting_obj = {
                            ["_id." + activeitem.key]: sorting.direction == "ascending" ? 1 : -1,
                            _id: 1
                        };
                    }
                    if (activeitem.type == "number") {
                        l_sorting_obj = {
                            [activeitem.key]: sorting.direction == "ascending" ? 1 : -1,
                            _id: 1
                        };
                    }
                }

                value_index.push(activeitem.key);

                if (activeitem.calltype == "lineitem") {

                    if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
                        group_obj["_id"][activeitem.key] = { $toString: "$" + activeitem.key };
                        merge_obj2[activeitem.key] = "$_id." + activeitem.key;
                    }
                    if (activeitem.type == "number") {
                        group_obj[activeitem.key] = { $sum: { $toDouble: "$" + activeitem.key } };
                        merge_obj2[activeitem.key] = "$" + activeitem.key;
                    }
                }

                if (activeitem.calltype == "order") {

                    if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
                        group_obj["_id"][activeitem.key] = { $toString: "$order_obj." + activeitem.key };
                        merge_obj2[activeitem.key] = "$_id." + activeitem.key;
                    }
                    if (activeitem.type == "number") {
                        group_obj[activeitem.key] = { $sum: { $toDouble: "$order_obj." + activeitem.key } };
                        merge_obj2[activeitem.key] = "$" + activeitem.key;
                    }
                }

            });



            let aggregatesArray = [];

            console.log("fffffff", updatedorderquery, merge_obj2, l_sorting_obj, group_obj);


            aggregatesArray = [
                {
                    $match: {
                        __parentId: { $exists: true },
                    }
                },
                {
                    $match: updatedlineitemsquery
                },
                {
                    $match: updatedorderquery
                },
                {
                    $group: group_obj
                },
                {
                    $sort: l_sorting_obj
                },
                {
                    $group: {
                        _id: null,
                        rows: {
                            $push: {
                                $map: {
                                    input: {
                                        $objectToArray: {
                                            $mergeObjects: [
                                                merge_obj2
                                            ]
                                        }
                                    },
                                    as: 'item',
                                    in: '$$item.v'
                                }
                            }
                        }
                    }
                }
            ]
            console.log(aggregatesArray);

            const Arp = await get_coll.aggregate(aggregatesArray).toArray();
            let allrows = Arp.length ? Arp[0].rows : [];


            function formatMoney(value, currency, symbol) {
                const formattedValue = new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: currency,
                }).format(value);

                return `${formattedValue}`;
            }

            activecolumns.forEach((key, i) => {

                const activeitem = findKeyByLabel(key);
                if (activeitem.format == "money") {
                    const moneyValue = allrows.forEach((key, j) => {


                        const moneyValueAsNumber = parseFloat(key[i]);


                        const formattedMoney = formatMoney(moneyValueAsNumber, currency, currencysymbol);

                        allrows[j][i] = formattedMoney;

                    });

                }
            });

            if (exportformet == "csv") {
                emailcsv(activecolumns, allrows, "Title", sendemails)
            } else if (exportformet == "excel") {
                emailexcel(activecolumns, allrows, "Title", sendemails)
            } else if (exportformet == "pdf") {
                sendpdf(activecolumns, allrows, "Title", sendemails)
            }
        } else if (selecttemplate[0].Category == "Products") {
            const get_coll = database.collection("Products");
            const get_var = database.collection("Variants");
            bodydata["columns"] = await globeldb.collection("productcolumns").find().toArray();
            let lastactquery = (selecttemplate[0].lastactivefilterquery != "") ? JSON.parse(selecttemplate[0].lastactivefilterquery) : { "productQuery": {}, variantsQuery: {} }
            lastactquery.productQuery.createdAt = { $gte: selectdatetime.start, $lte: selectdatetime.end }
            bodydata = { ...bodydata, datatype: lastactquery }
            const query = bodydata.datatype;

            let columndata = bodydata.columns;
            let activecolumns = bodydata.activeColumns;
            let sorting = bodydata.sorting;
            let currency = bodydata.currency;
            let countryCode = bodydata.countrycode;
            let currencysymbol = bodydata.currencysymbol;
            let pageno = bodydata.currentpage;

            let datatype = bodydata.type;
            let sendemails = bodydata.emails;
            let exportformet = bodydata.exportformet;

            var activeobj = [];
            function findKeyByLabel(labelToSearch) {
                for (const section of columndata) {
                    for (const item of section.values) {
                        if (item.label === labelToSearch) {
                            return item;
                        }
                    }
                }
                return null; // Label not found
            }

            const variantssQuery = query.variantsQuery;
            const productQuery = query.productQuery;

            const projectobj = {
                _id: 0,
            }

            const group_obj = {
                _id: {}
            }

            const merge_obj = {};
            const value_index = []


            const updatedvariantsquery = {}
            const updatedproductquery = {}


            let l_sorting_obj = {
                "_id": -1,
            };


            for (const key in productQuery) {

                updatedproductquery["product." + key] = productQuery[key];

            }


            activecolumns.forEach((key) => {
                const activeitem = findKeyByLabel(key);

                for (const key in variantssQuery) {
                    if (key == activeitem.key) {
                        if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
                            updatedvariantsquery[key] = variantssQuery[key];
                        }
                    }
                }

                if (sorting.index == activeitem.key) {

                    if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
                        l_sorting_obj = {
                            ["_id." + activeitem.key]: sorting.direction == "ascending" ? 1 : -1,
                            _id: 1
                        };
                    }
                    if (activeitem.type == "number") {
                        l_sorting_obj = {
                            [activeitem.key]: sorting.direction == "ascending" ? 1 : -1,
                            _id: 1
                        };
                    }
                }

                value_index.push(activeitem.key);

                if (activeitem.calltype == "variant") {
                    // projectobj[activeitem.key] = "$"+activeitem.key;
                    // p_projectobj[activeitem.key] = "$parent."+activeitem.key;

                    if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
                        group_obj["_id"][activeitem.key] = { $toString: "$" + activeitem.key };
                        merge_obj[activeitem.key] = "$_id." + activeitem.key;
                    }
                    if (activeitem.type == "number") {
                        group_obj[activeitem.key] = { $sum: { $toDouble: "$" + activeitem.key } };
                        merge_obj[activeitem.key] = "$" + activeitem.key;
                    }
                    // activeobj.push(findKeyByLabel(key));
                }

                if (activeitem.calltype == "product") {
                    // projectobj[activeitem.key] = "$parent."+activeitem.key;
                    // p_projectobj[activeitem.key] = "$"+activeitem.key;

                    if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
                        group_obj["_id"][activeitem.key] = { $toString: "$product." + activeitem.key };
                        merge_obj[activeitem.key] = "$_id." + activeitem.key;
                    }
                    if (activeitem.type == "number") {
                        group_obj[activeitem.key] = { $sum: { $toDouble: "$product." + activeitem.key } };
                        merge_obj[activeitem.key] = "$" + activeitem.key;
                    }

                }

            });

            function isObjectEmpty(obj) {
                return Object.keys(obj).length === 0;
            }

            let aggregatesArray = [];

            aggregatesArray = [
                {
                    $match: updatedvariantsquery
                },
                {
                    $match: updatedproductquery
                },
                {
                    $group: group_obj
                },
                {
                    $sort: l_sorting_obj
                },
                {
                    $group: {
                        _id: null,
                        rows: {
                            $push: {
                                $map: {
                                    input: {
                                        $objectToArray: {
                                            $mergeObjects: [
                                                merge_obj
                                            ]
                                        }
                                    },
                                    as: 'item',
                                    in: '$$item.v'
                                }
                            }
                        }
                    }
                }
            ];
            console.log(aggregatesArray);

            try {
                let Arp = [];
                let allrows = [];
                // if(isObjectEmpty(variantssQuery)) {
                Arp = await get_var.aggregate(aggregatesArray).toArray();
                allrows = Arp.length ? Arp[0].rows : [];
                // }
                // else{
                //   Arp = await get_var.aggregate(aggregatesArray).toArray();
                //   allrows = Arp.length ? Arp[0].rows : [];
                // }

                function formatMoney(value, currency, symbol) {
                    const formattedValue = new Intl.NumberFormat(undefined, {
                        style: 'currency',
                        currency: currency,
                    }).format(value);

                    return `${formattedValue}`;
                }

                activecolumns.forEach((key, i) => {

                    const activeitem = findKeyByLabel(key);
                    if (activeitem.format == "money") {
                        const moneyValue = allrows.forEach((key, j) => {


                            const moneyValueAsNumber = parseFloat(key[i]);


                            const formattedMoney = formatMoney(moneyValueAsNumber, currency, currencysymbol);

                            allrows[j][i] = formattedMoney;

                        });

                    }
                });

                if (exportformet == "csv") {
                    emailcsv(activecolumns, allrows, "Title", sendemails)
                } else if (exportformet == "excel") {
                    emailexcel(activecolumns, allrows, "Title", sendemails)
                } else if (exportformet == "pdf") {
                    sendpdf(activecolumns, allrows, "Title", sendemails)
                }
            } catch (error) {
                console.error(error);
            }
        } else if (selecttemplate[0].Category == "Customer") {
            let get_coll = database.collection("Customers");
            bodydata["columns"] = await globeldb.collection("customercolumns").find().toArray();
            let lastactquery = (selecttemplate[0].lastactivefilterquery != "") ? JSON.parse(selecttemplate[0].lastactivefilterquery) : {}
            let query1 =
            {
                ...lastactquery,
                createdAt: {
                    $gte: selectdatetime.start, $lte: selectdatetime.end
                }
            };
            bodydata = { ...bodydata, datatype: query1 };
            let query = JSON.parse(bodydata.datatype);
            const page = parseInt(bodydata.page) || 0;

            let columndata = bodydata.columns;
            let activecolumns = bodydata.activeColumns;
            let sorting = bodydata.sorting;
            let currency = bodydata.currency;
            let countryCode = bodydata.countrycode;
            let currencysymbol = bodydata.currencysymbol;
            let pageno = bodydata.currentpage;
            let datatype = bodydata.type;
            let sendemails = bodydata.emails;
            let exportformet = bodydata.exportformet;

            function findKeyByLabel(labelToSearch) {
                for (const section of columndata) {
                    for (const item of section.values) {
                        if (item.label === labelToSearch) {
                            return item;
                        }
                    }
                }
                return null; // Label not found
            }


            const group_obj = {
                _id: {}
            }

            const merge_obj = {};

            const value_index = []

            let l_sorting_obj = {
                "_id": -1,
            };





            activecolumns.forEach((key, i) => {
                const activeitem = findKeyByLabel(key);

                if (sorting.index == activeitem.key) {
                    l_sorting_obj = {
                        [activeitem.key]: sorting.direction == "ascending" ? 1 : -1,
                        _id: 1
                    };
                }

                value_index.push(activeitem.key);

                if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
                    group_obj["_id"][activeitem.key] = { $toString: "$" + activeitem.key };
                    merge_obj[activeitem.key] = "$_id." + activeitem.key;
                }
                if (activeitem.type == "number") {
                    group_obj[activeitem.key] = { $sum: { $toDouble: "$" + activeitem.key } };
                    merge_obj[activeitem.key] = "$" + activeitem.key;
                }

            });

            const updatedquery = {};

            for (const key in query) {

                updatedquery[key] = query[key];

            }

            let aggregatesArray = [];

            aggregatesArray = [
                {
                    $match: updatedquery
                },
                {
                    $group: group_obj
                },
                {
                    $sort: l_sorting_obj
                },
                {
                    $group: {
                        _id: null,
                        rows: {
                            $push: {
                                $map: {
                                    input: {
                                        $objectToArray: {
                                            $mergeObjects: [
                                                merge_obj
                                            ]
                                        }
                                    },
                                    as: 'item',
                                    in: '$$item.v'
                                }
                            }
                        }
                    }
                }
            ];

            const Arp = await get_coll.aggregate(aggregatesArray).toArray();


            let allrows = Arp.length ? Arp[0].rows : [];


            function formatMoney(value, currency, symbol) {
                const formattedValue = new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: currency,
                }).format(value);

                return `${formattedValue}`;
            }

            activecolumns.forEach((key, i) => {

                const activeitem = findKeyByLabel(key);

                if (activeitem.format == "money") {
                    const moneyValue = allrows.forEach((key, j) => {



                        const moneyValueAsNumber = parseFloat(key[i]);


                        const formattedMoney = formatMoney(moneyValueAsNumber, currency, currencysymbol);

                        // console.log(key[i]);
                        // console.log(formattedMoney);
                        allrows[j][i] = formattedMoney;

                    });

                }


            });

            if (exportformet == "csv") {
                emailcsv(activecolumns, allrows, "Title", sendemails)
            } else if (exportformet == "excel") {
                emailexcel(activecolumns, allrows, "Title", sendemails)
            } else if (exportformet == "pdf") {
                sendpdf(activecolumns, allrows, "Title", sendemails)
            }
        }

        let coll = database.collection("schedulehistory");
        let timestr = getCurrentTimeFormatted();
        let data = {
            interval: shdata.interval,
            reportname: selecttemplate[0].title,
            time: timestr,
            sh_id: shdata.sh_id,
            emails: shdata.emails,
            title: shdata.title,
        }
        coll.insertOne(data)
    } catch (error) {
        console.error('Error:', error);
    }
}