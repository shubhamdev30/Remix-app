import { getDatabyQuery } from "../GetData.js";
import { readJSONLFileFromURL } from './readJSONL.js';

export async function OrdersFetch(result, collection, shop_url, session, name, plan) {
  const CallType = "Orders";
    let query1;
    let freeQuery;
    let b_id;
    
    query1 =  `mutation {
      bulkOperationRunQuery(
        query: """
        {
          orders {
            edges {
              node {
                channel {
                  name
                  app {
                    title
                  }
                }          
                app {
                  name
                }
                billingAddressMatchesShippingAddress
                canMarkAsPaid
                cancelledAt
                cancelReason
                cartDiscountAmount
                clientIp
                closedAt
                closed
                confirmed
                createdAt
                processedAt
                confirmed
                currencyCode
                currentSubtotalLineItemsQuantity
                currentTotalWeight
                customerAcceptsMarketing
                customerLocale
                discountCode
                displayFinancialStatus
                displayFulfillmentStatus
                discountCodes
                email
                estimatedTaxes
                fulfillable
                fullyPaid
                hasTimelineComment
                id
                landingPageDisplayText
                landingPageUrl
                location
                merchantEditable
                name
                netPayment
                note
                paymentGatewayNames
                phone
                presentmentCurrencyCode
                processedAt
                referralCode
                referrerDisplayText
                referrerUrl
                refundable
                restockable
                returnStatus
                requiresShipping
                registeredSourceUrl
                riskLevel
                subtotalLineItemsQuantity
                subtotalPrice
                tags
                taxExempt
                totalPrice
                totalDiscounts
                totalRefunded
                totalShippingPrice
                totalTax
                taxLines {
                  title
                  ratePercentage
                  rate
                  price
                }
                totalWeight
                unpaid
                updatedAt

                  additionalFees {
                  price {
                    shopMoney {
                      amount
                    }
                  }
                }


                currentTotalAdditionalFeesSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                currentTotalDiscountsSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                currentTotalDutiesSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                currentTotalPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                currentTotalTaxSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                originalTotalAdditionalFeesSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                originalTotalDutiesSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                originalTotalPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                totalPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                totalRefundedSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                totalRefundedShippingSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                totalShippingPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                totalTaxSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                totalTipReceivedSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                totalReceivedSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                totalDiscountsSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                  shopMoney {
                    amount
                    
                  }
                }

                shippingAddress {
                  address1
                  address2
                  city
                  company
                  coordinatesValidated
                  country
                  countryCode
                  countryCodeV2
                  firstName
                  lastName
                  id
                  name
                  phone
                  province
                  provinceCode
                  timeZone
                  zip
                  formattedArea
                  longitude
                  latitude
                }

                shippingLine {
                  price
                  shippingRateHandle
                  id
                  title
                  source
                  taxLines {
                    title
                    ratePercentage
                    rate
                    price
                  }
                  requestedFulfillmentService {
                    callbackUrl
                    fulfillmentOrdersOptIn
                    handle
                    inventoryManagement
                    shippingMethods {
                      code
                      label
                    }
                    type
                    id
                  }
                  id
                  deliveryCategory
                  phone
                  price
                }



               
                lineItems {
                  edges {
                    node {
                      product {
                        tags
                      }
                      variant {
                        compareAtPrice
                        createdAt
                        displayName
                        price
                        sku
                        taxCode
                        title
                        weight
                        weightUnit
                        updatedAt
                        requiresShipping
                        position
                        barcode
                        id
                      }
                      variantTitle
                      vendor
                      canRestock
                      currentQuantity
                      discountedTotal
                      fulfillableQuantity
                      fulfillmentStatus
                      id
                      merchantEditable
                      name
                      nonFulfillableQuantity
                      originalTotal
                      originalUnitPrice
                      quantity
                      refundableQuantity
                      sku
                      taxable
                      title
                      totalDiscount
                      unfulfilledDiscountedTotal
                      unfulfilledOriginalTotal
                      unfulfilledQuantity
                      taxLines {
                        price
                        rate
                        ratePercentage
                        title
                      }
                    }
                  }
                }
                

                transactions {
                  fees {
                    amount {
                      amount
                    }
                  }
                  accountNumber
                  amount
                  authorizationCode
                  authorizationExpiresAt
                  createdAt
                  errorCode
                  formattedGateway
                  gateway
                  id
                  kind
                  manuallyCapturable
                  maximumRefundable
                  order {
                    billingAddressMatchesShippingAddress
                    canMarkAsPaid
                    canNotifyCustomer
                    cancelReason
                    cancelledAt
                    capturable
                    cartDiscountAmount
                    clientIp
                    confirmationNumber
                    confirmed
                    createdAt
                    currencyCode
                    billingAddress {
                      address1
                      address2
                      city
                      company
                      countryCode
                      countryCodeV2
                      firstName
                      lastName
                      name
                      phone
                      province
                      provinceCode
                      timeZone
                      zip
                    }
                  }
                  paymentId
                  paymentMethod
                  processedAt
                  receipt
                  receiptJson
                  settlementCurrency
                  settlementCurrencyRate
                  status
                  test
                  totalUnsettled
                }

                customer {
                  taxExempt
                  taxExemptions
                  lastOrder {
                    name
                    id
                    fullyPaid
                    landingPageDisplayText
                    landingPageUrl
                    returnStatus
                    restockable
                    refundable
                    displayFinancialStatus
                    displayFulfillmentStatus
                    createdAt
                    currentSubtotalLineItemsQuantity
                    email
                    fulfillable
                    netPayment
                  }
                  acceptsMarketing
                  acceptsMarketingUpdatedAt
                  averageOrderAmount
                  canDelete
                  createdAt
                  displayName
                  email
                  firstName
                  hasTimelineComment
                  id
                  lastName
                  note
                  numberOfOrders
                  phone
                  state
                  productSubscriberStatus
                  tags
                  unsubscribeUrl
                  updatedAt
                  validEmailAddress
                  verifiedEmail
                  amountSpent {
                    amount
                  }
                  averageOrderAmountV2 {
                    amount
                  }
                  defaultAddress {
                    address1
                    address2
                    city
                    company
                    country
                    countryCode
                    countryCodeV2
                    firstName
                    id
                    lastName
                    name
                    phone
                    province
                    provinceCode
                    timeZone
                    zip
                  }
                }
                customerJourney {
                  customerOrderIndex
                  daysToConversion
                  firstVisit {
                    id
                    landingPage
                    landingPageHtml
                    occurredAt
                    referralCode
                    referralInfoHtml
                    referrerUrl
                    source
                    sourceDescription
                    sourceType
                    utmParameters {
                      campaign
                      content
                      medium
                      source
                      term
                    }
                  }
                  lastVisit {
                    id
                    landingPage
                    landingPageHtml
                    occurredAt
                    referralCode
                    referralInfoHtml
                    referrerUrl
                    source
                    sourceDescription
                    sourceType
                    utmParameters {
                      campaign
                      content
                      medium
                      source
                      term
                    }
                  }
                }

                refunds {
                  createdAt
                  note
                  legacyResourceId
                  id
                  order {
                    billingAddressMatchesShippingAddress
                    canMarkAsPaid
                    canNotifyCustomer
                    cancelReason
                    cancelledAt
                    capturable
                    cartDiscountAmount
                    clientIp
                    closed
                    closedAt
                    confirmationNumber
                    createdAt
                    confirmed
                    currencyCode
                    currentSubtotalLineItemsQuantity
                    currentTotalWeight
                    customerAcceptsMarketing
                    discountCode
                    discountCodes
                    displayFinancialStatus
                    displayFulfillmentStatus
                    email
                    fulfillable
                    fullyPaid
                    hasTimelineComment
                    id
                    landingPageDisplayText
                    landingPageUrl
                    legacyResourceId
                  }

                  
                  totalRefunded {
                    amount
                  }
                  updatedAt
                }

                billingAddress {
                  address1
                  address2
                  city
                  company
                  coordinatesValidated
                  country
                  countryCode
                  countryCodeV2
                  firstName
                  id
                  lastName
                  name
                  phone
                  province
                  provinceCode
                  timeZone
                  zip
                  formattedArea
                  longitude
                }
              }
            }
          }
        }    
        """
      ) {
        bulkOperation {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
    `;

      const MutationResponse = await getDatabyQuery(session, query1);

  
      var bulkOperationid =  MutationResponse.body.data.bulkOperationRunQuery.bulkOperation.id;
   
   
      let updatedList = [bulkOperationid, "", 0]; 
      if(result){
       if(result.Orders[0] == ""){
        collection.updateOne({shop_url:shop_url },{$set:{Orders: updatedList }});
       }
      }
   
      let databulk = "";
   
    
   try {
      let query2 = `query {
        node(id: "${bulkOperationid}") {
          ... on BulkOperation {
            id
            status
            errorCode
           createdAt
            completedAt
            objectCount
            fileSize
            url
          }
        }
    }`;
   
     
    
   
  
   let status = '';
   let response = "";
  
     do {
      response = await getDatabyQuery(session, query2);
       status = response.body.data.node.status;
       if (status === 'FAILED') {
        await collection.updateOne({shop_url:shop_url },{$set:{'Orders.2': 2}});
        break;
       }
     
     } while (status !== 'COMPLETED'); 
  
     databulk = response.body.data;
   
     updatedList = [(result.Orders[0] == "") ? bulkOperationid : result.Orders[0], response.body.data.node.url, 0];
     collection.updateOne({shop_url:shop_url },{$set:{Orders: updatedList }});
   
    
     readJSONLFileFromURL(response.body.data.node.url, session, CallType, collection, name, plan);
  
    } 
   
    catch (error) {
      await collection.updateOne({shop_url:shop_url },{$set:{'Orders.2': 2}});
      console.error('Error fetching bulk operation data Orders: ', error);
      console.error(error.stack);
    }
    
}