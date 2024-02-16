

export default async function ProductMerge(columndata,activecolumns,currency,countryCode,currencysymbol,collection) {

    
    
    let headings = activecolumns;
    const sortedRows = null;

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
      const initiallySortedRows = replaceNullWithNA(collection);
    
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
        return  new Intl.NumberFormat(`en-${countryCode}`, { style: 'currency', currency: `${currency}` }).format(number);
      }
    
      const rows = sortedRows
        ? sortedRows
        : initiallySortedRows.map((row) => {
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
                          if(Number.isNaN(numberValue)){
                            numberValue = 0.00;
                          }
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
                        if(headingitem.format == "money") {
                          var numberValue = Number(order[0][headingitem.key]);
                          if(Number.isNaN(numberValue)){
                            numberValue = 0.00;
                          }
                          const moneyFormatted = numberValue.toLocaleString('en-IN', { style: 'currency', currency: `${currency}` });
                          returnfilteredObj[headingitem.key] = moneyFormatted;
                        }
                        else{
    
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
                  // console.log(itemm);
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
    
      function sortData(rows, index, direction) {
        return [...rows].sort((rowA, rowB) => {
          const valueA = rowA[index];
          const valueB = rowB[index];
    
          if (typeof valueA === "number" && typeof valueB === "number") {
            return direction === "descending" ? valueB - valueA : valueA - valueB;
          } else if (typeof valueA === "string" && typeof valueB === "string") {
            const comparison = valueA.localeCompare(valueB);
            return direction === "descending" ? -comparison : comparison;
          } else {
            return 0;
          }
        });
      }

      return freshdata;

    }
    
    