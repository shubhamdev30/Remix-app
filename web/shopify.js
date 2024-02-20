import { BillingInterval, LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-04";
import {MongoDBSessionStorage} from '@shopify/shopify-app-session-storage-mongodb';

const DB_PATH = `${process.cwd()}/database.sqlite`;

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const billingConfig = {
  "My Shopify One-Time Charge": {
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    amount: 5.0,
    currencyCode: "USD",
    interval: BillingInterval.OneTime,
  },
};


const shopify = shopifyApp({
  hostName:"https://65.1.162.222",
  apiKey:"b59bd07eca89b42995de6af80ed18ee8",
  apiSecretKey:"33539136459dba5de4e9baa73c96a6d9",
  scopes:"write_products,read_products,read_all_orders,read_orders,write_orders,read_customers,write_customers,read_inventory,write_inventory",
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: undefined, // or replace with billingConfig above to enable example billing
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  // This should be replaced with your preferred storage strategy
  sessionStorage: new MongoDBSessionStorage(
    'mongodb+srv://Admin:eXiT75ji60c2Ic0v@cluster0.y0s4hc4.mongodb.net/?retryWrites=true&w=majority',
    'Sessions',
  ),
});

export default shopify;
