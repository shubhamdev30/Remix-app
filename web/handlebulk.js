import shopify  from "./shopify.js";
import { ConnectDB1 } from "./db.js";
import { CustomersFetch } from "./Fetch-apis/Customers-fetch.js";
import { ProductFetch } from "./Fetch-apis/product-fetch.js";
import { VariantFetch } from "./Fetch-apis/variant-fetch.js";
import { CollectionFetch } from "./Fetch-apis/collection-fetch.js";
import { OrdersFetch } from "./Fetch-apis/orders-fetch.js";
import { FetchNavigation } from "./Fetch-apis/fetch-navigation.js";

// Function to synchronize Shopify data
export async function HandleBulk(session, ConnectDatabase) {
  
  function convertToSlug(Text) {
    return Text.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
  

    const ShopData = await shopify.api.rest.Shop.all({
        session: session,
      });
      var shop_url = ShopData.data[0].myshopify_domain;
      var name =  convertToSlug(ShopData.data[0].myshopify_domain);
      
      let Dbobj = await ConnectDB1();
      let database = Dbobj.db("test");
      let get_coll = database.collection("Stores");
      
      
      const AdminQuery = { shop_url: shop_url };
      const Adminresult = await get_coll.findOne(AdminQuery);

      // get billing plan 
      let BillingCollection = database.collection("billing_plan");
      const BillQuery = { shop_name: shop_url };
      const MerchantObject = await BillingCollection.findOne(BillQuery);
      console.log(MerchantObject);
      
      try {
      console.log(MerchantObject.active_plan); 


      const [customers] = await Promise.all([CustomersFetch(Adminresult, get_coll, shop_url, session, name)]);
      const [products] = await Promise.all([ProductFetch(Adminresult, get_coll, shop_url, session, name)]);
      const [collections] = await Promise.all([CollectionFetch(Adminresult, get_coll, shop_url, session)]);
      const [Variants] = await Promise.all([VariantFetch(Adminresult, get_coll, shop_url, session, name)]);
      const [orders] = await Promise.all([OrdersFetch(Adminresult, get_coll, shop_url, session, name, MerchantObject.active_plan)]);



         // Process products and orders
      } catch (error) {
        console.error('Error during bulk action', error);
      }
  }
 