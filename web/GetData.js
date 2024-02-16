import { GraphqlQueryError } from '@shopify/shopify-api';
import shopify from "./shopify.js";

export async function getDatabyQuery(session,query) {

  const client = new shopify.api.clients.Graphql({ session });


  try {
    
    return await client.query({
        data: query,
      });
  } 
  catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }

}