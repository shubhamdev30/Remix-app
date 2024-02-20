import { getDatabyQuery } from "../GetData.js";
import { readJSONLFileFromURL } from './readJSONL.js';
export async function FetchNavigation(result, collection, shop_url, session) {
  const CallType = "Navigation";
    let query1;
    let b_id;
    query1 =  `mutation {
        bulkOperationRunQuery(
          query: """
          {
            appInstallations {
              edges {
                node {
                  app {
                    navigationItems {
                      id
                      title
                      url
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
     console.log(`Bulk Response ${CallType} :- ` + JSON.stringify(MutationResponse.body));
      var bulkOperationid =  MutationResponse.body.data.bulkOperationRunQuery.bulkOperation.id;
      console.log("Bulk operation ID is:- " + bulkOperationid);
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
       console.log(response.body.data);
     } while (status !== 'COMPLETED');
     console.log("STATUS " + status);
    //  databulk = response.body.data;
    //  updatedList = [(result.Collections[0] == "") ? bulkOperationid : result.Collections[0], response.body.data.node.url, 0];
    //  collection.updateOne({shop_url:shop_url },{$set:{Collections: updatedList }});
     console.log("URL generated " + response.body.data.node.url);
    
     return status;
    }
    catch (error) {
      console.error('Error fetching bulk operation data:', error);
    }
}