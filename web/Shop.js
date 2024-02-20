import { List } from "immutable";
import mongoose from "mongoose";
import  { MongoClient } from 'mongodb';
import { ConnectDB1 } from "./db.js";

export async function AddShop({domain, name, currency, countryCode, Products, Variants, Collections, Customers, Orders, version }) {
 
   
 
  function convertToSlug(Text) {
    return Text.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

async function insertDocument() {

  try {
 
    var client = await ConnectDB1();
    var Database = client.db("test");
    var Collection = Database.collection("Stores");
   
   
   const documentToInsert = {
     shop_url: domain,
     cron_time: "",
     version: version,
     recents: [],
     name: convertToSlug(name),
     currency: currency,
     countryCode: countryCode,
     Products: Products,
     Variants: Variants,
     Collections: Collections,
     Customers: Customers,
     Orders: Orders
   };

    // Insert the document
    const result = await Collection.insertOne(documentToInsert);
    console.log(`Store Created`);
  } catch(e) {
   console.log(e);
  }
}




insertDocument();



};



