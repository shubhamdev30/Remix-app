import * as XLSX from 'xlsx';
import fs from 'fs';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export async function convertformet(dbname, shdata, globeldb, countrcd, curncy,formet) {


    function updateDates(selectionOption) {
        // Get the current date
        const currentDate = new Date();
    
        // Initialize the start and last date variables
        let startDate = "";
        let lastDate = "";
    
        // Switch based on the selection option
        switch (selectionOption) {
            case "Today":
                startDate = new Date(new Date());
                lastDate = new Date(new Date());
                break;
                case "alltime":
                    startDate = startDate = new Date(2006, 0, 1); 
                    lastDate = new Date(new Date());
                    break;
            case "yesterday":
                startDate = new Date(currentDate);
                lastDate = new Date(currentDate);
                break;
            case "last7days":
                startDate = new Date(currentDate);
                startDate.setDate(currentDate.getDate() - 6); // Set to 7 days ago
                lastDate = new Date(currentDate);
                break;
            case "last30days":
                startDate = new Date(currentDate);
                startDate.setDate(currentDate.getDate() - 29); // Set to 30 days ago
                lastDate = new Date(currentDate);
                break;
            case "last90days":
                startDate = new Date(currentDate);
                startDate.setDate(currentDate.getDate() - 89); // Set to 90 days ago
                lastDate = new Date(currentDate);
                break;
            case "last365days":
                startDate = new Date(currentDate);
                startDate.setDate(currentDate.getDate() - 364); // Set to 90 days ago
                lastDate = new Date(currentDate);
                break;
            case "lastMonth":
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
                break;
            case "lastQuarter":
                const quarterStartMonth = Math.floor(currentDate.getMonth() / 3) * 3;
                startDate = new Date(currentDate.getFullYear(), quarterStartMonth - 3, 1);
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
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                lastDate = new Date(currentDate);
                break;
            case "quarterToDate":
                const quarterStartMonthQTD = Math.floor(currentDate.getMonth() / 3) * 3;
                startDate = new Date(currentDate.getFullYear(), quarterStartMonthQTD, 1);
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
    
        function formatDate(date) {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        }
    
        // Update the object
        const dateObj = {
            start: formatDate(startDate),
            end: formatDate(lastDate),
        };
        return dateObj;
    }
    
    



    function ordersupdateddata(columndata, headings, data, currency, countryCode, currencysymbol) {
        function replaceNullWithNA(array) {
            const newArray = array.map((obj) => {
                const newObj = {};
                for (let key in obj) {
                    newObj[key] = obj[key] === null ? "N/A" : obj[key];
                }
                return newObj;
            });
            return newArray;
        }
        const initiallySortedRows = replaceNullWithNA(data);

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

        function moneyToNumber(moneyString) {
            return Number(moneyString.replace(/[^\d.]/g, ''));
        }

        function numberToMoney(number) {
            return new Intl.NumberFormat(`en-${countryCode}`, { style: 'currency', currency: `${currency}` }).format(number);
        }

        const rows = initiallySortedRows.map((row) => {
            const filteredObj = {};
            const returnfilteredObj = {};

            for (const [key, value] of Object.entries(row)) {
                filteredObj[key] = value;
            }

            headings.forEach((key) => {
                let headingitem = findKeyByLabel(key);

                if (filteredObj["__parentId"]) {
                    const order = initiallySortedRows.filter(
                        (item) => item["id"] == filteredObj["__parentId"]
                    );
                    if (headingitem !== null) {
                        if (filteredObj.hasOwnProperty(headingitem.key)) {
                            if (
                                filteredObj[headingitem.key] === true ||
                                filteredObj[headingitem.key] === false
                            ) {
                                if (filteredObj[headingitem.key]) {
                                    returnfilteredObj[headingitem.key] = "true";
                                } else {
                                    returnfilteredObj[headingitem.key] = "false";
                                }
                            } else {
                                if (headingitem.type == "number") {
                                    if (headingitem.format == "money") {
                                        var valueString = filteredObj[headingitem.key].toString();
                                        var numberValue = parseFloat(valueString.match(/(\d+(\.\d+)?)/));
                                        const moneyFormatted = numberValue.toLocaleString(
                                            `en-${countryCode}`,
                                            { style: "currency", currency: `${currency}` }
                                        );
                                        returnfilteredObj[headingitem.key] = moneyFormatted;
                                    } else {
                                        returnfilteredObj[headingitem.key] = Number(
                                            filteredObj[headingitem.key]
                                        );
                                    }
                                } else {
                                    returnfilteredObj[headingitem.key] =
                                        filteredObj[headingitem.key];
                                }
                            }
                        }

                        if (order[0].hasOwnProperty(headingitem.key)) {
                            if (
                                order[0][headingitem.key] === true ||
                                order[0][headingitem.key] === false
                            ) {
                                if (order[0][headingitem.key]) {
                                    returnfilteredObj[headingitem.key] = "true";
                                } else {
                                    returnfilteredObj[headingitem.key] = "false";
                                }
                            } else {
                                if (headingitem.type == "number") {
                                    returnfilteredObj[headingitem.key] = Number(
                                        order[0][headingitem.key]
                                    );
                                    if (headingitem.format == "money") {
                                        const numberValue = Number(order[0][headingitem.key]);
                                        const moneyFormatted = numberValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
                                        returnfilteredObj[headingitem.key] = moneyFormatted;
                                    }
                                    else {

                                    }
                                } else {
                                    returnfilteredObj[headingitem.key] =
                                        order[0][headingitem.key];
                                }
                            }
                        }
                    }
                } else {
                }
            });

            return Object.values(returnfilteredObj);
        });


        function arrayDifference(arrays) {
            if (arrays.length < 2) {
                return [];
            }

            function difference(arr1, arr2) {
                return arr1.filter((item, i) => {
                    let headingitem = findKeyByLabel(headings[i]);

                    if (headingitem.type == "String" || headingitem.type == "string" || headingitem.type == "date") {
                        return !arr2.includes(item);
                    }
                });
            }

            const result = arrays.reduce((accumulator, currentArray) => {
                return difference(accumulator, currentArray);
            });

            return result;
        }

        function mergeMultipleArrays(arrays) {
            if (arrays.length < 2) {
                throw new Error("You need at least two arrays to merge.");
            }

            const length = arrays[0].length;
            for (const arr of arrays) {
                if (arr.length !== length) {
                    throw new Error("All arrays must have the same length.");
                }
            }

            const mergedArray = [];

            for (let i = 0; i < length; i++) {
                const elementsAtPosition = arrays.map((arr) => arr[i]);

                let headingitem = findKeyByLabel(headings[i]);

                if (headingitem.type == "number") {
                    const sum = elementsAtPosition.reduce((acc, item) => acc + item, 0);

                    if (headingitem.format == "money") {
                        var valueString = sum.toString();
                        const moneyArray = valueString.split(`${currencysymbol}`);

                        const total = moneyArray.reduce((acc, moneyValue) => acc + moneyToNumber(moneyValue), 0);
                        const totalFormatted = numberToMoney(total);


                        mergedArray.push(totalFormatted);
                    } else {
                        mergedArray.push(sum);
                    }
                } else {
                    const uniqueStrings = Array.from(new Set(elementsAtPosition));
                    mergedArray.push(...uniqueStrings);
                }
            }

            return mergedArray;
        }

        const freshdata = [];

        rows.forEach((values, i) => {
            if (values.length) {
                const filteredArray = values.filter(function (item, index) {
                    let headingitem = findKeyByLabel(headings[index]);
                    if (
                        headingitem.type == "string" ||
                        headingitem.type == "String" ||
                        headingitem.type == "date"
                    ) {
                        return true;
                    }
                });
                const stringarray = filteredArray.toString();

                const samerows = [values];
                rows.forEach((valuearray, iii) => {
                    if (iii != i) {
                        const valuearrayss = valuearray.filter(function (item, ii) {
                            let headingitem = findKeyByLabel(headings[ii]);
                            if (
                                headingitem.type == "string" ||
                                headingitem.type == "String" ||
                                headingitem.type == "date"
                            ) {
                                return true;
                            }
                        });
                        const valuesstringarray = valuearrayss.toString();
                        if (stringarray == valuesstringarray) {
                            if (valuearray.length) {
                                samerows.push(valuearray);
                            }
                        }
                    }
                });

                if (samerows.length > 1) {
                    const difference = arrayDifference(samerows);
                    if (!difference.length) {
                        let datagone1 = false;
                        freshdata.forEach((item) => {
                            const checkdiff = arrayDifference([item, samerows[0]]);
                            if (!checkdiff.length) {
                                datagone1 = true;
                            }
                        });
                        if (!datagone1) {
                            const merged = mergeMultipleArrays(samerows);
                            freshdata.push(merged);
                        }
                    } else {
                        samerows.forEach((itemm) => {
                            let datagone2 = false;
                            freshdata.forEach((item) => {
                                const checkdiff = arrayDifference([item, itemm]);
                                if (!checkdiff.length) {
                                    datagone2 = true;
                                }
                            });
                            if (!datagone2) {
                                freshdata.push(itemm);
                            }
                        });
                    }
                } else {
                    let datagone = false;
                    freshdata.forEach((item) => {
                        const checkdiff = arrayDifference([item, values]);
                        if (!checkdiff.length) {
                            datagone = true;
                        }
                    });

                    if (!datagone) {

                        freshdata.push(values);
                    }
                }
            }
        });
        return freshdata;
    }
    function productsupdateddata(columndata, headings, data, currency, countryCode, currencysymbol) {
        function replaceNullWithNA(array) {
            const newArray = array.map((obj) => {
                const newObj = {};
                for (let key in obj) {
                    newObj[key] = obj[key] === null ? "N/A" : obj[key];
                }
                return newObj;
            });
            return newArray;
        }
        const initiallySortedRows = replaceNullWithNA(data);

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

        function moneyToNumber(moneyString) {
            return Number(moneyString.replace(/[^\d.]/g, ''));
        }

        function numberToMoney(number) {
            return new Intl.NumberFormat(`en-${countryCode}`, { style: 'currency', currency: `${currency}` }).format(number);
        }

        const rows = initiallySortedRows.map((row) => {
            const filteredObj = {};
            const returnfilteredObj = {};

            for (const [key, value] of Object.entries(row)) {
                filteredObj[key] = value;
            }

            headings.forEach((key) => {
                let headingitem = findKeyByLabel(key);

                if (filteredObj["product_id"]) {
                    const order = initiallySortedRows.filter(
                        (item) => item["id"] == filteredObj["product_id"]
                    );
                    if (headingitem !== null) {
                        if (filteredObj.hasOwnProperty(headingitem.key)) {
                            if (
                                filteredObj[headingitem.key] === true ||
                                filteredObj[headingitem.key] === false
                            ) {
                                if (filteredObj[headingitem.key]) {
                                    returnfilteredObj[headingitem.key] = "true";
                                } else {
                                    returnfilteredObj[headingitem.key] = "false";
                                }
                            } else {
                                if (headingitem.type == "number") {
                                    if (headingitem.format == "money") {
                                        var valueString = filteredObj[headingitem.key].toString();
                                        var numberValue = parseFloat(valueString.match(/(\d+(\.\d+)?)/));
                                        const moneyFormatted = numberValue.toLocaleString(
                                            `en-${countryCode}`,
                                            { style: "currency", currency: `${currency}` }
                                        );
                                        returnfilteredObj[headingitem.key] = moneyFormatted;
                                    } else {
                                        returnfilteredObj[headingitem.key] = Number(
                                            filteredObj[headingitem.key]
                                        );
                                    }
                                } else {
                                    returnfilteredObj[headingitem.key] =
                                        filteredObj[headingitem.key];
                                }
                            }
                        }

                        if (order[0].hasOwnProperty(headingitem.key)) {
                            if (
                                order[0][headingitem.key] === true ||
                                order[0][headingitem.key] === false
                            ) {
                                if (order[0][headingitem.key]) {
                                    returnfilteredObj[headingitem.key] = "true";
                                } else {
                                    returnfilteredObj[headingitem.key] = "false";
                                }
                            } else {
                                if (headingitem.type == "number") {
                                    returnfilteredObj[headingitem.key] = Number(
                                        order[0][headingitem.key]
                                    );
                                    if (headingitem.format == "money") {
                                        const numberValue = Number(order[0][headingitem.key]);
                                        const moneyFormatted = numberValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
                                        returnfilteredObj[headingitem.key] = moneyFormatted;
                                    }
                                    else {

                                    }
                                } else {
                                    returnfilteredObj[headingitem.key] =
                                        order[0][headingitem.key];
                                }
                            }
                        }
                    }
                } else {
                }
            });

            return Object.values(returnfilteredObj);
        });

        function arrayDifference(arrays) {
            if (arrays.length < 2) {
                return [];
            }

            function difference(arr1, arr2) {
                return arr1.filter((item, i) => {
                    let headingitem = findKeyByLabel(headings[i]);

                    if (headingitem.type == "String" || headingitem.type == "string" || headingitem.type == "date") {
                        return !arr2.includes(item);
                    }
                });
            }

            const result = arrays.reduce((accumulator, currentArray) => {
                return difference(accumulator, currentArray);
            });

            return result;
        }



        function mergeMultipleArrays(arrays) {
            if (arrays.length < 2) {
                throw new Error("You need at least two arrays to merge.");
            }

            const length = arrays[0].length;
            for (const arr of arrays) {
                if (arr.length !== length) {
                    throw new Error("All arrays must have the same length.");
                }
            }

            const mergedArray = [];

            for (let i = 0; i < length; i++) {
                const elementsAtPosition = arrays.map((arr) => arr[i]);

                let headingitem = findKeyByLabel(headings[i]);

                if (headingitem.type == "number") {
                    const sum = elementsAtPosition.reduce((acc, item) => acc + item, 0);

                    if (headingitem.format == "money") {
                        var valueString = sum.toString();
                        const moneyArray = valueString.split(`${currencysymbol}`);

                        const total = moneyArray.reduce((acc, moneyValue) => acc + moneyToNumber(moneyValue), 0);
                        const totalFormatted = numberToMoney(total);


                        mergedArray.push(totalFormatted);
                    } else {
                        mergedArray.push(sum);
                    }
                } else {
                    const uniqueStrings = Array.from(new Set(elementsAtPosition));
                    mergedArray.push(...uniqueStrings);
                }
            }

            return mergedArray;
        }

        const freshdata = [];

        rows.forEach((values, i) => {
            if (values.length) {
                const filteredArray = values.filter(function (item, index) {
                    let headingitem = findKeyByLabel(headings[index]);
                    if (
                        headingitem.type == "string" ||
                        headingitem.type == "String" ||
                        headingitem.type == "date"
                    ) {
                        return true;
                    }
                });
                const stringarray = filteredArray.toString();

                const samerows = [values];
                rows.forEach((valuearray, iii) => {
                    if (iii != i) {
                        const valuearrayss = valuearray.filter(function (item, ii) {
                            let headingitem = findKeyByLabel(headings[ii]);
                            if (
                                headingitem.type == "string" ||
                                headingitem.type == "String" ||
                                headingitem.type == "date"
                            ) {
                                return true;
                            }
                        });
                        const valuesstringarray = valuearrayss.toString();
                        if (stringarray == valuesstringarray) {
                            if (valuearray.length) {
                                samerows.push(valuearray);
                            }
                        }
                    }
                });

                if (samerows.length > 1) {
                    const difference = arrayDifference(samerows);
                    if (!difference.length) {
                        let datagone1 = false;
                        freshdata.forEach((item) => {
                            const checkdiff = arrayDifference([item, samerows[0]]);
                            if (!checkdiff.length) {
                                datagone1 = true;
                            }
                        });
                        if (!datagone1) {
                            const merged = mergeMultipleArrays(samerows);
                            freshdata.push(merged);
                        }
                    } else {
                        samerows.forEach((itemm) => {
                            let datagone2 = false;
                            freshdata.forEach((item) => {
                                const checkdiff = arrayDifference([item, itemm]);
                                if (!checkdiff.length) {
                                    datagone2 = true;
                                }
                            });
                            if (!datagone2) {
                                freshdata.push(itemm);
                            }
                        });
                    }
                } else {
                    let datagone = false;
                    freshdata.forEach((item) => {
                        const checkdiff = arrayDifference([item, values]);
                        if (!checkdiff.length) {
                            datagone = true;
                        }
                    });

                    if (!datagone) {

                        freshdata.push(values);
                    }
                }
            }
        }
        )
        return freshdata;
    }




    function convertJSONToExcel(jsonData,tmpdata) {

        // Create a new worksheet
        const ws = XLSX.utils.json_to_sheet(jsonData);

        // Create a new workbook and add the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

        // Generate a temporary file path
        const excelFilePath = `${tmpdata.title}.xlsx`;

        // Write the workbook to the temporary file
        XLSX.writeFile(wb, excelFilePath);
        setTimeout(() => {
            // Delete the temporary file using fs.unlinkSync
            try {
                fs.unlinkSync(excelFilePath);
                console.log(`Deleted: ${excelFilePath}`);
            } catch (err) {
                console.error(`Error deleting file: ${excelFilePath}`, err);
            }
        }, 1000);
        return excelFilePath;
    }

    function convertJSONToCSV(jsonData,tmpdata) {
        // Convert JSON data to a CSV string using papaparse
        const csvData = Papa.unparse(jsonData);

        // Generate a temporary file path for CSV
        const csvFilePath = `${tmpdata.title}.csv`;

        // Write the CSV data to the temporary file
        fs.writeFileSync(csvFilePath, csvData);
        setTimeout(() => {
            // Delete the temporary file using fs.unlinkSync
            try {
                fs.unlinkSync(csvFilePath);
                console.log(`Deleted: ${csvFilePath}`);
            } catch (err) {
                console.error(`Error deleting file: ${csvFilePath}`, err);
            }
        }, 1000);
        return csvFilePath;
    }
    function convertJSONToPDF(jsonData,tmpdata) {
        const pdf = new jsPDF({ orientation: 'p', unit: 'pt' });

        const pageWidth = pdf.internal.pageSize.width; // Get the current page width
        const tableWidth = 0.9 * pageWidth; // Set the table width to 90% of the current page width
        const pageHeight = pdf.internal.pageSize.height; // Get the current page height


        let y = 30;
        let currentPage = 1;

        // Define table columns
        const columns = ['Key', 'Value'];

        // Define an array to hold the table data
        const data = [];

        // Iterate through the JSON data and add key-value pairs to the table data
        jsonData.forEach((item, index) => {
            data.push([{
                content: index + 1,
                styles: {
                    lineWidth: 0.5,
                    lineColor: [0, 0, 0],
                    fillColor: [200, 200, 200], // Background color (light gray)
                    fontStyle: 'bold', // Make the font bold
                }
            }, '']);
            for (const key in item) {
                data.push([key, item[key]]);
            }
            // Check if the content exceeds the current page, and if so, add a new page
            if (y + 20 > pageHeight) {
                pdf.addPage();
                currentPage++;
                y = 30; // Reset the y-coordinate
            }
        });

        // Set options for the table
        const options = {
            startY: y,
            margin: { top: 20 },
            columnStyles: {
                0: { lineWidth: 0.5, lineColor: [0, 0, 0] }, // Specify cell border for column 0
                1: { lineWidth: 0.5, lineColor: [0, 0, 0] }, // Specify cell border for column 1
            },
            tableWidth
        };

        // Add the table to the PDF
        pdf.autoTable(columns, data, options);

        // Set the title at the top of the page
        pdf.setFontSize(18);
        pdf.text("title", 105, 15, null, null, 'center');

        // Generate a temporary file path for the PDF
        const pdfFilePath = `${tmpdata.title}.pdf`;

        // Save the PDF to a file
        pdf.save(pdfFilePath);
        setTimeout(() => {
            // Delete the temporary file using fs.unlinkSync
            try {
                fs.unlinkSync(pdfFilePath);
                console.log(`Deleted: ${pdfFilePath}`);
            } catch (err) {
                console.error(`Error deleting file: ${pdfFilePath}`, err);
            }
        }, 1000);
        console.log(`PDF generated with ${currentPage} pages.`);
        return pdfFilePath;
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
    let items;
    let filepath;
    let selectdatetime;
    
    try {
        if(shdata.datafrom == "Custom"){
            selectdatetime = shdata.lastactivedate
        }else{
        selectdatetime = updateDates(shdata.datafrom)
        }
         if (shdata.Category == "Customer") {
            let get_coll = dbname.collection("Customers");
            let get_coldata = await globeldb.collection("customercolumns").find().toArray();
            let lastactquery = (shdata.lastactivefilterquery !== "") ? JSON.parse(shdata.lastactivefilterquery) : {}
            let query =
            {
                ...lastactquery,
                createdAt: {
                    $gte: selectdatetime.start, $lte: selectdatetime.end
                }
            };

            let keysArray = [];
            let labelsArray = [];

            for (const obj of get_coldata) {
                for (const valueObj of obj.values) {
                    const label = valueObj.label;

                    if (shdata.default_columns.includes(label)) {
                        keysArray.push(valueObj.key);
                        labelsArray.push(valueObj.label);
                    }
                }
            }
            console.log(keysArray)
            console.log(labelsArray)
            console.log(query)
            
            items = await get_coll.find(query).toArray();
            console.log(items)
            items = await items.map(item => {
                const filteredItem = {};
                keysArray.forEach((key,index)=> {
                    if (item.hasOwnProperty(key)) {
                        filteredItem[labelsArray[index]] = item[key];
                    }
                });
                return filteredItem;
            });

        } else if (shdata.Category == "Orders") {
            let get_coll = dbname.collection("Orders");

            let get_coldata = await globeldb.collection("Columns").find().toArray();
            let lastactquery = (shdata.lastactivefilterquery !== "") ? JSON.parse(shdata.lastactivefilterquery) : { "orderQuery": {}, "lineitemsQuery": {} }
            lastactquery.orderQuery.createdAt = { $gte: selectdatetime.start, $lte: selectdatetime.end }
            const collection = await get_coll.find({ $and: [{ __parentId: { $exists: false } }, lastactquery.orderQuery] }).toArray();
            var orderids = [];
            for (let i = 0; i < collection.length; i++) {
                if (collection[i]) {
                    orderids[i] = collection[i].id;
                }
            }
            const keysArray = [];

            for (const obj of get_coldata) {
                for (const valueObj of obj.values) {
                    const label = valueObj.label;

                    if (shdata.default_columns.includes(label)) {
                        keysArray.push(valueObj.key);
                    }
                }
            }
            let lineitems = await get_coll.find({ $and: [{ __parentId: { $in: orderids } }, lastactquery.lineitemsQuery] }).toArray();
            let crsymbol = getCurrencySymbol(curncy);

            items = collection.concat(lineitems);
            let originalData = ordersupdateddata(get_coldata, shdata.default_columns, items, curncy, countrcd, crsymbol);
            items = originalData.map((data) => {
                const obj = {};
                for (let i = 0; i < shdata.default_columns.length; i++) {
                    obj[shdata.default_columns[i]] = data[i];
                }
                return obj;
            });
        } else if (shdata.Category == "Products") {
            let get_coll = dbname.collection("Products");
            let get_coldata = await globeldb.collection("productcolumns").find().toArray();
            let get_var = dbname.collection("Variants");
            let lastactquery = (shdata.lastactivefilterquery !== "") ? JSON.parse(shdata.lastactivefilterquery) : { "productQuery": {}, variantsQuery: {} }
            lastactquery.productQuery.createdAt = { $gte: selectdatetime.start, $lte: selectdatetime.end }
            const collection = await get_coll.find(lastactquery.productQuery).toArray();




            var productids = [];

            for (let i = 0; i < collection.length; i++) {
                if (collection[i]) {
                    productids[i] = collection[i].id;
                }
            }


            let crsymbol = getCurrencySymbol(curncy);
            let variants = await get_var.find({ $and: [{ product_id: { $in: productids } }, lastactquery.variantsQuery] }).toArray();

            items = collection.concat(variants);

            let originalData = productsupdateddata(get_coldata, shdata.default_columns, items, curncy, countrcd, crsymbol);
            items = originalData.map((data) => {
                const obj = {};
                for (let i = 0; i < shdata.default_columns.length; i++) {
                    obj[shdata.default_columns[i]] = data[i];
                }
                return obj;
            });
        }

          
          // Call the function to initiate the download
          
          if (formet == "excel") {
              filepath = convertJSONToExcel(items,shdata);
            } else if (formet == "csv") {
                filepath = convertJSONToCSV(items,shdata);
            } else if (formet == "pdf") {
                filepath = convertJSONToPDF(items,shdata);
            }
            return(filepath)
            
        } catch (error) {
        console.error('Error:', error);
    }
}