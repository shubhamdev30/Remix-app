import crypto from "crypto";
import getRawBody from "raw-body";
import { stopCronJob } from "./CronManager.js";
import { ConnectDB1, GetMongoDB, MongoDB_Post, UpdateDataToBrevo } from "./db.js";

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

const verifyWebhook = async (req, res, next) => {
// Middleware to verify the webhook
// live
  const CLIENT_SECRET = '51215a6648fd8c75210bfa11d4b182dc';
// kajal testing
 //const CLIENT_SECRET = 'eee03675ab51b43cfb5689483f0dc8ac';
const hmac = req.get('X-Shopify-Hmac-Sha256')
const topic = req.get("x-shopify-topic");
  // Use raw-body to get the body (buffer)
  const body = await getRawBody(req)
  // Create a hash using the body and our key
  const hash = crypto
    .createHmac('sha256', CLIENT_SECRET)
    .update(body, 'utf8', 'hex')
    .digest('base64')
  // Compare our hash to Shopify's hash

  console.log(hash,hmac, topic);
  if (hash === hmac) {
    // It's a match! All good
    if(topic == "customers/data_request"){
      const payload = JSON.parse(body.toString());
      console.log('Phew, it came from Shopify!',topic,payload.shop_domain);
      setTimeout(async () => {
        res.status(200).send('OK');
        }, 0);
    }else if(topic == "customers/redact"){
      const payload = JSON.parse(body.toString());
      console.log('Phew, it came from Shopify!',topic,payload.shop_domain);
      setTimeout(async () => {
        res.status(200).send('OK');
        }, 0);
    }else if(topic == "shop/redact"){
      const payload = JSON.parse(body.toString());
      console.log('Phew, it came from Shopify!',topic,payload.shop_domain);
          setTimeout(async () => {
          res.status(200).send('OK');
          }, 0);
    }else if(topic == "app/uninstalled"){
      const payload = JSON.parse(body.toString());
      console.log(payload);
      console.log('Phew, it came from Shopify!', topic, payload.myshopify_domain);

      let ConnectDatabase = await ConnectDB1();

      let testdb = ConnectDatabase.db("test");
      const plan = {
        shop_name:payload.myshopify_domain,
        status:"cancel",
      }

      const getdata = await GetMongoDB("test", payload.myshopify_domain, "shop_info");
      const shopinfoupdate =JSON.parse(getdata);
      console.log(typeof shopinfoupdate);

      console.log(shopinfoupdate);
      delete shopinfoupdate._id;
      shopinfoupdate.status = 0;
      shopinfoupdate.date = CurrentDate();


       setTimeout(async () => {
        await Promise.all([

        MongoDB_Post("test",plan,"billing_plan",0),
        stopCronJob(testdb, payload.myshopify_domain),
        MongoDB_Post("test",shopinfoupdate,"shop_info"),
        UpdateDataToBrevo(shopinfoupdate),
      
        
        ]);
        res.status(200).send('OK');
      }, 0);
    }
  } else {
    // No match! This request didn't originate from Shopify
    console.log('Danger! Not from Shopify!')
    res.status(401).send('Unauthorized');
  }
};

export default verifyWebhook;