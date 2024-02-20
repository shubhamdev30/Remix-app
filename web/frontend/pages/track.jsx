import { Box, Spinner, Icon,InlineStack,Text } from '@shopify/polaris'
import React, { useEffect, useState } from 'react'
import {
  StatusActiveIcon,
  PersonIcon,
  ProductIcon,
  CollectionIcon,
  VariantIcon,
  OrderIcon,
} from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from '../hooks'




function TrackComponent({setShowBanner, showBanner,status,setStatus}) {
  const fetch = useAuthenticatedFetch();
  const [doc, setdoc] = useState("");
  const [progress, setProgress] = useState(0);


  // all default Status
  var [CustomerStatus, setCustomerStatus] = useState(0);
  const [ProductStatus, setProductStatus] = useState(0);
  const [VariantStatus, setVariantStatus] = useState(0);
  const [CollectionStatus, setCollectionStatus] = useState(0);
  const [OrderStatus, setOrderStatus] = useState(0);

  // lengths
  const [Customerlength, setCustomerlength] = useState(0);
  const [Productlength, setProductlength] = useState(0);
  const [Variantlength, setVariantlength] = useState(0);
  const [Collectionlength, setCollectionlength] = useState(0);
  const [Orderlength, setOrderlength] = useState(0);

  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    setTimeout(() => { 
      CheckData();
    }, 2000);
     
  
  }, [isRunning]);

  async function CheckData() {
    const currentTimestamp = Date.now();

    await fetch(`/api/data-progress-check`)
       .then((response) => {
      return response.json()
      })
      .then((data) => {
        if (
          data.CustomerStatus == 2 &&
          data.ProductStatus == 2 &&
          data.VariantStatus == 2 &&
          data.CollectionStatus == 2 &&
          data.OrderStatus == 2
        ) {
          setStatus("completed !!");
        } else {
          setTimeout(() => { 
            setIsRunning(currentTimestamp);
          }, 6000);
        }

        if (data.CustomerStatus === 2) {
          setCustomerStatus(1);
          setCustomerlength(data.CustomerLength);
        }
        if (data.ProductStatus === 2) {
          setProductStatus(1);
          setProductlength(data.ProductLength);
        }
        if (data.VariantStatus === 2) {
          setVariantStatus(1);
          setVariantlength(data.VariantLength);
        }
        if (data.CollectionStatus === 2) {
          setCollectionStatus(1);
          setCollectionlength(data.CollectionLength);
        }
        if (data.OrderStatus === 2) {
          setOrderStatus(1);
          setOrderlength(data.OrderLength);
        }
      });
  }


  const customTextStyle = {
    paddingLeft: "10px",
  };

  return <>
  
        <Box
        paddingBlockEnd="500"
        paddingInlineStart="50"
        paddingInlineEnd="200"
      >
           
        <InlineStack align="space-between">
          <Box>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Icon source={PersonIcon} tone="base" />
              <Box style={customTextStyle}>
                {CustomerStatus === 0 ? (
                  <Text fontWeight="medium" as="p">
                    Customer Syncing...
                  </Text>
                ) : (
                  <Box>
                    <Text fontWeight="medium" as="p">
                    {Customerlength} Customers.
                    </Text>
                   
                  </Box>
                )}
              </Box>
            </div>
          </Box>

          <Box>
            {CustomerStatus === 0 ? (
              <Spinner
                accessibilityLabel="Small spinner example"
                size="small"
              />
            ) : (
              <Icon source={StatusActiveIcon} tone="base" />
            )}
          </Box>
        </InlineStack>
        <Box paddingBlockStart="100" paddingBlockEnd="100"></Box>
        <InlineStack align="space-between">
          <Box>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Icon source={ProductIcon} tone="base" />
              <Box style={customTextStyle}>
                {ProductStatus === 0 ? (
                  <Text fontWeight="medium" as="p">
                    Product Syncing...
                  </Text>
                ) : (
                  <Box>
                    <Text fontWeight="medium" as="p">
                    {Productlength} Products.
                    </Text>
                   
                  </Box>
                )}
              </Box>
            </div>
          </Box>

          <Box>
            {ProductStatus === 0 ? (
              <Spinner
                accessibilityLabel="Small spinner example"
                size="small"
              />
            ) : (
              <Icon source={StatusActiveIcon} tone="base" />
            )}
          </Box>
        </InlineStack>
        <Box paddingBlockStart="100" paddingBlockEnd="100"></Box>
        <InlineStack align="space-between">
          <Box>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Icon source={CollectionIcon} tone="base" />
              <Box style={customTextStyle}>
                {CollectionStatus === 0 ? (
                  <Text fontWeight="medium" as="p">
                    Collection Syncing...
                  </Text>
                ) : (
                  <Box>
                    <Text fontWeight="medium" as="p">
                    {Collectionlength} Collections.
                    </Text>

                  </Box>
                )}
              </Box>
            </div>
          </Box>

          <Box>
            {CollectionStatus === 0 ? (
              <Spinner
                accessibilityLabel="Small spinner example"
                size="small"
              />
            ) : (
              <Icon source={StatusActiveIcon} tone="base" />
            )}
          </Box>
        </InlineStack>
        <Box paddingBlockStart="100" paddingBlockEnd="100"></Box>
        <InlineStack align="space-between">
          <Box>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Icon source={VariantIcon} tone="base" />
              <Box style={customTextStyle}>
                {VariantStatus === 0 ? (
                  <Text fontWeight="medium" as="p">
                    Variant Syncing...
                  </Text>
                ) : (
                  <Box>
                    <Text fontWeight="medium" as="p">
                    {Variantlength} Variants.
                    </Text>
                   
                  </Box>
                )}
              </Box>
            </div>
          </Box>

          <Box>
            {VariantStatus === 0 ? (
              <Spinner
                accessibilityLabel="Small spinner example"
                size="small"
              />
            ) : (
              <Icon source={StatusActiveIcon} tone="base" />
            )}
          </Box>
        </InlineStack>
        <Box paddingBlockStart="100" paddingBlockEnd="100"></Box>
        <InlineStack align="space-between">
          <Box>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Icon source={OrderIcon} tone="base" />
              <Box style={customTextStyle}>
                {OrderStatus === 0 ? (
                  <Text fontWeight="medium" as="p">
                    Order Syncing...
                  </Text>
                ) : (
                  <Box>
                    <Text fontWeight="medium" as="p">
                    {Orderlength} Orders.
                    </Text>
                   
                  </Box>
                )}
              </Box>
            </div>
          </Box>

          <Box>
            {OrderStatus === 0 ? (
              <Spinner
                accessibilityLabel="Small spinner example"
                size="small"
              />
            ) : (
              <Icon source={StatusActiveIcon} tone="base" />
            )}
          </Box>
        </InlineStack>
     
      </Box>
  
  </>;
}


export default TrackComponent