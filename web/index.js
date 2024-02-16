import { join } from "path";
import { readFileSync } from "fs";
import cron from "node-cron";
import express from "express";
import serveStatic from "serve-static";
import { MongoClient } from 'mongodb';
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { AddShop } from "./Shop.js";
import { CreateDB } from "./createdb.js";
import { getDatabyQuery } from "./GetData.js";
import { randomBytes } from 'crypto';
import { ConnectDB1,GetMongoDB, MongoDB_Post } from "./db.js";
import { Scheduletask } from "./Fetch-apis/function.js";
import { HandleBulk } from "./handlebulk.js";
import session  from "express-session";
import createMemoryStore from 'memorystore';
import { convertformet } from "./Fetch-apis/convertformet.js";
import path from "path";
import { DateTime } from "luxon";
import verifyWebhook from "./VerifyWebhook.js";
import { startCronJob, stopCronJob } from './CronManager.js';
import { webhookFunction, SendDataToBrevo } from "./db.js";
import OrdersMerge from "./Fetch-apis/OrderMerge.js";
import CustomerMerge from "./Fetch-apis/CustomerMerge.js";
import ProductMerge from "./Fetch-apis/ProductMerge.js";
import convertcsv from "./frontend/components/dataexports/convertcsv.js";
import emailcsv from "./Fetch-apis/sendcsv.js";
import emailexcel from "./Fetch-apis/sendexcel.js";
import sendpdf from "./Fetch-apis/sendpdf.js";
const MemoryStore = createMemoryStore(session);

var version = 1;
let connectToMongoDB = await ConnectDB1();
let on_installcron;
const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
// await initializeCronJobs();


function convertDateIfValid(data) {
    // Define a function to check if a string matches the ISO 8601 format
    function isIso8601Date(str) {
        const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
        return regex.test(str);
    }

    // Define a function to convert a date string to the "DD-MMM-YYYY" format
    function convertDateString(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).replace(/ /g, '-');
    }

    // Iterate through each sub-array and update date strings
    return data.map(subArray => subArray.map(element => {
        return isIso8601Date(element) ? convertDateString(element) : element;
    }));
}

async function initializeCronJobs() {

  let client = await ConnectDB1();
  let Database = client.db("test");
  let StoreCol = Database.collection('Stores');
  let collection = Database.collection('cronJobs');
  let cronJobs = await collection.find().toArray();

  let storeshCollection = Database.collection('storeschedules');
  let storeSchedule = await storeshCollection.find().toArray();

  let DatabaseSession = client.db("Sessions");
  let collectionSession = DatabaseSession.collection('shopify_sessions');

  cronJobs.forEach(async (object) => {
    const SessionObject = await collectionSession.findOne({shop:object.store});
    let session = SessionObject;
    var myCronJob = cron.schedule(object.schedule,  () => {

       HandleBulk(session, Database);
    
    },
    {name:object.store});
    const alltask =  cron.getTasks();
  });

  storeSchedule.forEach(async (object) => {
    const SessionObject = await collectionSession.findOne({shop:object.shop_name});
    let session = SessionObject;

    // SHID & dbname
    var sh_id = object.sh_id;
    var shop = object.slug_shop_name;

    //Store ob
    let StoreOb = await StoreCol.findOne({shop_url:object.shop_name});
    let currency = StoreOb?.currency;
    let countrycode = StoreOb?.countryCode;

    // merchant database and collection
    let shopDatabase = client.db(shop);
    let collection = shopDatabase.collection('Schedules');
    let scheduleobj = await collection.findOne({sh_id:sh_id});

  
    var myCronJob = cron.schedule(object.cronExpression,  () => {
    Scheduletask(shopDatabase,'Excel File Attachment', 'Attached is the Excel file.', scheduleobj, Database , countrycode, currency );
    },{name:object.shop_name});
   
  });

  console.log('Cron jobs initialized');
}

app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  resave: false,
  secret: 'danda'
}))

function addSeconds(date, seconds) {
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (_req, res,next)=>{
    const session = res.locals.shopify.session;

    const resdata = await webhookFunction(shopify, session);

    await MongoDB_Post("test",resdata,"shop_info");

    await SendDataToBrevo(resdata);

    const now = new Date();
    const newDate = addSeconds(now, 15);
    const currentHour = newDate.getHours();
    const currentMinute = newDate.getMinutes();
    const currentSecond = newDate.getSeconds();

   
    let ConnectDatabase = await ConnectDB1();
    var shop_url = session.shop;
  
    await CreateDB(session, version);

    let testdb = ConnectDatabase.db("test");
    let shopCol = testdb.collection("Stores");
  

    shopCol.updateOne({shop_url: shop_url},{$set:{'cron_time': `${currentSecond} ${currentMinute} ${currentHour} * * *`}});
   

    await shopCol.updateOne({shop_url:shop_url },{$set:{'Products.2': 0}});
    await shopCol.updateOne({shop_url:shop_url },{$set:{'Variants.2': 0}});
    await shopCol.updateOne({shop_url:shop_url },{$set:{'Orders.2': 0}});
    await shopCol.updateOne({shop_url:shop_url },{$set:{'Collections.2': 0}});
    await shopCol.updateOne({shop_url:shop_url },{$set:{'Customers.2': 0}});

  
    setTimeout(() => {
      HandleBulk(session, ConnectDatabase);
    }, 15000); 


  //  await startCronJob(testdb, shop_url, `${currentSecond} ${currentMinute} ${currentHour} * * *`, () => {

  //     console.log("I am running....");
      
  //     HandleBulk(session, ConnectDatabase);

  //   });
     


    next();
  },
  shopify.redirectToShopifyOrAppRoot()
  );

app.use(`${shopify.config.webhooks.path}`, verifyWebhook);

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

app.use(express.json());

app.use("/api/*", shopify.validateAuthenticatedSession());

var bigsession = [];

const secretKey = randomBytes(32).toString('hex');

function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

// Configure session middleware
app.use(session({
  secret: secretKey,
  resave: false
}));

export const getbilling = async ( session) => {
  var data = await GetMongoDB("test",session.shop,"billing_plan");
   data=JSON.parse(data);
  if (data?.status=="active") {
    return data;
  }
  return {check:200};
};

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

export function dateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

