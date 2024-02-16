import { ConnectDB1 } from "../db.js";

export async function FormatCustomers(object, callType, collection, databaseName) {

  

  const dammyformet = {
    "id": "N/A",
    "firstName": "N/A",
    "lastName": "N/A",
    "displayName": "N/A",
    "email": "N/A",
    "state": "N/A",
    "tags": ["N/A"],
    "taxExempt": "N/A",
    "unsubscribeUrl": "N/A",
    "updatedAt": "N/A",
    "validEmailAddress": "N/A",
    "verifiedEmail": "N/A",
    "createdAt": "N/A",
    "phone": "N/A",
    "note": "N/A",
    "numberOfOrders": 0,
    "addresses": [
      {
        "address1": "N/A",
        "address2": "N/A",
        "city": "N/A",
        "company": "N/A",
        "coordinatesValidated": "N/A",
        "country": "N/A",
        "countryCode": "N/A",
        "countryCodeV2": "N/A",
        "firstName": "N/A",
        "id": "N/A",
        "lastName": "N/A",
        "name": "N/A",
        "phone": "N/A",
        "province": "N/A",
        "provinceCode": "N/A",
        "timeZone": "N/A",
        "zip": "N/A"
      }
    ],
    "amountSpent": {
      "amount": 0,
      "currencyCode": "N/A"
    },
    "defaultAddress": {
      "address1": "N/A",
      "address2": "N/A",
      "city": "N/A",
      "company": "N/A",
      "coordinatesValidated": "N/A",
      "country": "N/A",
      "countryCode": "N/A",
      "countryCodeV2": "N/A",
      "firstName": "N/A",
      "lastName": "N/A",
      "name": "N/A",
      "phone": "N/A",
      "province": "N/A",
      "provinceCode": "N/A",
      "timeZone": "N/A",
      "zip": "N/A"
    },
    "canDelete": "N/A",
    "averageOrderAmount":0,
    "acceptsMarketing": "N/A",
    "lastOrder": {
      "createdAt": "N/A",
      "confirmed": "N/A",
      "confirmationNumber": "N/A",
      "closedAt": "N/A",
      "clientIp": "N/A",
      "closed": "N/A",
      "billingAddressMatchesShippingAddress": "N/A",
      "canMarkAsPaid": "N/A",
      "cancelReason": "N/A",
      "cancelledAt": "N/A",
      "capturable": "N/A",
      "canNotifyCustomer": "N/A",
      "currencyCode": "N/A",
      "cartDiscountAmount": 0,
      "cartDiscountAmountSet": 0,
      "totalShippingPrice": 0,
      "totalRefunded": 0,
      "totalDiscounts": 0,
      "taxesIncluded": "N/A",
      "taxExempt": "N/A",
      "billingAddress": {
        "address1": "N/A",
        "address2": "N/A",
        "city": "N/A",
        "company": "N/A",
        "coordinatesValidated": "N/A",
        "country": "N/A",
        "countryCode": "N/A",
        "countryCodeV2": "N/A",
        "firstName": "N/A",
        "lastName": "N/A",
        "name": "N/A",
        "phone": "N/A",
        "province": "N/A",
        "provinceCode": "N/A",
        "timeZone": "N/A",
        "zip": "N/A"
      },

      "currentSubtotalLineItemsQuantity": "N/A",
      "currentTaxLines": [],
      "customerAcceptsMarketing": "N/A",
      "currentTotalWeight": "N/A",
      "displayAddress": {
        "address1": "N/A",
        "address2": "N/A",
        "city": "N/A",
        "company": "N/A",
        "country": "N/A",
        "countryCode": "N/A",
        "countryCodeV2": "N/A",
        "firstName": "N/A",
        "lastName": "N/A",
        "name": "N/A",
        "phone": "N/A",
        "province": "N/A",
        "provinceCode": "N/A",
        "timeZone": "N/A",
        "zip": "N/A"
      },
      "displayFulfillmentStatus": "N/A",
      "displayFinancialStatus": "N/A",
      "disputes": [],
      "fullyPaid": "N/A",
      "hasTimelineComment": "N/A",
      "id": "N/A",
      "landingPageUrl": "N/A",
      "landingPageDisplayText": "N/A",
      "name": "N/A",
      "netPayment": 0,
      "netPaymentSet": {
        "presentmentMoney": {
          "amount": 0
        },
        "shopMoney": {
          "amount": 0
        }
      },
      "note": "N/A",
      "paymentGatewayNames": [
        "N/A"
      ],
      "phone": "N/A",
      "presentmentCurrencyCode": "N/A",
      "processedAt": "N/A",
      "referralCode": "N/A",
      "referrerDisplayText": "N/A",
      "referrerUrl": "N/A",
      "returnStatus": "N/A",
      "restockable": "N/A",
      "requiresShipping": "N/A",
      "registeredSourceUrl": "N/A",
      "riskLevel": "N/A"
    },
    "taxExemptions": [],
    "acceptsMarketingUpdatedAt": "N/A",
    "hasTimelineComment": "N/A"
  }
  const dates = ["createdAt", "updatedAt","acceptsMarketingUpdatedAt","lastOrder_cancelledAt","lastOrder_processedAt", "lastOrder_createdAt"];


    function replaceEmptyElements(obj) {
      for (let key in obj) {
        if (!obj[key]) {
          if(typeof obj[key] == "number"){  obj[key] = "0"; }
          else{ obj[key] = "N/A"; }
        } else if (Array.isArray(obj[key]) && obj[key].length === 0) {
          obj[key] = "N/A";
        } else if (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0) {  
          obj[key] = "N/A";
        } else if (typeof obj[key] === "object") {
          replaceEmptyElements(obj[key]);
        } 
      }
    }
  
    function modifyAndAssign(prefix, source) {
      const modifiedData = {};
      for (const key in source) {
      
        modifiedData[`${prefix}_${key}`] = source[key];
      }
      for (const key in modifiedData) {
          object[key] = modifiedData[key];
        // console.log(`key ${key} ` + `modifiedData ${modifiedData} ` + `object[key] ${object[key]} ` + `  modifiedData[key] ${modifiedData[key]} `);
      }
  
    }


   
    

    // For billing adress 
    if (object["amountSpent"] !== undefined  && object["amountSpent"] !== null) {
      modifyAndAssign("amountSpent", object["amountSpent"]);
    } else {
      modifyAndAssign("amountSpent", dammyformet["amountSpent"]);
    }
    if (object["amountSpent"] !== undefined  && object["amountSpent"] !== null) {
      modifyAndAssign("amountSpent", object["amountSpent"]);
    } else {
      modifyAndAssign("amountSpent", dammyformet["amountSpent"]);
    }
  
    if (object["defaultAddress"] !== undefined && object["defaultAddress"] !== null ) {
      modifyAndAssign("defaultAddress", object["defaultAddress"]);
    } else {
      modifyAndAssign("defaultAddress", dammyformet["defaultAddress"]);
    }
    
    // if (object["lastOrder"] !== undefined && object["lastOrder"] !== null) {
   
    //     modifyAndAssign("lastOrder", object["lastOrder"]);
   
    // } else {
    //   modifyAndAssign("lastOrder", dammyformet["lastOrder"]);
    // }


    
    if (object["averageOrderAmount"] !== undefined && object["averageOrderAmount"] !== null) {
      modifyAndAssign("averageOrderAmount", object["averageOrderAmount"]);
    } else {
      object["averageOrderAmount"] = 0;
    }

    if (object["lastOrder"] !== undefined && object["lastOrder"] !== null) {
      
      const lastOrder = object["lastOrder"];
      
      Object.keys(dammyformet["lastOrder"]).forEach(property => {
          if (!(property in lastOrder)) {
              lastOrder[property] = dammyformet["lastOrder"][property];
          }
      });
  
      modifyAndAssign("lastOrder", lastOrder);
  } else {
    
      modifyAndAssign("lastOrder", dammyformet["lastOrder"]);
  }


    modifyAndAssign("lastOrder_billingAddress", object["lastOrder_billingAddress"]);
    modifyAndAssign("lastOrder_displayAddress", object["lastOrder_displayAddress"]);

      // for transactions
      if(object["transactions"] !== undefined){
        for (let index = 0; index < 3; index++) {
          if(object["transactions"][index] !== undefined){
            object[`transactions_${index}`] = object["transactions"][index];
            modifyAndAssign(`transactions_${index}`, object[`transactions_${index}`]);
            modifyAndAssign(`transactions_${index}_order`, object[`transactions_${index}_order`]);
            modifyAndAssign(`transactions_${index}_order_billingAddress`, object[`transactions_${index}_order_billingAddress`]);
          }else{
            object[`transactions_${index}_amount`] = 0;
            object[`transactions_${index}_id`] = "N/A";
            object[`transactions_${index}_createdAt`] = "N/A";
            object[`transactions_${index}_authorizationCode`] = "N/A";
            object[`transactions_${index}_status`] = "N/A";
            object[`transactions_${index}_paymentId`] = "N/A";
            object[`transactions_${index}_kind`] = "N/A";
          }
        }
      }

      object[`tags`] = object[`tags`].join(', ');
  
    delete object["amountSpent"];
    delete object["defaultAddress"];
    delete object["lastOrder"];
    delete object["lastOrder_billingAddress"];
    delete object["lastOrder_displayAddress"];



    if(object["transactions"] !== undefined){
    object["transactions"].forEach((prop, index) => {
      delete object[`transactions_${index}_order_billingAddress`];
      delete object[`transactions_${index}_order`];
      delete object[`transactions_${index}`];
      delete object[`transactions`];
    });
  }

  dates.forEach(prop => object[prop] && (object[prop] = object[prop]));
  object["id"] = object["id"].split("/").pop()

//   Object.entries(object).forEach((index, value, key) => {
//   console.log(key);
//   });

  replaceEmptyElements(object);

}
