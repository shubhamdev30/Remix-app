import { ConnectDB1 } from "../db.js";

export async function FormatLineItems(object, callType, collection, databaseName) {

  let MonogoClient = await ConnectDB1();

   let LineItem = MonogoClient.db(databaseName);
  let LineCollection = LineItem.collection("LineItems");
        //  console.log(object["__parentId"] == "undefined");

        if(object["__parentId"] == "undefined"){
          object = null;
          
        }
        //  LineCollection.deleteMany({ __parentId: { $exists: false } }, (err, result) => {
        //   if (err) throw err;

        //   console.log(`${result.deletedCount} document(s) deleted`);
        //   client.close();
        //    });

  
  


    

  }