app.get("/api/get-shop", async (_req, res) => {
  let data = {};
  let billingdata = {};
  let status = 200;
  let session = res.locals.shopify.session;
  try {
    const res = await shopify.api.rest.Shop.all({
      session: session,
      fields:"shop_owner,plan_name,"
    });
   
    res.data.map((shop)=>{data.shop_owner=shop.shop_owner,data.plan_name=shop.plan_name});
    data.name=session.shop.replace(".myshopify.com", "");
   
     billingdata = await getbilling(session);
    if(data.plan_name != "partner_test" && billingdata.name == "free" && billingdata.status == "active"){
      const plan = {
        shop_name:session.shop,
        name:"free",
        status:"cancel",
        check:200
        }
        billingdata == plan;
        await MongoDB_Post("test",plan,"billing_plan");
    }
  } catch (error) {
    status = 500;
    data = error.message;
  }
  const alltask =  cron.getTasks();

  console.log(session);

  res.json({data,billingdata});
});

app.post("/api/postrecent", async (_req, res) => {
  const session = res.locals.shopify.session;

  const links = _req.body.links;
  console.log(`Links ${JSON.stringify(links)}`);

  let ConnectDatabase = await ConnectDB1();

  let testdb = ConnectDatabase.db("test");
  let shopCol = testdb.collection("Stores");

  // Fetch the current recents array
  const existingData = await shopCol.findOne({ shop_url: session.shop });
  const currentRecents = existingData ? existingData.recents || [] : [];

  // Identify new links that are not already in the currentRecents array
  const newLinks = links.filter(link => 
    !currentRecents.some(existingLink => existingLink.id === link.id)
  );

  // Add new elements to the beginning of the array
  const newRecents = newLinks.concat(currentRecents);

  // Limit the array length to 5
  const updatedRecents = newRecents.slice(0, 5);

  await shopCol.updateOne(
    { shop_url: session.shop },
    { $set: { recents: updatedRecents } },
    { upsert: true } // Create the document if it doesn't exist
  );

  res.status(200).send(updatedRecents);
});

app.get("/api/getrecent", async (_req, res) => {

  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });
  
  var shop_url = ShopData.data[0].myshopify_domain;

  let database = connectToMongoDB.db("test");
  let get_coll = database.collection("Stores");

  const AdminQuery = { shop_url: shop_url };
  const Adminresult = await get_coll.findOne(AdminQuery);

  res.json(Adminresult);

});

app.post("/api/post-billing", async (req, res) => {
  const { name,shop,test,price } = req.body;
  const session = res.locals.shopify.session;
  if(name != "free"){
    let data = [];
    let trialDays = 0;
    data = await GetMongoDB("test",session.shop,"trialdays");
    data=JSON.parse(data);
    // if (data=="") {
    //   trialDays = 14;
    // }else{
    // if (data.plan_subscription != "" && data.cancel_subscription == "1") {
    //   const a = new Date(data.plan_subscription);
    //   const b = new Date();
    //   let countDays = dateDiffInDays(a, b);
    //   trialDays = countDays < 14 ? 14 - countDays : 0;
    // } else {
    //   const a = new Date(data.plan_subscription);
    //   const b = new Date(data.cancel_subscription);
    //   let countDays = dateDiffInDays(a, b);
    //   trialDays = countDays < 14 ? 14 - countDays : 0;
    // }
    // }
  const createBilling = {
    "query": `mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $trialDays: Int,$test:Boolean) {
      appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems, trialDays: $trialDays,test:$test) {
        userErrors {
          field
          message
        }
        appSubscription {
          id
        }
        confirmationUrl
      }
    }`,
    "variables": {
      "name": name,
      "returnUrl": `https://admin.shopify.com/store/${shop.name}/apps/${shopify.api.config.apiKey}/`,
      "test": test,
      "trialDays": trialDays,
      "lineItems": [
        {
          "plan": {
            "appRecurringPricingDetails": {
              "price": {
                "amount": Number(price),
                "currencyCode": "USD"
              },
              "interval": "EVERY_30_DAYS"
            }
          }
        }
      ]
    }
}
const createBillingResult = await getDatabyQuery(session, createBilling);
const dataResult = createBillingResult.body.data;
res.status(200).send({data:dataResult.appSubscriptionCreate.confirmationUrl});
  }else{
    const plan = {
    shop_name:session.shop,
    name:name,
    status:"active",
    check:200,
    active_plan:name
    }
    await MongoDB_Post("test",plan,"billing_plan");
    res.status(200).send({data:`https://admin.shopify.com/store/${shop.name}/apps/${shopify.api.config.apiKey}/plans`});
    }
});

app.get("/api/has-payment-check", async (_req, res) => {
  let session = res.locals.shopify.session;
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });

    const currentplan = {
    "query": `{
      currentAppInstallation {
        activeSubscriptions {
            status
            returnUrl
            name
            trialDays
            test
            currentPeriodEnd
        }
      }
    }`
    }
  const planResult = await getDatabyQuery(session, currentplan);
if(planResult.body.data.currentAppInstallation.activeSubscriptions[0]?.status == "ACTIVE"){
  

  let ConnectDatabase = await ConnectDB1();
  var shop_url = ShopData.data[0].myshopify_domain;
  let testdb = ConnectDatabase.db("test");
  let shopCol = testdb.collection("Stores");
  await shopCol.updateOne({shop_url:shop_url},{$set:{'Products.2': 0}});
  await shopCol.updateOne({shop_url:shop_url},{$set:{'Variants.2': 0}});
  await shopCol.updateOne({shop_url:shop_url},{$set:{'Orders.2': 0}});
  await shopCol.updateOne({shop_url:shop_url},{$set:{'Collections.2': 0}});
  await shopCol.updateOne({shop_url:shop_url},{$set:{'Customers.2': 0}});

  const now = new Date();
  const newDate = addSeconds(now, 15);
  const currentHour = newDate.getHours();
  const currentMinute = newDate.getMinutes();
  const currentSecond = newDate.getSeconds();



  const reviseCol = testdb.collection("cronJobs");
  
  // await stopCronJob(testdb, shop_url);
  await shopCol.updateOne({shop_url: shop_url},{$set:{'cron_time': `${currentSecond} ${currentMinute} ${currentHour} * * *`}});
  await reviseCol.updateOne({store: session.shop},{$set:{'schedule': `${currentSecond} ${currentMinute} ${currentHour} * * *`}});



    const resdata = {
      shop_name:session.shop,
      plan_subscription:CurrentDate(),
      cancel_subscription:1,
    }

    const plan = {
      shop_name:session.shop,
      name:planResult.body.data.currentAppInstallation.activeSubscriptions[0].name,
      status:"active",
      check:200,
      active_plan:planResult.body.data.currentAppInstallation.activeSubscriptions[0].name,
    }
  await MongoDB_Post("test",resdata,"trialdays",1);
  await MongoDB_Post("test",plan,"billing_plan");



  
     startCronJob(testdb, shop_url, `${currentSecond} ${currentMinute} ${currentHour} * * *`, () => {

      console.log("I am running again....");
      HandleBulk(session, ConnectDatabase);
    });
    
  
}
  res.send({shop:session.shop});
});


