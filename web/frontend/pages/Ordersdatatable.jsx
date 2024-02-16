import { Box, Card, DataTable, EmptyState, Text,BlockStack } from "@shopify/polaris";
import { useEffect, useState } from "react";
function Ordersdatable(props) {
  const { columndata, activecolumns, data,currency, countryCode, currencysymbol, handleSort } = props;

  const [sortedRows, setSortedRows] = useState(null);
  const [headings, setheadings] = useState(activecolumns);
  const itemsPerPage = 100;
  const [visibleRows, setVisibleRows] = useState(itemsPerPage);


  useEffect(() => {
    calculateColumnTotals(data);
    setSortedRows(null);
    setheadings(activecolumns);
    setVisibleRows(itemsPerPage);
  }, [activecolumns]);


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
                } 
                else {
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

  const [sortInfo, setSortInfo] = useState({ column: null, direction: null });


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
  const paginatedData = data.slice(0, visibleRows);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleRows((prevVisibleRows) => prevVisibleRows + itemsPerPage);
      setLoading(false);
    }, 1000);

  };


  const calculateColumnTotals = (data) => {
    let f_totals;
    if(data.length == 0){
       f_totals = [];
    }else{
       f_totals = Array(data[0].length).fill(0);
    }
    
  
    const totals = [];
    const format = [];
  
    activecolumns.forEach((key) => {
      const activeitem = findKeyByLabel(key);
      totals.push(activeitem.type);
      format.push(activeitem.format);
    });
  
    data.forEach((row) => {
      row.forEach((value, index) => {
        // Check if the column type is 'number' and the first index is a string
        if (totals[index] === 'number' && index !== 0) {
          // Convert the value to a numeric value
          const numericValue = typeof value === 'number' ? value : parseFloat(value.replace("₹", ""));
          
          // Check if the numericValue is a number (not NaN)
          if (!isNaN(numericValue)) {
            // Convert to integer (remove decimal part)
            const intValue = parseFloat(numericValue);
            f_totals[index] += intValue;
          } else {
            console.log(`Invalid numeric value: ${value}`);
          }
        }
        else if (totals[index] === 'string' || totals[index] === 'String' || totals[index] === 'date') {

            f_totals[index] = "";
       
        }
      });
    });
  
    const formattedTotals = f_totals.map((value, index) => {
      if (format[index] === 'money') {
        // Format the numeric total as currency
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
      } else {
        return value;
      }
    });
   console.log(f_totals);
    return formattedTotals;
  };
  
   const summaryRowArray = calculateColumnTotals(data);

  // const dataWithSummary = [summaryRowArray, ...data];


  return (
    <Card className="position-relative" padding="0">
      <div className={props.loading == true ? "table_load" : ""}>
      {
        (props.loading == false && props.tagcount > 0) && (
          <Box padding="200" borderColor="border" borderBlockEndWidth="025">
            <BlockStack spacing="tight">{props.tagmarkup}</BlockStack>
          </Box>
        )
      }
      {
        (props.loading == true && props.opacityload != false) && (
          <div className="spinner-container">
            
          </div>
        )
      }
         <div className={paginatedData.length <=0 ? "disable_column" : null}>
          <DataTable
            columnContentTypes={Array(headings.length).fill("text")}
            headings={
              headings.map(item => {
                // console.log(item)
                return item;
              })
            }
            totals={summaryRowArray}
            totalsName={{
              singular: 'Summary',
              plural: 'Summary',
            }}
            rows={data.map((row) => Object.values(row))}
            sortable={Array(headings.length).fill(true)}
            defaultSortDirection="ascending"
            onSort={(index, direction) => handleSort(index, direction)}
            fixedFirstColumns={1}
            stickyHeader
            increasedTableDensity
            className="custom-data-table"
            hoverable
          />
          </div>
        {/* {loading && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Spinner size="small" />
        </div>
      )} */}




      {/* {paginatedData.length == visibleRows && (
        <div class="txt-link"  style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
          <Text>showing result of {visibleRows} of {data.length}</Text>
        <NavLink style={{ paddingLeft: "10px", textDecoration: 'none' }} 
         onClick={(e) => {
          e.preventDefault();
          handleLoadMore();
        }}
        disabled={loading}> {(data.length - visibleRows < 100) ? "Load Next " + (data.length - visibleRows)  :  "Load Next 100"}  </NavLink>
        </div>
      )} */}

       {
        (data.length == 0) && (
          <Box paddingBlockStart="600">
          <EmptyState
          fullWidth
        >
          <BlockStack gap="200">
            <Text variant="headingLg" as="p">
              No data found for the date range selected
            </Text>
            <Text variant="bodyMd" as="p" tone="subdued">
              Please select a different period.
      </Text>
      </BlockStack>
        </EmptyState>
        </Box>
        )}
        </div>
    </Card>
  );
}

export default Ordersdatable;
