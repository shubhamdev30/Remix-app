
import { MongoClient, ServerApiVersion } from 'mongodb';
import Brevo from "@getbrevo/brevo";
// for serverless clusture
// const uri = "mongodb+srv://Admin:eXiT75ji60c2Ic0v@cluster0.y0s4hc4.mongodb.net/?retryWrites=true&w=majority";

// for shared clusture
const uri = "mongodb+srv://Admin:eXiT75ji60c2Ic0v@cluster0.y0s4hc4.mongodb.net/?retryWrites=true&w=majority";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});

export const CurrentDate = () => {
  let date_time = new Date();
  let date = ("0" + date_time.getDate()).slice(-2);
  let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
  let year = date_time.getFullYear();
  let hours = date_time.getHours();
  let minutes = date_time.getMinutes();
  let seconds = date_time.getSeconds();
  return (
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  );
};

export async function ConnectDB1() {
  try {
    return client.connect();
  }
  catch (error) {
    console.error(error);
  }
};

export async function ConnectDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("test").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  catch (error) {
    console.error(error);
  }
};

export async function GetSignleMongoDB(shop, Collection) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Create references to the database and collection in order to run
    // operations on them.
    const database = client.db(shop);
    const collection = database.collection(Collection);
    try {
      const findOneResult = await collection.findOne();
      if (findOneResult === null) {
        return JSON.stringify("");
      } else {
        return JSON.stringify(findOneResult);
      }
    } catch (err) {
      console.error(`Something went wrong trying to find one document: ${err}\n`);
    }
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoclient.close();
  }
}

export async function MongoDB_Post(dbName, data, CollectionName, stt) {
  const alldata = data;
  const shop = { shop_name: alldata.shop_name };
  await client.connect();
  const database = client.db(dbName);
  const collection = database.collection(CollectionName);
  try {
    const findOneResult = await collection.findOne(shop);

    if (findOneResult === null) {
      await collection.insertOne(alldata);
      return { message: "success" };
    }
    else if (stt && stt === 1) {
      return true;
    }
    else {
      var newvalues = { $set: alldata };
      await collection.updateOne(shop, newvalues);
      return { message: "success" };
    }
  } catch (err) {
    return `Something went wrong trying to insert the new documents: ${err}\n`;
  }
}


export async function GetMongoDB(dbname, shop, CollectionName) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Create references to the database and collection in order to run
    // operations on them.
    const database = client.db(dbname);
    const collection = database.collection(CollectionName);
    const findOneQuery = { shop_name: shop };
    try {
      const findOneResult = await collection.findOne(findOneQuery);
      if (findOneResult === null) {
        return JSON.stringify("");
      } else {
        return JSON.stringify(findOneResult);
      }
    } catch (err) {
      console.error(`Something went wrong trying to find one document: ${err}\n`);
    }
  } finally {
    // Ensures that the client will close when you finish/error
    // await mongoclient.close();
  }
}

export const SendDataToBrevo = async (resdata) => {
  var apiInstance = new Brevo.ContactsApi();
  // Configure API key authorization: api-key
  var apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = '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';
  // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
  //apiKey.apiKeyPrefix = 'Token';
  var createContact = new Brevo.CreateContact();
  const ownerinfo = resdata.shop_owner.split(" ");
  createContact.email = resdata.email;
  createContact.listIds = [4, 5];
  createContact.updateEnabled = true;
  createContact.attributes = {
    "FIRSTNAME": ownerinfo[0],
    "LASTNAME": ownerinfo[1],
    "PHONE": resdata.phone,
    "STORE": resdata.shop_name,
    "UNINSTALL": "false",
    "WELCOME_MAIL_SENT": "",
    "UNINSTALL_MAIL_SENT": "",
    "CUSTOMERS": resdata.customer
  }
  apiInstance.createContact(createContact).then(function (data) {
    console.log('API called successfully. Returned data: ' + data);
  }, function (error) {
    console.error(error);
  });
};
export const UpdateDataToBrevo = async (resdata) => {
  var apiInstance = new Brevo.ContactsApi();
  // Configure API key authorization: api-key
  var apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = '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';
  // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
  //apiKey.apiKeyPrefix = 'Token';
 
  var updateContact = new Brevo.UpdateContact();
  updateContact.attributes = {
    "UNINSTALL": "true"
  }
  var identifier = resdata.email; // String | Email (urlencoded) OR ID of the contact
  apiInstance.updateContact(identifier, updateContact).then(function () {
    console.log('Contact Updated');
  }, function (error) {
    console.error(error);
  });
  var listId = 6; 
  var contactEmails = new Brevo.AddContactToList(); 
  contactEmails.emails = [identifier];
  apiInstance.addContactToList(listId, contactEmails).then(function (data) {
    console.log("Contact added to uninstall list" + data);
  }, function (error) {
    console.error(error);
  });
};



export const webhookFunction = async (shopify, session) => {
  var data = await shopify.api.rest.Shop.all({
    session: session,
    fields: "email,phone,shop_owner",
  });
  data = data.data;
  const CustomerCount = await shopify.api.rest.Customer.count({
    session: session,
  });
  const resData = {
    shop_name: session.shop,
    email: data[0].email,
    phone: data[0].phone,
    shop_owner: data[0].shop_owner,
    customer: CustomerCount.count,
    date: CurrentDate(),
    status: 1,
  };
  return resData;
};