app.get("/api/getshopname", async (_req, res) => {
  const session = res.locals.shopify.session;

  var name = session.shop.split(".myshopify");
  res.json(name[0])
});

app.get("/api/GetBulk", async (_req, res) => {

  const session = res.locals.shopify.session;
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });

  let ConnectDatabase = await ConnectDB1();
  var shop_url = ShopData.data[0].myshopify_domain;
  let AdminDatabase = ConnectDatabase.db("test");
  let shopCol = AdminDatabase.collection("Stores");

  await shopCol.updateOne({shop_url:shop_url },{$set:{'Products.2': 0}});
  await shopCol.updateOne({shop_url:shop_url },{$set:{'Variants.2': 0}});
  await shopCol.updateOne({shop_url:shop_url },{$set:{'Orders.2': 0}});
  await shopCol.updateOne({shop_url:shop_url },{$set:{'Collections.2': 0}});
  await shopCol.updateOne({shop_url:shop_url },{$set:{'Customers.2': 0}});
  await HandleBulk(session, ConnectDatabase);
  res.json(session);

});

app.get("/api/data-progress-check", async (_req, res) => {

  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });

  
  var email = ShopData.data[0].email;
  var shop_url = ShopData.data[0].myshopify_domain;
  var s_name = convertToSlug(ShopData.data[0].myshopify_domain);

  let database = connectToMongoDB.db("test");
  let name = connectToMongoDB.db(s_name);
  let get_coll = database.collection("Stores");

  const AdminQuery = { shop_url: shop_url };
  const Adminresult = await get_coll.findOne(AdminQuery);
  
  let data = {
    "ProductLength":Adminresult.Products[3],
    "ProductStatus":Adminresult.Products[2],
    "OrderLength":Adminresult.Orders[3],
    "OrderStatus":Adminresult.Orders[2],
    "VariantLength":Adminresult.Variants[3],
    "VariantStatus":Adminresult.Variants[2],
    "CustomerLength":Adminresult.Customers[3],
    "CustomerStatus":Adminresult.Customers[2],
    "CollectionLength":Adminresult.Collections[3],
    "CollectionStatus":Adminresult.Collections[2]
  };

  res.status(200).send(data);

});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

// get orders lineitems
app.get("/api/GetLineitems", async (_req, res) => {

  const session = res.locals.shopify.session;
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });


  var email = ShopData.data[0].email;
  var shop_url = ShopData.data[0].myshopify_domain;
  
  
  let database = connectToMongoDB.db(convertToSlug(ShopData.data[0].myshopify_domain));
  let get_coll = database.collection("Orders");

  const page = parseInt(_req.query.page) || 1;
  const itemsPerPage = 20;

  // const totalLineItems = await get_coll.lineItems.length;
  // console.log(totalLineItems);
  // const totalPages = Math.ceil(totalLineItems / itemsPerPage);

  const collection = await get_coll.find().toArray();
  res.json({ collection });

});


const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

app.get('/api/suggestions', async (_req, res) => {
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });

  const query = _req.query.query;
  const slctag = _req.query.selectedtag;
  const database = connectToMongoDB.db(convertToSlug(ShopData.data[0].myshopify_domain));

  let get_coll;

  if (_req.query.type == "Orders") {
    get_coll = database.collection("Orders");
  } else if (_req.query.type == "Customer") {
    get_coll = database.collection("Customers");
  } else if (_req.query.type == "Products") {
    const tagExists = await database.collection("Products").countDocuments({ [slctag]: { $exists: true } });
    get_coll = tagExists ? database.collection("Products") : database.collection("Variants");
  }

  console.log(query);
  const escapedQuery = escapeRegExp(query);

  const suggestions = await get_coll.distinct(slctag, {
    [slctag]: { $regex: escapedQuery, $options: 'i' }
  }, { projection: { _id: 0, [slctag]: 1 } });

  res.json({ suggestions: suggestions });
});

// get currency
app.get("/api/GetCurrency", async (_req, res) => {

  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });

  let country_code = ShopData.data[0].country_code;
  let currency = ShopData.data[0].currency;

  res.json({ currency: currency, country_code: country_code });
});

// get column 
app.get("/api/Getcolumn", async (_req, res) => {

  let database = connectToMongoDB.db("test");
  let get_coll = database.collection("Columns");
  const collection = await get_coll.find().toArray();
  res.json({ collection });
});

app.get("/api/getcustomercolumn", async (_req, res) => {

  let database = connectToMongoDB.db("test");
  let get_coll = database.collection("customercolumns");
  const collection = await get_coll.find().toArray();
  res.json({ collection });
});
app.get("/api/getproductcolumn", async (_req, res) => {

  let database = connectToMongoDB.db("test");
  let get_coll = database.collection("productcolumns");
  const collection = await get_coll.find().toArray();
  res.json({ collection });
});
app.get("/api/getvariantcolumn", async (_req, res) => {

  let database = connectToMongoDB.db("test");
  let get_coll = database.collection("variantcolumns");
  const collection = await get_coll.find().toArray();
  res.json({ collection });
});

// Fet fields informations
app.get("/api/Getfieldsinfo", async (_req, res) => {

  let database = connectToMongoDB.db("test");
  let get_coll = database.collection("Allcolumns");
  const collection = await get_coll.find().toArray();
  res.json({ collection });
});

//Get shop templates
app.get("/api/getshoptemplates", async (_req, res) => {
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });
  let dbforpre = connectToMongoDB.db("test");
  let pretemp_coll = dbforpre.collection("Premadetemplates");
  let database = connectToMongoDB.db(convertToSlug(ShopData.data[0].myshopify_domain));
  let get_coll = database.collection("Templates");
  const shoptemp = await get_coll.find().toArray();
  const precollection = await pretemp_coll.find().toArray();
  const collection = [...shoptemp,...precollection]

  res.json({ collection });
  
});

