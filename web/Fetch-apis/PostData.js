import shopify from "../shopify.js";
import { MongoClient, ObjectId } from 'mongodb';
import  express from 'express';
import http from 'http';
import {Server} from'socket.io';
import { ConnectDB1 } from "../db.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);


// Function to synchronize Shopify data

export async function PostData(session, jsonval, callType, plan) {

   
      const ShopData = await shopify.api.rest.Shop.all({
        session: session,
      });

      function convertToSlug(Text) {
        return Text.toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "");
      }
      
      let name  = convertToSlug(ShopData.data[0].myshopify_domain);
      var shop_url = ShopData.data[0].myshopify_domain;
   
      const client = await ConnectDB1();
            
      let dq = client.db(name);
      let testdb = client.db("test");
      let shopCol = testdb.collection("Stores");

     

      const Type = callType;

        switch (Type) {

            case 'Products':
               let Prodcollection =  dq.collection('Products');
               await Prodcollection.deleteMany({}).then((result) => {}).catch((err) => {});
               await shopCol.updateOne({shop_url:shop_url },{$set:{'Products.2': 1}});
               const Productresult = await Prodcollection.bulkWrite(jsonval);
               let ProductsLength = (await Prodcollection.find({}).toArray()).length; 
               await shopCol.updateOne({shop_url:shop_url },{$set:{'Products.3': ProductsLength}});
               await shopCol.updateOne({shop_url:shop_url },{$set:{'Products.2': 2}});
               console.log("Product ka Data Gaya!");
            break;

            case 'Variants':
                let Variantscollection =  dq.collection('Variants');
                await Variantscollection.deleteMany({}).then((result) => {}).catch((err) => {});
                await shopCol.updateOne({shop_url:shop_url },{$set:{'Variants.2': 1}});
                const Variantresult = await Variantscollection.bulkWrite(jsonval);
                let VariantsLength = (await Variantscollection.find({}).toArray()).length; 
                await shopCol.updateOne({shop_url:shop_url },{$set:{'Variants.3': VariantsLength}});
                await shopCol.updateOne({shop_url:shop_url },{$set:{'Variants.2': 2}});
                console.log("Variant ka Data Gaya!"); 
            break;

            case 'Orders':
                let Orderscollection =  dq.collection('Orders');
                let OrdersLength;
                await Orderscollection.deleteMany({}).then((result) => {}).catch((err) => {});
                await shopCol.updateOne({shop_url:shop_url },{$set:{'Orders.2': 1}});
               await Orderscollection.bulkWrite(jsonval);
                OrdersLength = (await Orderscollection.find({ __parentId: { $exists: false } }).toArray()).length; 
                 

                await shopCol.updateOne({shop_url:shop_url },{$set:{'Orders.3': OrdersLength}});
                await shopCol.updateOne({shop_url:shop_url },{$set:{'Orders.2': 2}});
                console.log("Orders ka Data Gaya!"); 
                

            break;

            case 'Collections':
              let Collcollection =  dq.collection('Collections');
              await Collcollection.deleteMany({}).then((result) => {}).catch((err) => {});
              await shopCol.updateOne({shop_url:shop_url },{$set:{'Collections.2': 1}});
               await Collcollection.bulkWrite(jsonval);
              let CollectionLength = (await Collcollection.find({}).toArray()).length; 
              await shopCol.updateOne({shop_url:shop_url },{$set:{'Collections.3': CollectionLength}});
              await  shopCol.updateOne({shop_url:shop_url },{$set:{'Collections.2': 2}});
              console.log("Collections ka Data Gaya!"); 

            break;

            case 'Customers':
              let Customerscollection =  dq.collection('Customers');
              await Customerscollection.deleteMany({}).then((result) => { }).catch((err) => {});
              await shopCol.updateOne({shop_url:shop_url },{$set:{'Customers.2': 1}});



                // const existingDocs = await Customerscollection.find({}).toArray();
                // const updatedDocs = jsonval.filter((newDoc) => {
                //   const existingDoc = existingDocs.find((doc) => doc.id === newDoc.insertOne.document.id);   
                  
                //   return !existingDoc || existingDoc.updatedAt !== newDoc.insertOne.document.updatedAt;
                // });

                // console.log(JSON.stringify(updatedDocs));

                // if (updatedDocs.length > 0) {
                //   await Promise.all(updatedDocs.map(async (document) => {
                //     await Customerscollection.updateOne(
                //       { id: document.id },
                //       { $set: document },
                //       { upsert: true } 
                //     );
                //   }));
                // }


              const Customersresult = await Customerscollection.bulkWrite(jsonval);
              let CustomersLength = (await Customerscollection.find({}).toArray()).length; 
              await shopCol.updateOne({shop_url:shop_url },{$set:{'Customers.3': CustomersLength}});
              await shopCol.updateOne({shop_url:shop_url },{$set:{'Customers.2': 2}});
              console.log("Customers ka Data Gaya!"); 

            break;

            default:
              console.log('Not recognized yet!!');
              break;
        }
      }