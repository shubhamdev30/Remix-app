import { getDatabyQuery } from "../GetData.js";
import { readJSONLFileFromURL } from './readJSONL.js';
export async function CustomersFetch(result, collection, shop_url, session, name, plan) {
  const CallType = "Customers";
    let query1;
    let b_id;
    query1 =  `mutation {
        bulkOperationRunQuery(
          query: """
          {
            customers {
              edges {
                node {
                  id
                  firstName
                  lastName
                  displayName
                  email
                  state
                  tags
                  taxExempt
                  unsubscribeUrl
                  updatedAt
                  validEmailAddress
                  verifiedEmail
                  createdAt
                  phone
                  note
                  numberOfOrders
                  addresses {
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
                  }
                  amountSpent {
                    amount
                    currencyCode
                  }
                  defaultAddress {
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
                    name
                    phone
                    province
                    provinceCode
                    timeZone
                    zip
                  }
                  canDelete
                  averageOrderAmount
                  acceptsMarketing
                  lastOrder {
                    createdAt
                    confirmed
                    confirmationNumber
                    closedAt
                    clientIp
                    closed
                    billingAddressMatchesShippingAddress
                    canMarkAsPaid
                    cancelReason
                    cancelledAt
                    capturable
                    canNotifyCustomer
                    currencyCode
                    cartDiscountAmount
                    cartDiscountAmountSet {
                      presentmentMoney {
                        amount
                      }
                      shopMoney {
                        amount
                      }
                    }
                    totalShippingPrice
                    totalRefunded
                    totalDiscounts
                    taxesIncluded
                    taxExempt
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
                      lastName
                      name
                      phone
                      province
                      provinceCode
                      timeZone
                      zip
                    }
                    currentSubtotalLineItemsQuantity
                    currentTaxLines {
                      price
                      channelLiable
                      rate
                      ratePercentage
                      title
                    }
                    customerAcceptsMarketing
                    currentTotalWeight
                    displayAddress {
                      address1
                      address2
                      city
                      company
                      country
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
                    displayFulfillmentStatus
                    displayFinancialStatus
                    disputes {
                      id
                      initiatedAs
                      status
                    }
                    fullyPaid
                    hasTimelineComment
                    id
                    landingPageUrl
                    landingPageDisplayText
                    name
                    netPayment
                    netPaymentSet {
                      presentmentMoney {
                        amount
                      }
                      shopMoney {
                        amount
                      }
                    }
                    note
                    paymentGatewayNames
                    phone
                    presentmentCurrencyCode
                    processedAt
                    referralCode
                    referrerDisplayText
                    referrerUrl
                    returnStatus
                    restockable
                    requiresShipping
                    registeredSourceUrl
                    riskLevel
                  }
                  taxExemptions
                  acceptsMarketingUpdatedAt
                  hasTimelineComment
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
       if(result.Customers[0] == ""){
        collection.updateOne({shop_url:shop_url },{$set:{Customers: updatedList }});
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
       console.log(response.body.data, session.shop);
       if (status === 'FAILED') {
        await collection.updateOne({shop_url:shop_url },{$set:{'Customers.2': 2}});
        break;
       }
     } while (status !== 'COMPLETED');
     databulk = response.body.data;
     updatedList = [(result.Customers[0] == "") ? bulkOperationid : result.Customers[0], response.body.data.node.url, 0];
     collection.updateOne({shop_url:shop_url },{$set:{Customers: updatedList }});
     readJSONLFileFromURL(response.body.data.node.url, session, CallType, collection, name, plan);
     return status;
    }
    catch (error) {
      console.error('Error fetching bulk operation data Customers:', error);
    }
}