app.get("/api/getpretemplates", async (_req, res) => {
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });

  let database = connectToMongoDB.db("test");
  let get_coll = database.collection("Premadetemplates");
  const collection = await get_coll.find().toArray();


  res.json({ collection });
  
});
app.get("/api/getschedulehistory", async (_req, res) => {
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });

  let database = connectToMongoDB.db(convertToSlug(ShopData.data[0].myshopify_domain));
  let get_coll = database.collection("schedulehistory");
  const collection = await get_coll.find().toArray();


  res.json({ collection });
});

//Get default templates
app.get("/api/gettemplates", async (_req, res) => {
  let database = connectToMongoDB.db("test");
  let get_coll = database.collection("Templates");
  const collection = await get_coll.find().toArray();
  res.json({ collection });
});

app.get("/api/getplans", async (_req, res) => {
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });

  let database = connectToMongoDB.db("test");
  let get_coll = database.collection("newplans");
  let coll = await get_coll.find().toArray();
  const storeplan = ShopData.data[0].plan_name;
  
  const collection = coll.map((obj)=>{
    if((storeplan == "basic" || storeplan == "professional") && obj.store_plan == "basic+professional"  ){
      obj.avail = "true"
    }else if((storeplan == "unlimited" && obj.store_plan == "unlimited"  )){
        obj.avail = "true"
    }else if((storeplan == "shopify_plus" && obj.store_plan == "shopify_plus"  )){
        obj.avail = "true"
    }else if(obj.store_plan == "all"){
        obj.avail = "true"
    }else{
        obj.avail = "false"
    }
    return obj
  })
  res.json({ collection });
});

app.get("/api/getactiveplan", async (_req, res) => {
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });
  console.log(ShopData);
  const session = res.locals.shopify.session
  let database = connectToMongoDB.db("test");
  let get_coll = database.collection("billing_plan");
  const collection = await get_coll.find({shop_name:ShopData.data[0].myshopify_domain}).toArray();
  res.json({ collection });
});

//Get Save Custom reports
app.get("/api/savereport", async (_req, res) => {
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });
  let query = JSON.parse(_req.query.data);

  let database = connectToMongoDB.db( convertToSlug(ShopData.data[0].myshopify_domain));
  let get_coll = database.collection("Templates");
  const AdminQuery = { report_id: query.report_id };
  const Adminresult = await get_coll.findOne(AdminQuery);

  if (!Adminresult) {
    delete query._id;
    get_coll.insertOne(query);
  } else {
    delete query._id;
    get_coll.updateOne({ report_id: query.report_id }, { $set: query });
  }
  res.json("added");
});

//Delete Reports
app.get("/api/deletereport", async (_req, res) => {
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });
  let query = JSON.parse(_req.query.data);

  let database = connectToMongoDB.db(convertToSlug(ShopData.data[0].myshopify_domain));
  let get_coll = database.collection("Templates");
  get_coll.deleteOne({ report_id: query });
  res.json("added");
});

// get collections data
app.get("/api/GetCollections", async (_req, res) => {

  const session = res.locals.shopify.session;
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });



  var email = ShopData.data[0].email;
  var shop_url = ShopData.data[0].myshopify_domain;


  let database = connectToMongoDB.db(convertToSlug(ShopData.data[0].myshopify_domain));
  let get_coll = database.collection("Collections");

  const page = parseInt(_req.query.page) || 1;
  const itemsPerPage = 20;
  const totalOrders = await get_coll.countDocuments();
  const actualLength = (await get_coll.find(query).toArray()).length;
  const totalPages = Math.ceil(actualLength / itemsPerPage);

  const collection = await get_coll.find()
    .skip((Number(page) - 1) * Number(itemsPerPage))
    .limit(Number(itemsPerPage)).toArray();
  res.json({ collection, totalPages, currentPage: page });

});

app.get("/api/Getvariants", async (_req, res) => {
  const session = res.locals.shopify.session;
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });
  var email = ShopData.data[0].email;
  var shop_url = ShopData.data[0].myshopify_domain;
  var name = convertToSlug(ShopData.data[0].myshopify_domain);

  let database = connectToMongoDB.db(name);
  let get_coll = database.collection("Variants");
  let query = JSON.parse(_req.query.datatype);
  const page = parseInt(_req.query.page) || 1;
  const itemsPerPage = 20;
  const totalOrders = await get_coll.countDocuments();
  const actualLength = (await get_coll.find(query).toArray()).length;
  const totalPages = Math.ceil(actualLength / itemsPerPage);
  const collection = await get_coll.find(query)
    .skip((Number(page) - 1) * Number(itemsPerPage))
    .limit(Number(itemsPerPage)).toArray();
  res.json({ collection, totalPages, currentPage: page });
});

// get customers data
app.post("/api/GetCustomers", async (_req, res) => {
  const session = res.locals.shopify.session;
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });
  var email = ShopData.data[0].email;
  var shop_url = ShopData.data[0].myshopify_domain;
  var name = convertToSlug(ShopData.data[0].myshopify_domain);

  let database = connectToMongoDB.db(name);
  let get_coll = database.collection("Customers");
  let query = JSON.parse(_req.body.datatype);
  const page = parseInt(_req.body.page) || 0;

  let columndata = _req.body.columns;
  let activecolumns = _req.body.activeColumns;
  let sorting = _req.body.sorting;
  let currency =_req.body.currency;
  let countryCode =_req.body.countrycode;
  let currencysymbol = _req.body.currencysymbol;
  let pageno = _req.body.currentpage;
  let datatype = _req.body.type;
  let sendemails = _req.body.emails;
  let exportformet = _req.body.exportformet;

  function findKeyByLabel(labelToSearch) {
    for (const section of columndata) {
      for (const item of section.values) {
        if (item.label === labelToSearch) {
          return item;
        }
      }
    }
    return null; // Label not found
  }


  const group_obj = {
    _id: {}
  }

  const merge_obj = {};

  const value_index = []

  let l_sorting_obj = {
    "_id":-1,
  };

 



  activecolumns.forEach((key,i) => {
    const activeitem = findKeyByLabel(key);

      if(sorting.index == activeitem.key){
        l_sorting_obj = {
          [activeitem.key]:sorting.direction == "ascending" ? 1 : -1,
          _id:1
        };
      }

      value_index.push(activeitem.key);

        if(activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
        group_obj["_id"][activeitem.key] = {$toString:"$"+activeitem.key};
        merge_obj[activeitem.key] = "$_id."+activeitem.key;
        }
        if (activeitem.type == "number") {
          group_obj[activeitem.key] = {$sum:{$toDouble:"$"+activeitem.key}};
          merge_obj[activeitem.key] = "$"+activeitem.key;
        }
   
  });

  const updatedquery = {};

  for (const key in query) {
    
    updatedquery[key] = query[key];

}

