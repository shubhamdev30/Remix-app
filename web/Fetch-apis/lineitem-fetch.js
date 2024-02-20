
import { getDatabyQuery } from "../GetData.js";
import { readJSONLFileFromURL } from './readJSONL.js';

export async function LineItemsFetch(result, collection, shop_url, session, name) {
  const CallType = "LineItems";
    let query1;
    let b_id;
    
    query1 =  `mutation {
        bulkOperationRunQuery(
          query: """
          {
            orders {
              edges {
                node {
                  id
           lineItems {
                    edges {
                      node {
                        canRestock
                        currentQuantity
                        discountedTotal
                        discountedUnitPrice
                        fulfillableQuantity
                        fulfillmentStatus
                        id
                        name
                        merchantEditable
                        nonFulfillableQuantity
                        originalTotal
                        originalUnitPrice
                        quantity
                        refundableQuantity
                        requiresShipping
                        restockable
                        sku
                        taxable
                        title
                        totalDiscount
                        unfulfilledDiscountedTotal
                        unfulfilledOriginalTotal
                        unfulfilledQuantity
                        variantTitle
                        vendor
                        variant {
                          availableForSale
                          barcode
                          compareAtPrice
                          createdAt
                          defaultCursor
                          displayName
                          harmonizedSystemCode
                          id
                          inventoryManagement
                          inventoryPolicy
                          inventoryQuantity
                          legacyResourceId
                          price
                          sku
                          storefrontId
                          taxCode
                          taxable
                          title
                          updatedAt
                          weight
                          weightUnit
                          sellingPlanGroupCount
                          sellableOnlineQuantity
                          requiresShipping
                          requiresComponents
                          position
                        }
                      }
                    }
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
        collection.updateOne({shop_url:shop_url },{$set:{LineItems: updatedList }});
        
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
     } while (status !== 'COMPLETED'); 
  
   
     databulk = response.body.data;
   
     updatedList = [(result.Orders[0] == "") ? bulkOperationid : result.Orders[0], response.body.data.node.url, 0];
     collection.updateOne({shop_url:shop_url },{$set:{LineItems: updatedList }});
   

     readJSONLFileFromURL(response.body.data.node.url, session, CallType, collection, name);
  
     return status;
    } 
   
    catch (error) {
      console.error('Error fetching bulk operation data:', error);
    }

}

