import shopify  from "./shopify.js";
import express from "express";
import { MongoClient, ObjectId } from 'mongodb';
import { AddShop } from "./Shop.js";
import { ConnectDB1 } from "./db.js";

// Function to synchronize Shopify data
export async function CreateDB(session, version) {
    
    // Connect to MongoDB

    const client = await ConnectDB1();
  
      const ShopData = await shopify.api.rest.Shop.all({
        session: session,
      });

      //functions
      function convertToSlug(Text) {
        return Text.toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "");
      }
    
      // variable declarations
      let name  = convertToSlug(ShopData.data[0].myshopify_domain);
      var shop_url = ShopData.data[0].myshopify_domain;
      let country_code = ShopData.data[0].country_code;
      let currency = ShopData.data[0].currency;
  
      // Add Shop
      let database = client.db("test");
      let get_coll = database.collection("Stores");
     
      const AdminQuery = { shop_url: shop_url };
      const Adminresult = await get_coll.findOne(AdminQuery);

      
      // Create the new database collection
      let dq = client.db(name.replace(/ /g, '-'));

      if (!Adminresult) {
      // create collections 
      let CreateProductCollection =  dq.createCollection("Products", function(err, res) {  
        if (err) throw err;
        }); 
      let CreateVariantCollection =  dq.createCollection("Variants", function(err, res) {  
        if (err) throw err;
        }); 
      let CreateCollectionsCollection =  dq.createCollection("Collections", function(err, res) {  
        if (err) throw err;   
        }); 
      let CreateOrdersCollection =  dq.createCollection("Orders", function(err, res) {  
        if (err) throw err;   
        }); 
      let CreateCustomersCollection =  dq.createCollection("Customers", function(err, res) {  
        if (err) throw err;   
        });
      let CreateTemplatesCollection =  dq.createCollection("Templates", function(err, res) {  
          if (err) throw err;  
          });
      let defaultOrders =  dq.createCollection("DefOrders", function(err, res) {  
            if (err) throw err; 
          });
        }


      if (!Adminresult) {
       await AddShop({ domain: shop_url, name: name, version: version, currency: currency, countryCode: country_code, Products: ["", "", 0, 0], Variants: ["", "", 0, 0], Collections: ["", "", 0, 0], Customers: ["", "", 0, 0], Orders: ["", "", 0, 0] });
        setTimeout(async function () { }, 1000);
      }
      else{
        console.log("Store already Registered!!");
      }
    
      async function insertBilling() {  
        try {
       
          var client = await ConnectDB1();
          var Database = client.db("test");
          var Collection = Database.collection("billing_plan");
         
           const shop = {shop_name:shop_url};
           const findOneResult = await Collection.findOne(shop);
           const documentToInsert = {
            shop_name: shop_url,
             name: "free",
             status:"active",
             check: 200,
             active_plan: "free"
           };
           if(!findOneResult){
        // Insert the document
          const result = await Collection.insertOne(documentToInsert);
           }else{
          const result = await Collection.updateOne(
            {shop_name:shop_url},
            { $set: {name: "free", status:"active", check: 200, active_plan: "free"}},
          );
           }
          console.log(`Merchant created`);
        } 
        catch(e) {
         console.log(e);
        }
      }
      // transfering predefined template to user's dashboard  
      await insertBilling();  
      const targetCollection = dq.collection('Templates');
      const sourceDatabase = client.db("test");
      const sourceCollection = sourceDatabase.collection('Premadetemplates');
      // const documentsToCopy = await sourceCollection.find({}).toArray();
      // const documentsWithNewIds = documentsToCopy.map(doc => ({ ...doc, _id: new ObjectId() }));
      // await targetCollection.insertMany(documentsWithNewIds);
      
      

  }
 