let aggregatesArray = [];

aggregatesArray = [
  {
    $match: updatedquery
  },
  {
    $group: group_obj
  },
  {
    $sort: l_sorting_obj
  },
  {
    $group: {
      _id: null,
      rows: {
        $push: {
          $map: {
            input: {
              $objectToArray: {
                $mergeObjects: [
                  merge_obj
                ]
              }
            },
            as: 'item',
            in: '$$item.v'
          }
        }
      }
    }
  }
];


if (datatype != "dataexport" && datatype != "schedule_export") {
  aggregatesArray.splice(3, 0, {
    $skip: 300*pageno
  });
  aggregatesArray.splice(4, 0, {
    $limit: 300 
  });
}

  const Arp  = await get_coll.aggregate(aggregatesArray).toArray();  


  let allrows = Arp.length ? Arp[0].rows : [];


  function formatMoney(value, currency, symbol) {
    const formattedValue = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
    }).format(value);
  
    return `${formattedValue}`;
  }

  activecolumns.forEach((key,i) => {

    const activeitem = findKeyByLabel(key);

    if(activeitem.format == "money"){
      const moneyValue = allrows.forEach((key, j) => {
      


        const moneyValueAsNumber = parseFloat(key[i]);

        
        const formattedMoney = formatMoney(moneyValueAsNumber, currency, currencysymbol);

          // console.log(key[i]);
          // console.log(formattedMoney);
           allrows[j][i] = formattedMoney;
        
      }); 
     
    }


  });
 

  if (datatype == "dataexport") {
    const currentTime = new Date();
    currentTime.setSeconds(currentTime.getSeconds() + 20);
    
    const cronPattern = `${currentTime.getSeconds()} ${currentTime.getMinutes()} ${currentTime.getHours()} * * *`;
    cron.schedule(cronPattern, () => {
      if(exportformet == "csv"){
        emailcsv(activecolumns,allrows,"Title",sendemails)
      }else if(exportformet == "excel"){
      emailexcel(activecolumns,allrows,"Title",sendemails)
      }else if(exportformet == "pdf"){
        sendpdf(activecolumns,allrows,"Title",sendemails)
      }
    });
    res.json({ status:"exported"});
  }
  else{
    res.json({ currentPage: pageno, freshdata: convertDateIfValid(allrows), allobj:Arp });
  }


});

// get orders data
// get orders data
app.post("/api/GetOrders", async (_req, res) => {
  try {
  
    const session = res.locals.shopify.session;
    const ShopData = await shopify.api.rest.Shop.all({
      session: res.locals.shopify.session,
    });
  
    let database = connectToMongoDB.db(convertToSlug(ShopData.data[0].myshopify_domain));
    let AdminDatabase = connectToMongoDB.db("test");
    let BillingCollection = AdminDatabase.collection("billing_plan");
    let billing_query = { shop_name: ShopData.data[0].myshopify_domain }
    let Billing = await BillingCollection.findOne(billing_query);
  
    let get_coll =  database.collection("Orders");
  
    const page = parseInt(_req.body.page) || 0;
  
    let query = JSON.parse(_req.body.datatype);
    
    // constant for this call
    let columndata = _req.body.columns;
    let activecolumns = _req.body.activeColumns;
    let sorting = _req.body.sorting;
    let currency =_req.body.currency;
    let countryCode =_req.body.countrycode;
    let currencysymbol = _req.body.currencysymbol;
   

    let datatype = _req.body.type;
    let sendemails = _req.body.emails;
    let exportformet = _req.body.exportformet;

    let lineitemsQuery = query.lineitemsQuery;
    let orderQuery =  query.orderQuery;
    let pageno = _req.body.currentpage;
    var activeobj = [];
    
    function findKeyByLabel(labelToSearch) {
      for (const section of columndata) {
        for (const item of section.values) {
          if (item.label === labelToSearch) {
            return item;
          }
        }
      }
      return null; // Label not found
    }
  
    const group_obj = {
      _id: {}
    }
  
    const merge_obj2 = {};
    const value_index = []
  
    
    const updatedlineitemsquery = {}
    const updatedorderquery = {}
  
  
    let l_sorting_obj = {
      "_id":-1,
    };
  

    for (const key in orderQuery) {
          updatedorderquery["order_obj."+key] = orderQuery[key];
    }
  
    activecolumns.forEach((key,i) => {
      const activeitem = findKeyByLabel(key);


          for (const key in lineitemsQuery) {
            if(key == activeitem.key){
               if (activeitem.type == "String" || activeitem.type == "string") {
                updatedlineitemsquery[key] = lineitemsQuery[key];
               }
            }
          }
  
        
  
        if(sorting.index == activeitem.key){
          
          if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
            l_sorting_obj = {
              ["_id."+activeitem.key]:sorting.direction == "ascending" ? 1 : -1,
              _id:1
            };
          }
          if (activeitem.type == "number") {
            l_sorting_obj = {
              [activeitem.key]:sorting.direction == "ascending" ? 1 : -1,
              _id:1
            };
          }
        }
  
      value_index.push(activeitem.key);
  
      if(activeitem.calltype == "lineitem"){
  
        if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
        group_obj["_id"][activeitem.key] = {$toString:"$"+activeitem.key};
        merge_obj2[activeitem.key] = "$_id."+activeitem.key;
        }
        if (activeitem.type == "number") {
          group_obj[activeitem.key] = {$sum:{$toDouble:"$"+activeitem.key}};
          merge_obj2[activeitem.key] = "$"+activeitem.key;
        }
      }
  
      if(activeitem.calltype == "order"){
  
        if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
          group_obj["_id"][activeitem.key] ={$toString:"$order_obj."+activeitem.key};
          merge_obj2[activeitem.key] = "$_id."+activeitem.key;
          }
          if (activeitem.type == "number") {
            group_obj[activeitem.key] = {$sum:{$toDouble:"$order_obj."+activeitem.key}};
            merge_obj2[activeitem.key] = "$"+activeitem.key;
          }
      }
     
    });
  
  
    let aggregatesArray = [];
 
    console.log("fffffff",updatedorderquery,merge_obj2,l_sorting_obj ,group_obj);
   

      aggregatesArray = [
        {
          $match: {
            __parentId: { $exists: true },
          }
        },
        {
          $match: updatedlineitemsquery
        },
        {
          $match:updatedorderquery
        },
        {
          $group: group_obj
        },
        {
          $sort: l_sorting_obj
        },
        {
          $group: {
            _id: null,
            rows: {
              $push: {
                $map: {
                  input: {
                    $objectToArray: {
                      $mergeObjects: [
                        merge_obj2
                      ]
                    }
                  },
                  as: 'item',
                  in: '$$item.v'
                }
              }
            }
          }
        }
      ]

      if (datatype != "dataexport" && datatype != "schedule_export"){
        aggregatesArray.splice(5, 0, {
          $skip: 300*pageno 
        });
        aggregatesArray.splice(6, 0, {
          $limit: 300
        });
      }
    

    console.log(aggregatesArray);
  
    const Arp  = await get_coll.aggregate(aggregatesArray).toArray();  
    let allrows = Arp.length ? Arp[0].rows : [];


    function formatMoney(value, currency, symbol) {
        const formattedValue = new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: currency,
        }).format(value);
      
        return `${formattedValue}`;
    }

      activecolumns.forEach((key,i) => {

        const activeitem = findKeyByLabel(key);
        if(activeitem.format == "money"){
          const moneyValue = allrows.forEach((key, j) => {
          

            const moneyValueAsNumber = parseFloat(key[i]);

            
            const formattedMoney = formatMoney(moneyValueAsNumber, currency, currencysymbol);

               allrows[j][i] = formattedMoney;
            
          }); 
         
        }
      });

      if (datatype == "dataexport") {
      const currentTime = new Date();
      currentTime.setSeconds(currentTime.getSeconds() + 10);
      
      const cronPattern = `${currentTime.getSeconds()} ${currentTime.getMinutes()} ${currentTime.getHours()} * * *`;
      cron.schedule(cronPattern, () => {
        if(exportformet == "csv"){
          emailcsv(activecolumns,allrows,"Title",sendemails)
        }else if(exportformet == "excel"){
        emailexcel(activecolumns,allrows,"Title",sendemails)
        }else if(exportformet == "pdf"){
          sendpdf(activecolumns,allrows,"Title",sendemails)
        }
      });
      res.json({ status:"exported"});
    }
    else{
      res.json({ currentPage: pageno, freshdata: convertDateIfValid(allrows), allobj:Arp });
    }
      
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  
});



