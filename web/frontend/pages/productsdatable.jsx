import { BlockStack, Box, Card, DataTable, EmptyState, Text } from "@shopify/polaris";
import { useEffect, useState } from "react";

function Productsdatatable(props) {
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

console.log(data);







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
      </div>
  </Card>
  );
}

export default Productsdatatable;
