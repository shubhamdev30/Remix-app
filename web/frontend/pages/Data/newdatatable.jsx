import { BlockStack, Box, Card, DataTable, EmptyState, InlineStack,Spinner, Tag, Text } from "@shopify/polaris";
import { useEffect, useState } from "react";


function FullDataTableExample(props) {
  const { columndata, activecolumns, data, empty, currency, countryCode, currencysymbol, handleSort } = props;
  const [sortedRows, setSortedRows] = useState(null);
  const [headings, setheadings] = useState(activecolumns);
  const itemsPerPage = 100;
  const [visibleRows, setVisibleRows] = useState(itemsPerPage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  setSortedRows(null);
    setheadings(activecolumns);
    setVisibleRows(itemsPerPage);
  }, [activecolumns]);

  // function simplifyObject(obj) {
  //   const simplifiedObj = {};

  //   for (const key in obj) {
  //     if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
  //       const nestedSimplified = simplifyObject(obj[key]);
  //       Object.assign(simplifiedObj, nestedSimplified);
  //     } else if (!Array.isArray(obj[key])) {
  //       simplifiedObj[key] = obj[key];
  //     }
  //   }

  //   return simplifiedObj;
  // }


  function replaceNullWithNA(array) {

    const newArray = array.map(obj => {
      const newObj = {};
      for (let key in obj) {
        if (key == "line_taxLines_0_ratePercentage" ||
          key == "line_taxLines_1_ratePercentage" ||
          key == "line_taxLines_2_ratePercentage" ||
          key == "line_taxLines_3_ratePercentage" ||
          key == "line_taxLines_4_ratePercentage"
        ) {
          newObj[key] = obj[key] === null ? "N/A" : obj[key].toString();
        } else {
          newObj[key] = obj[key] === null ? "N/A" : obj[key];
        }

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


  const rows = sortedRows ? sortedRows : initiallySortedRows.map((row) => {
    const filteredObj = {};
    const returnfilteredObj = {};

    for (const [key, value] of Object.entries(row)) {

      filteredObj[key] = value;
    }


    headings.forEach(key => {
      let headingitem = findKeyByLabel(key);


      const order = props.datatype == "Orders" ? initiallySortedRows.filter(item =>
        item["id"] == filteredObj["__parentId"]
      ) : initiallySortedRows;
      if (headingitem !== null) {
        if (filteredObj.hasOwnProperty(headingitem.key)) {
          if (filteredObj[headingitem.key] === true || filteredObj[headingitem.key] === false) {
            if (filteredObj[headingitem.key]) {
              returnfilteredObj[headingitem.key] = "true";
            }
            else {
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
              }
              else {
                returnfilteredObj[headingitem.key] = Number(
                  filteredObj[headingitem.key]
                );
              }
            } else {
              returnfilteredObj[headingitem.key] = filteredObj[headingitem.key];
            }

          }
        }

        if (props.datatype == "Orders") {
          if (order[0].hasOwnProperty(headingitem.key)) {
            if (order[0][headingitem.key] === true || order[0][headingitem.key] === false) {
              if (order[0][headingitem.key]) {
                returnfilteredObj[headingitem.key] = "true";
              }
              else {
                returnfilteredObj[headingitem.key] = "false";
              }
            }
            else {
              if (headingitem.type == "number") {
                returnfilteredObj[headingitem.key] = Number(order[0][headingitem.key]);
                if(headingitem.format == "money") {
                  var numberValue = Number(order[0][headingitem.key]);
                  if(Number.isNaN(numberValue)){
                  numberValue = 0.00;
                }
                  const moneyFormatted = numberValue.toLocaleString(undefined, { style: 'currency', currency: `${currency}` });
                  returnfilteredObj[headingitem.key] = moneyFormatted;
                }
                else{

                }
              } else {
                returnfilteredObj[headingitem.key] = order[0][headingitem.key];
              }
            }
          }
        }
      }



    });
    return Object.values(returnfilteredObj);
  });


  // function arrayDifference(arrays) {
  //   if (arrays.length < 2) {
  //     return [];
  //   }

  //   function difference(arr1, arr2) {
  //     return arr1.filter((item) => {if (typeof item === "string"){return !arr2.includes(item)}});
  //   }

  //   const result = arrays.reduce((accumulator, currentArray) => {
  //     return difference(accumulator, currentArray);
  //   });

  //   return result;
  // }

  // function mergeMultipleArrays(arrays) {
  //   if (arrays.length < 2) {
  //     throw new Error("You need at least two arrays to merge.");
  //   }

  //   const length = arrays[0].length;
  //   for (const arr of arrays) {
  //     if (arr.length !== length) {
  //       throw new Error("All arrays must have the same length.");
  //     }
  //   }

  //   const mergedArray = [];

  //   for (let i = 0; i < length; i++) {
  //     const elementsAtPosition = arrays.map(arr => arr[i]);

  //     const isNumeric = elementsAtPosition.every(item => typeof item === 'number');
  //     if (isNumeric) {
  //       const sum = elementsAtPosition.reduce((acc, item) => acc + item, 0);

  //       mergedArray.push(sum);
  //     } else {
  //       mergedArray.push(...new Set(elementsAtPosition));
  //     }
  //   }

  //   return mergedArray;
  // }


  // const freshdata = [];
  // rows.map((values,i) => {
  //   console.log("rows " + rows);
  //  if(values.length){
  //   values.map((value,ii) => {

  //     console.log("values " + values);
  //     console.log("value " + value);

  //     let headingitem = findKeyByLabel(headings[ii]);
  //     console.log("heading " + headingitem);
  //     if(headingitem.type == "string" || headingitem.type == "String"  || headingitem.type == "date"){
  //     const samerows = [values];
  //     console.log("samerows " + samerows);
  //     rows.map((valuearray,iii) => {

  //       if(valuearray.includes(value)){
  //         if(iii != i){
  //           samerows.push(valuearray);
  //           console.log("samerows " + samerows);
  //         }
  //       }

  //     });

  //      if(samerows.length > 1){
  //        const difference = arrayDifference(samerows);
  //        if(!difference.length){

  //         var datagone1 = false;
  //         freshdata.map((item) => {
  //         const checkdiff =  arrayDifference([item,samerows[0]]);
  //         if(!checkdiff.length){
  //         datagone1 = true;
  //         }
  //         });
  //         if(!datagone1){
  //          const merged = mergeMultipleArrays(samerows);

  //         freshdata.push(merged);
  //         }
  //        }else{
  //         samerows.map((itemm) => {
  //           var datagone2 = false;
  //           freshdata.map((item) => {
  //           const checkdiff =  arrayDifference([item,itemm]);
  //           if(!checkdiff.length){
  //           datagone2 = true;
  //           }
  //           });
  //           if(!datagone2){
  //           freshdata.push(itemm);
  //           }
  //         })
  //        }
  //      }

  //      else{
  //       var datagone = false;
  //       freshdata.map((item) => {
  //         const checkdiff =  arrayDifference([item,values]);
  //         if(!checkdiff.length){
  //            datagone = true;
  //         }
  //       });

  //       if(!datagone){
  //       freshdata.push(values);
  //       }

  //      }

  //    }

  //   });
  // }
  // });


  // function mergeRowsWithConditions(rows) {


  //   const mergedRows = [];



  //   for (const values of rows) {


  //     let isMerged = false;

  // if (!Array.isArray(values) || values.length === 0) {
  //     continue;
  //   }
  //     for (const mergedRow of mergedRows) {

  //       if (shouldMergeRows(values, mergedRow)) {

  //         const merged = mergeTwoRows(values, mergedRow);
  //         console.log(merged);
  //          mergedRows[mergedRows.indexOf(mergedRow)] = merged; 
  //          isMerged = true;
  //         break; 
  //       }
  //     }

  //     if (!isMerged) {
  //       mergedRows.push([...values]);
  //     }
  //   }

  //   return mergedRows;
  // }


  // function shouldMergeRows(row1, row2) {
  //   console.log(row1 + "----" + row2);
  //   for (let i = 0; i < row1.length; i++) {
  //     if (row1[i] !== row2[i]) {
  //       return false; 
  //     }
  //   }
  //   return true;
  // }


  // function mergeTwoRows(row1, row2) {
  //   const mergedRow = [...row1];

  //   for (let i = 0; i < row1.length; i++) {

  //     if (typeof row1[i] === 'number' && typeof row2[i] === 'number') {

  //       mergedRow[i] += row2[i];
  //       console.log(row1[i]);
  //     }
  //   }
  //   return mergedRow;
  // }



  // const mergedRows = mergeRowsWithConditions(rows);


  function arrayDifference(arrays) {
    if (arrays.length < 2) {
      return [];
    }

    function difference(arr1, arr2) {
      return arr1.filter((item) => {
        if (typeof item === 'string') {
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
        if (headingitem.type == "string" || headingitem.type == "String" || headingitem.type == "date") {
          return true;
        }
      });
      const stringarray = filteredArray.toString();

      const samerows = [values];
      rows.forEach((valuearray, iii) => {
        if (iii != i) {
          const valuearrayss = valuearray.filter(function (item, ii) {
            let headingitem = findKeyByLabel(headings[ii]);
            if (headingitem.type == "string" || headingitem.type == "String" || headingitem.type == "date") {
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


  function sortData(rows, index, direction) {
    return [...rows].sort((rowA, rowB) => {
      const valueA = rowA[index];
      const valueB = rowB[index];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === "descending" ? valueB - valueA : valueA - valueB;
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        const comparison = valueA.localeCompare(valueB);
        return direction === "descending" ? -comparison : comparison;
      } else {
        return 0;
      }
    });
  }
  const formatRowData = (row) => {
    // Find array values dynamically based on their type or position in the row
    const formattedRow = row.map((value, index) => {
      if (Array.isArray(value)) {
        return (
          <InlineStack wrap={false} gap="200">
            {value.map((item, itemIndex) => (
              <Tag key={itemIndex}>{item}</Tag>
            ))}
          </InlineStack>
        );
      }
      // Return the original value for other columns
      return value;
    });
  
    return formattedRow;
  };

  const paginatedData = data.slice(0, visibleRows);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleRows((prevVisibleRows) => prevVisibleRows + itemsPerPage);
      setLoading(false);
    }, 1000);

  };

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
                return item;
              })
            }
            rows={
              data.map((row) => Object.values(row))
            }
            sortable={Array(headings.length).fill(true)}
            defaultSortDirection="descending"
            onSort={(index, direction) => handleSort(index, direction)}
            fixedFirstColumns={1}
            stickyHeader
            increasedTableDensity
            className="custom-data-table"
            hoverable
          />
          </div>
                {loading && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Spinner size="small" />
        </div>
      )}

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


export default FullDataTableExample;