app.post("/api/Getproducts", async (_req, res) => {
  try {
    const session = res.locals.shopify.session;
    const ShopData = await shopify.api.rest.Shop.all({
      session: res.locals.shopify.session,
    });

    const email = ShopData.data[0].email;
    const shop_url = ShopData.data[0].myshopify_domain;
    const name = convertToSlug(ShopData.data[0].myshopify_domain);

    const database = connectToMongoDB.db(name);
    const get_coll = database.collection("Products");
    const get_var = database.collection("Variants");
    
    const query = JSON.parse(_req.body.datatype);
    const page = parseInt(_req.body.page) || 0;

    let columndata = _req.body.columns;
    let activecolumns = _req.body.activeColumns;
    let sorting = _req.body.sorting;
    let currency =_req.body.currency;
    let countryCode =_req.body.countrycode;
    let currencysymbol = _req.body.currencysymbol;
    let pageno = _req.body.currentpage;

    let datatype = _req.body.type;
    let sendemails = _req.body.emails;
    let exportformet = _req.body.exportformet;
    
    var activeobj = [];
    function findKeyByLabel(labelToSearch) {
    for (const section of columndata) {
      for (const item of section.values) {
        if (item.label === labelToSearch) {
          return item;
        }
      }
    }
    return null; // Label not found
    }

  const variantssQuery = query.variantsQuery;
  const productQuery =  query.productQuery;

  const projectobj =  {
    _id:0,
  }

  const group_obj = {
    _id: {}
  }

  const merge_obj = {};
  const value_index = []


  const updatedvariantsquery = {}
  const updatedproductquery = {}

   
      let l_sorting_obj = {
        "_id":-1,
      };

  
  for (const key in productQuery) {
    
  updatedproductquery["product."+key] = productQuery[key];

  }


  activecolumns.forEach((key) => {
    const activeitem = findKeyByLabel(key);

        for (const key in variantssQuery) {
          if(key == activeitem.key){
             if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
              updatedvariantsquery[key] = variantssQuery[key];
             }
          }
        }

        if(sorting.index == activeitem.key){
     
          if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
            l_sorting_obj= {
              ["_id."+activeitem.key] :sorting.direction == "ascending" ? 1 : -1,
              _id:1
            };
          }
          if (activeitem.type == "number") {
            l_sorting_obj = {
              [activeitem.key]:sorting.direction == "ascending" ? 1 : -1,
              _id:1
            };
          }
        }

       value_index.push(activeitem.key);

      if(activeitem.calltype == "variant"){
        // projectobj[activeitem.key] = "$"+activeitem.key;
        // p_projectobj[activeitem.key] = "$parent."+activeitem.key;

        if (activeitem.type == "String" || activeitem.type == "string"  || activeitem.type == "date") {
        group_obj["_id"][activeitem.key] = {$toString:"$"+activeitem.key};
        merge_obj[activeitem.key] = "$_id."+activeitem.key;
        }
        if (activeitem.type == "number") {
          group_obj[activeitem.key] = {$sum:{$toDouble:"$"+activeitem.key}};
          merge_obj[activeitem.key] = "$"+activeitem.key;
        }
        // activeobj.push(findKeyByLabel(key));
      }

      if(activeitem.calltype == "product"){
        // projectobj[activeitem.key] = "$parent."+activeitem.key;
        // p_projectobj[activeitem.key] = "$"+activeitem.key;

        if (activeitem.type == "String" || activeitem.type == "string" || activeitem.type == "date") {
          group_obj["_id"][activeitem.key] = {$toString:"$product."+activeitem.key};
          merge_obj[activeitem.key] = "$_id."+activeitem.key;
          }
          if (activeitem.type == "number") {
            group_obj[activeitem.key] = {$sum:{$toDouble:"$product."+activeitem.key}};
            merge_obj[activeitem.key] = "$"+activeitem.key;
          }

      }
   
  });

  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  let aggregatesArray = [];

  aggregatesArray = [
    {
      $match: updatedvariantsquery
    },
    {
      $match:updatedproductquery
    },
    {
      $group: group_obj
    },
    {
      $sort: l_sorting_obj
    },
    {
      $group: {
        _id: null,
        rows: {
          $push: {
            $map: {
              input: {
                $objectToArray: {
                  $mergeObjects: [
                    merge_obj
                  ]
                }
              },
              as: 'item',
              in: '$$item.v'
            }
          }
        }
      }
    }
  ];

  if (datatype != "dataexport" && datatype != "schedule_export"){
    aggregatesArray.splice(4, 0, {
      $skip: 300*pageno 
    });
    aggregatesArray.splice(5, 0, {
      $limit: 300 
    });
  }

//   if(isObjectEmpty(variantssQuery)) {

   
//     console.log(p_projectobj,p_group_obj,p_updatedproductquery);

//     aggregatesArray = [
//       {
//         $match: updatedvariantsquery
//       },
//       {
//         $sort: psorting_obj1
//       },  
//       {
//         $lookup: {
//           from: "Variants",
//           localField: "id",
//           foreignField: "product_id",
//           as: "parent"
//         }
//       },
//       {
//         $unwind: "$parent"
//       },
//       {
//         $match:p_updatedvariantsquery
//       },
//       {
//         $project: p_projectobj
//       },
//       {
//         $group: p_group_obj
//       },
//       {
//         $sort:psorting_obj2
//       },
//       {
//         $group: {
//           _id: null,
//           rows: {
//             $push: {
//               $map: {
//                 input: {
//                   $objectToArray: {
//                     $mergeObjects: [
//                       merge_obj
//                     ]
//                   }
//                 },
//                 as: 'item',
//                 in: '$$item.v'
//               }
//             }
//           }
//         }
//       }
//     ]

//     if (datatype != "dataexport" && datatype != "schedule_export") {
//       aggregatesArray.splice(2, 0, {
//         $skip: 100*pageno
//       });
//       aggregatesArray.splice(3, 0, {
//         $limit: 100 
//       });
//     }
//  }
//   else{

//     console.log(projectobj,group_obj,updatedvariantsquery,updatedproductquery);
    
//     aggregatesArray = [
//       {
//         $match: updatedvariantsquery
//       },
//       {
//         $lookup: {
//           from: "Products",
//           localField: "product_id",
//           foreignField: "id",
//           as: "parent"
//         }
//       },
//       {
//         $unwind: "$parent"
//       },

//       {
//         $sort: l_sorting_obj
//       },
//       {
//         $match:updatedproductquery
//       },
//       {
//         $project: projectobj
//       },
//       {
//         $group: group_obj
//       },
//       {
//         $sort: psorting_obj2
//       },
//       {
//         $group: {
//           _id: null,
//           rows: {
//             $push: {
//               $map: {
//                 input: {
//                   $objectToArray: {
//                     $mergeObjects: [
//                       merge_obj
//                     ]
//                   }
//                 },
//                 as: 'item',
//                 in: '$$item.v'
//               }
//             }
//           }
//         }
//       }
//     ]

//     if (datatype != "dataexport" && datatype != "schedule_export"){
//       aggregatesArray.splice(1, 0, {
//         $skip: 100*pageno
//       });
//       aggregatesArray.splice(2, 0, {
//         $limit: 100 
//       });
//     }
//   }



console.log(aggregatesArray);
 
  try {
   let Arp = [];
   let allrows = [];
    // if(isObjectEmpty(variantssQuery)) {
      Arp = await get_var.aggregate(aggregatesArray).toArray();
      allrows = Arp.length ? Arp[0].rows : [];
    // }
    // else{
    //   Arp = await get_var.aggregate(aggregatesArray).toArray();
    //   allrows = Arp.length ? Arp[0].rows : [];
    // }

    function formatMoney(value, currency, symbol) {
      const formattedValue = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency,
      }).format(value);
    
      return `${formattedValue}`;
  }

    activecolumns.forEach((key,i) => {

      const activeitem = findKeyByLabel(key);
      if(activeitem.format == "money"){
        const moneyValue = allrows.forEach((key, j) => {
        

          const moneyValueAsNumber = parseFloat(key[i]);

          
          const formattedMoney = formatMoney(moneyValueAsNumber, currency, currencysymbol);

             allrows[j][i] = formattedMoney;
          
        }); 
       
      }
    });
  

    if (datatype == "dataexport") {
      const currentTime = new Date();
      currentTime.setSeconds(currentTime.getSeconds() + 20);
      
      const cronPattern = `${currentTime.getSeconds()} ${currentTime.getMinutes()} ${currentTime.getHours()} * * *`;
      cron.schedule(cronPattern, () => {
        if(exportformet == "csv"){
          emailcsv(activecolumns,allrows,"Title",sendemails)
        }else if(exportformet == "excel"){
        emailexcel(activecolumns,allrows,"Title",sendemails)
        }else if(exportformet == "pdf"){
          sendpdf(activecolumns,allrows,"Title",sendemails)
        }
      });
      res.json({ status:"exported"});
    }
    else{
      res.json({ currentPage: pageno, freshdata: convertDateIfValid(allrows), allobj:Arp });
    }
    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }


  } 
  catch (error) {
      console.error("Error in Getproducts API:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

});

