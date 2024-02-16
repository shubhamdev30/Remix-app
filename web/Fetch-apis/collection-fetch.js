import { getDatabyQuery } from "../GetData.js";
import { readJSONLFileFromURL } from './readJSONL.js';
export async function CollectionFetch(result, collection, shop_url, session) {
  const CallType = "Collections";
    let query1;
    let b_id;
    query1 =  `mutation {
        bulkOperationRunQuery(
          query: """
          {
            collections {
              edges {
                node {
                  handle
                  id
                  productsCount
                  templateSuffix
                  title
                  updatedAt
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
       if(result.Collections[0] == ""){
        collection.updateOne({shop_url:shop_url },{$set:{Collections: updatedList }});
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
        await collection.updateOne({shop_url:shop_url },{$set:{'Collections.2': 2}});
        break;
       }
     } while (status !== 'COMPLETED');
     
     databulk = response.body.data;
     updatedList = [(result.Collections[0] == "") ? bulkOperationid : result.Collections[0], response.body.data.node.url, 0];
     collection.updateOne({shop_url:shop_url },{$set:{Collections: updatedList }});

     readJSONLFileFromURL(response.body.data.node.url, session, CallType);
     return status;
    }
    catch (error) {
      console.error('Error fetching bulk operation data Collections:', error);
    }
}