// Save scheduledata 
app.get("/api/saveschedule", async (_req, res) => {
  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });
  let updateddata = {};
  let query = JSON.parse(_req.query.data);

  let database = connectToMongoDB.db(convertToSlug(ShopData.data[0].myshopify_domain));
  let get_coll = database.collection("Schedules");
  const AdminQuery = { sh_id: query.sh_id };
  const Adminresult = await get_coll.findOne(AdminQuery);

  if (!Adminresult) {
    updateddata = get_coll.insertOne(query);
  } else {
    delete query._id;
    updateddata = get_coll.updateOne({ sh_id: query.sh_id }, { $set: query });
  }
  res.json("added");
});

app.get("/api/getschedules", async (_req, res) => {
console.log(shopify.api.rest.Collection)

  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });

  let database = connectToMongoDB.db(convertToSlug(ShopData.data[0].myshopify_domain));
 
  let schedule_col = database.collection("Schedules");
  const data = await schedule_col.find().toArray();

  res.json({ data });
});

app.get("/api/manageschedule", async (_req, res) => {

  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });
  // console.log('Retrieved Shop Data from Shopify API');

  // Connect to MongoDB
  const database = connectToMongoDB.db(convertToSlug(ShopData.data[0].myshopify_domain));
  const globeldb = connectToMongoDB.db("test");


  let schedules = database.collection("Schedules");
  let storeschedules = globeldb.collection("storeschedules");
  let cronExpression;
 
  let query = JSON.parse(_req.query.shdata);
  let timezone = JSON.stringify(query.timezone);

  // const cronTime = moment.tz(`${time[1]}:${time[0]}`, timezone).format('m H * * *');
  
  delete query._id;
  console.log(JSON.stringify(query));

const originalTime = query.time;


function convertMonthTime(originalDate, originalTime, originalTimezone, targetTimezone, targetFormat) {
  // Combine the original date and time into a single string
  const originalDateTimeString = `${originalDate} ${originalTime}`;

  // Convert the original date and time to the target timezone
  const convertedTime = DateTime.fromFormat(originalDateTimeString, 'd HH:mm', { zone: originalTimezone })
    .setZone(targetTimezone);

  // Check if the conversion was successful
  if (!convertedTime.isValid) {
    console.error('Invalid DateTime');
    return null;  // Return some default value or handle the error as needed
  }

  // Format the converted time in the target format
  const formattedTime = convertedTime.toFormat(targetFormat);

  return formattedTime;
}

function convertWeekTime(originalDay, originalTime, originalTimezone, targetTimezone, targetFormat) {
  // Combine the original day and time into a string
  const originalDateTimeString = `${originalDay} ${originalTime}`;

  // Convert the original date and time to the target timezone
  const convertedTime = DateTime.fromFormat(originalDateTimeString, 'EEEE HH:mm', { zone: originalTimezone })
    .setZone(targetTimezone);

  // Format the converted date and time in the target format
  const formattedDateTime = convertedTime.toFormat(targetFormat);

  // Get the converted day in the target timezone
  const convertedDay = convertedTime.toFormat('EEEE');

  return { formattedDateTime, convertedDay };
}

function convertTime(originalTime, originalTimezone, targetTimezone, targetFormat) {
  // Convert the original time to the target timezone
  const convertedTime = DateTime.fromFormat(originalTime, 'HH:mm', { zone: originalTimezone })
    .setZone(targetTimezone);

  // Format the converted time in the target format
  const formattedTime = convertedTime.toFormat(targetFormat);

  return formattedTime;
}


const originalTimee = query.time;
const originalTimezone = query.timezone;
const targetTimezone = 'Asia/Kolkata';
const targetYearlyFormat = 'dd/LL HH:mm';
const targetMonthlyFormat = 'dd';

const Time = convertTime(originalTimee, originalTimezone, targetTimezone, 'HH:mm');


  let time = Time.split(":"); 
  console.log(time);
  if(query.interval == "daily"){
  cronExpression = `${time[1]} ${time[0]} * * *`;
}else if(query.interval == "weekly"){
  
  let { formattedDateTime, convertedDay } = convertWeekTime( `${query.day}`, originalTime, originalTimezone, targetTimezone, 'HH:mm');
  
  console.log(convertedDay);
  console.log(formattedDateTime);
  cronExpression = `${time[1]} ${time[0]} * * ${convertedDay}`;


}else if(query.interval == "monthly"){


  const convertedTime = convertMonthTime(query.date, originalTime, originalTimezone, targetTimezone, targetMonthlyFormat);
  cronExpression = `${time[1]} ${time[0]} ${convertedTime} * *`;
  
}
else if (query.interval == "yearly") {


  const monthNumber = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  }[query.month];

  const convertedTime = convertMonthTime(query.date, originalTime, originalTimezone, targetTimezone, targetMonthlyFormat);
  cronExpression = `${time[1]} ${time[0]} ${convertedTime} ${monthNumber} *`;
}


console.log('Original Time:', cronExpression);

  // Create a new task and set up a cron job
  if (query.status == "active") {

    let newTask = {
      id: query.sh_id,
      status: 'running',
      cronExpression: cronExpression, // Store the cron expression
    };
    
    cron.schedule(newTask.cronExpression, () => {
      Scheduletask(database, query, globeldb , ShopData.data[0].country_code , ShopData.data[0].currency,ShopData )
      },{name:query.sh_id});
      // newTask["cronjob"] = JSON.stringify(cronJob);
      await storeschedules.updateOne(
        { sh_id: query.sh_id },
        {
          $set: {
            cronExpression: cronExpression,
            shop_name: ShopData.data[0].myshopify_domain,
            slug_shop_name:convertToSlug(ShopData.data[0].myshopify_domain),
          }
        }
        ,
        { upsert: true }
      );
      await schedules.updateOne(
        { sh_id: query.sh_id },
        {
          $set: {
            cronExpression: cronExpression,
            shop_name: ShopData.data[0].myshopify_domain,
            slug_shop_name:convertToSlug(ShopData.data[0].myshopify_domain),
          }
        }
        ,
        { upsert: true }
      );
  } else {
    const task = cron.getTasks().get(query.sh_id);
    
    if (task) {
      task.stop();
      await storeschedules.deleteOne({ sh_id: query.sh_id })
      // task.cronJob.stop();
      // task.status = 'stopped';
      // if (task.cronJob) {
      //   task.cronJob.stop();  
      // }
    }
  }
  res.json("added");
});

app.get("/api/downloadfile", async (_req, res) => {

  const ShopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });

  const database = connectToMongoDB.db(convertToSlug(ShopData.data[0].myshopify_domain));
  const globeldb = connectToMongoDB.db("test");

  let query = JSON.parse(_req.query.shdata);
  let formet = JSON.parse(_req.query.formet);

  let file = await convertformet(database, query, globeldb, ShopData.data[0].country_code, ShopData.data[0].currency, formet);
  res.setHeader('Content-Disposition', `attachment; filename=${file}`);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.download(path.resolve(file), file);
});

app.get("/api/deleteschedule", async (_req, res) => {
  try {
    const ShopData = await shopify.api.rest.Shop.all({
      session: res.locals.shopify.session,
    });
    let database = connectToMongoDB.db(convertToSlug(ShopData.data[0].myshopify_domain));
    let query = JSON.parse(_req.query.data);
    const globeldb = connectToMongoDB.db("test");
    let storeschedules = globeldb.collection("storeschedules");
    let get_coll = database.collection("Schedules");
    const deleteQuery = { sh_id: query.sh_id };
    
    const task = cron.getTasks().get(query.sh_id);
    if(task != undefined){
      task.stop();
      await storeschedules.deleteOne({ sh_id: query.sh_id })
    }else{
      await storeschedules.deleteOne({ sh_id: query.sh_id })
    }
    const deleteResult = await get_coll.deleteOne(deleteQuery);

    if (deleteResult.deletedCount === 1) {
      res.json("Deleted successfully");
    } else {
      res.status(404).json("Record not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
});


app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);