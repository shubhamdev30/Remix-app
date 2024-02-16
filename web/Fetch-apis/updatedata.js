import { ConnectDB1 } from "../db.js";

export async function updatedata(object, callType, collection, databaseName) {

  const dammyformet = {
    "app": {
      "name": "N/A"
    },
    "billingAddressMatchesShippingAddress": "N/A",
    "canMarkAsPaid": "N/A",
    "cancelledAt": "N/A",
    "Month":"N/A",
    "cancelReason": "N/A",
    "cartDiscountAmount": "N/A",
    "clientIp": "N/A",
    "closedAt": "N/A",
    "closed": "N/A",
    "createdAt": "N/A",
    "currencyCode": "N/A",
    "confirmationNumber": "N/A",
    "currentSubtotalLineItemsQuantity": "N/A",
    "currentTotalWeight": "N/A",
    "customerAcceptsMarketing": "N/A",
    "customerLocale": "N/A",
    "discountCode": "N/A",
    "displayFinancialStatus": "N/A",
    "displayFulfillmentStatus": "N/A",
    "discountCodes": ["N/A"],
    "email": "N/A",
    "estimatedTaxes": "N/A",
    "fulfillable": "N/A",
    "fullyPaid": "N/A",
    "hasTimelineComment": "N/A",
    "id": "N/A",
    "landingPageDisplayText": "N/A",
    "landingPageUrl": "N/A",
    "location": "N/A",
    "merchantEditable": "N/A",
    "merchantEditableErrors": ["N/A"],
    "name": "N/A",
    "netPayment": "N/A",
    "note": "N/A",
    "phone": "N/A",
    "presentmentCurrencyCode": "N/A",
    "processedAt": "N/A",
    "referralCode": "N/A",
    "referrerDisplayText": "N/A",
    "referrerUrl": "N/A",
    "refundable": "N/A",
    "restockable": "N/A",
    "returnStatus": "N/A",
    "requiresShipping": "N/A",
    "registeredSourceUrl": "N/A",
    "riskLevel": "N/A",
    "subtotalLineItemsQuantity": "N/A",
    "subtotalPrice": "N/A",
    "tags": "N/A",
    "taxExempt": "N/A",
    "totalPrice": "N/A",
    "totalDiscounts": "N/A",
    "totalRefunded": "N/A",
    "totalShippingPrice": "N/A",
    "totalTax": "N/A",
    "totalWeight": "N/A",
    "unpaid": "N/A",
    "updatedAt": "N/A",
    "additionalFees": ["N/A"],
    "currentTotalAdditionalFeesSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A",
      },
      "shopMoney": {
        "amount": "N/A",

      }
    },

    "currentTotalDiscountsSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A",
      },
      "shopMoney": {
        "amount": "N/A",

      }
    },

    "currentTotalDutiesSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A"
      },
      "shopMoney": {
        "amount": "N/A",

      }
    },

    "currentTotalPriceSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A"
      },
      "shopMoney": {
        "amount": "N/A",

      }
    },

    "currentTotalTaxSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A"
      },
      "shopMoney": {
        "amount": "N/A"

      }
    },

    "originalTotalAdditionalFeesSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A"
      },
      "shopMoney": {
        "amount": "N/A"

      }
    },

    "originalTotalDutiesSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A"
      },
      "shopMoney": {
        "amount": "N/A",

      }
    },

    "originalTotalPriceSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A"
      },
      "shopMoney": {
        "amount": "N/A",

      }
    },

    "totalPriceSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A",
      },
      "shopMoney": {
        "amount": "N/A",

      }
    },

    "totalRefundedSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A"
      },
      "shopMoney": {
        "amount": "N/A",

      }
    },

    "totalRefundedShippingSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A"
      },
      "shopMoney": {
        "amount": "N/A"

      }
    },

    "totalShippingPriceSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A",
      },
      "shopMoney": {
        "amount": "N/A",

      }
    },

    "totalTaxSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A",
      },
      "shopMoney": {
        "amount": "N/A",

      }
    },

    "totalTipReceivedSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A"
      },
      "shopMoney": {
        "amount": "N/A"

      }
    },

    "totalReceivedSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A"
      },
      "shopMoney": {
        "amount": "N/A"

      }
    },

    "totalDiscountsSet": {
      "presentmentMoney": {
        "amount": "N/A",
        "currencyCode": "N/A"
      },
      "shopMoney": {

        "amount": "N/A"

      }
    },
    "shippingAddress": {
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
      "id": "N/A",
      "name": "N/A",
      "phone": "N/A",
      "province": "N/A",
      "provinceCode": "N/A",
      "timeZone": "N/A",
      "zip": "N/A",
      "formattedArea": "N/A",
      "longitude": "N/A",
      "latitude": "N/A"
    },
    "shippingLine": {
      "carrierIdentifier": "N/A",
      "code": "N/A",
      "source": "N/A",
      "shippingRateHandle": "N/A",
      "taxLines": {
        "title": "N/A",
        "ratePercentage": "N/A",
        "rate": "N/A",
        "price": "N/A",
      },
      "requestedFulfillmentService": {
        "callbackUrl": "N/A",
        "fulfillmentOrdersOptIn": "N/A",
        "handle": "N/A",
        "inventoryManagement": "N/A",
        "shippingMethods": {
          "code": "N/A",
          "label": "N/A",
        },
        "type": "N/A",
        "id": "N/A",
      },
      "id": "N/A",
      "deliveryCategory": "N/A",
      "phone": "N/A",
      "price": "N/A"
    },
    "transactions": ["N/A"],
    "fulfillments": ["N/A"],
    "customer": {
      "taxExempt": "N/A",
      "taxExemptions": "N/A",
      "acceptsMarketing": "N/A",
      "averageOrderAmount": 0.00,
      "acceptsMarketingUpdatedAt": "N/A",
      "canDelete": "N/A",
      "createdAt": "N/A",
      "displayName": "N/A",
      "email": "N/A",
      "firstName": "N/A",
      "hasTimelineComment": "N/A",
      "lastName": "N/A",
      "note": "N/A",
      "numberOfOrders": 0,
      "phone": "N/A",
      "state": "N/A",
      "productSubscriberStatus": "N/A",
      "unsubscribeUrl": "N/A",
      "updatedAt": "N/A",
      "validEmailAddress": "N/A",
      "verifiedEmail": "N/A",

      "lastOrder": {
        "name": "N/A",
        "id": "N/A",
        "fullyPaid": "N/A",
        "landingPageDisplayText": "N/A",
        "landingPageUrl": "N/A",
        "returnStatus": "N/A",
        "restockable": "N/A",
        "refundable": "N/A",
        "displayFinancialStatus": "N/A",
        "displayFulfillmentStatus": "N/A",
        "createdAt": "N/A",
        "currentSubtotalLineItemsQuantity": "N/A",
        "fulfillable": "N/A",
        "netPayment": "N/A"
      },
      "acceptsMarketing": "N/A",
      "acceptsMarketingUpdatedAt": "N/A",
      "averageOrderAmount": "N/A",
      "canDelete": "N/A",
      "createdAt": "N/A",
      "displayName": "N/A",
      "email": "N/A",
      "firstName": "N/A",
      "hasTimelineComment": "N/A",
      "id": "N/A",
      "lastName": "N/A",
      "note": "N/A",
      "numberOfOrders": "N/A",
      "phone": "N/A",
      "state": "N/A",
      "productSubscriberStatus": "N/A",
      "tags": "N/A",
      "unsubscribeUrl": "N/A",
      "updatedAt": "N/A",
      "validEmailAddress": "N/A",
      "verifiedEmail": "N/A",
      "addresses": ["N/A"],
      "amountSpent": {
        "amount": "N/A"
      },
      "averageOrderAmountV2": {
        "amount": "N/A"
      },
      "defaultAddress": {
        "address1": "N/A",
        "address2": "N/A",
        "city": "N/A",
        "company": "N/A",
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
    }, "customerJourney": {
      "customerOrderIndex": "N/A",
      "daysToConversion": "N/A",
      "firstVisit": {
        "id": "N/A",
        "landingPage": "N/A",
        "landingPageHtml": "N/A",
        "occurredAt": "N/A",
        "referralCode": "N/A",
        "referralInfoHtml": "N/A",
        "referrerUrl": "N/A",
        "source": "N/A",
        "sourceDescription": "N/A",
        "sourceType": "N/A",
        "utmParameters": "N/A"
      },
      "lastVisit": {
        "id": "N/A",
        "landingPage": "N/A",
        "landingPageHtml": "N/A",
        "occurredAt": "N/A",
        "referralCode": "N/A",
        "referralInfoHtml": "N/A",
        "referrerUrl": "N/A",
        "source": "N/A",
        "sourceDescription": "N/A",
        "sourceType": "N/A",
        "utmParameters": "N/A"
      }
    }

    ,
    "refunds": ["N/A"],
    "shippingAddress": {
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
      "id": "N/A",
      "name": "N/A",
      "phone": "N/A",
      "province": "N/A",
      "provinceCode": "N/A",
      "timeZone": "N/A",
      "zip": "N/A",
      "formattedArea": "N/A",
      "longitude": "N/A",
      "latitude": "N/A"
    },
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
      "id": "N/A",
      "lastName": "N/A",
      "name": "N/A",
      "phone": "N/A",
      "province": "N/A",
      "provinceCode": "N/A",
      "timeZone": "N/A",
      "zip": "N/A",
      "formattedArea": "N/A",
      "longitude": "N/A"
    }
  }


  const dates = ["createdAt", "customer_updatedAt"];
  const pricesets = ["currentTotalAdditionalFeesSet", "currentTotalDiscountsSet", "currentTotalDutiesSet", "currentTotalPriceSet", "currentTotalTaxSet", "originalTotalAdditionalFeesSet", "originalTotalDutiesSet", "originalTotalPriceSet", "totalPriceSet", "totalRefundedSet", "totalRefundedShippingSet", "totalShippingPriceSet", "totalTaxSet", "totalTipReceivedSet", "totalReceivedSet", "totalDiscountsSet"];
  // Replace Empty value with N/A 
  function replaceEmptyElements(obj) {
    for (let key in obj) {
      if (!obj[key]) {
        if (typeof obj[key] == "number") { obj[key] = 0; }
        else { obj[key] = "N/A"; }
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
      if (key == "line_taxLines_0_ratePercentage" ||
        key == "line_taxLines_1_ratePercentage" ||
        key == "line_taxLines_2_ratePercentage" ||
        key == "line_taxLines_3_ratePercentage" ||
        key == "line_taxLines_4_ratePercentage"
      ) {
        object[key] = modifiedData[key].toString();
      } else {
        object[key] = modifiedData[key];
      }

      // console.log(`key ${key} ` + `modifiedData ${modifiedData} ` + `object[key] ${object[key]} ` + `  modifiedData[key] ${modifiedData[key]} `);
    }

  }

  // For billing adress 
  if (object["billingAddress"] !== undefined && object["billingAddress"] !== null) {

    modifyAndAssign("billingAddress", object["billingAddress"]);
  } else {
    object["billingAddress"] = dammyformet.billingAddress;
    modifyAndAssign("billingAddress", object["billingAddress"]);
  }

  // For customer 
  if (object["customer"] !== undefined && object["customer"] !== null) {

    modifyAndAssign("customer", object["customer"]);
  } else {
    object["customer"] = dammyformet.customer;
    modifyAndAssign("customer", object["customer"]);
  }

  // For shipping adress 
  if (object["shippingAddress"] !== undefined && object["shippingAddress"] !== null) {

    modifyAndAssign("shippingAddress", object["shippingAddress"]);
  } else {
    object["shippingAddress"] = dammyformet.shippingAddress;
    modifyAndAssign("shippingAddress", object["shippingAddress"]);
  }

  // For shipping Lines 
  if (object["shippingLine"] !== undefined && object["shippingLine"] !== null) {
    modifyAndAssign("shippingLine", object["shippingLine"]);
  } else {
    object["shippingLine"] = dammyformet.shippingLine;
    modifyAndAssign("shippingLine", object["shippingLine"]);
  }

  // For Tax
  if (!object["__parentId"]) {

    if (object["taxLines"] !== undefined) {
      for (let index = 0; index < 5; index++) {
        if (object["taxLines"][index] !== undefined) {
          object[`taxLines_${index}`] = object["taxLines"][index];
          modifyAndAssign(`taxLines_${index}`, object[`taxLines_${index}`]);
        } else {
          object[`taxLines_${index}_title`] = "N/A";
          object[`taxLines_${index}_price`] = "N/A";
          object[`taxLines_${index}_rate`] = 0.00;
          object[`taxLines_${index}_ratePercentage`] = "N/A";
        }
      }

    }

  }
  else {
    if (object["taxLines"] !== undefined) {
      for (let index = 0; index < 5; index++) {
        if (object["taxLines"][index] !== undefined) {
          object[`line_taxLines_${index}`] = object["taxLines"][index];
          modifyAndAssign(`line_taxLines_${index}`, object[`line_taxLines_${index}`]);
        } else {
          object[`line_taxLines_${index}_title`] = "N/A";
          object[`line_taxLines_${index}_price`] = 0.00;
          object[`line_taxLines_${index}_rate`] = "N/A";
          object[`line_taxLines_${index}_ratePercentage`] = "N/A";
        }
      }

    }
  }

  // for transactions
  if (object["transactions"] !== undefined) {
    for (let index = 0; index < 3; index++) {
      if (object["transactions"][index] !== undefined) {
        object[`transactions_${index}`] = object["transactions"][index];
        modifyAndAssign(`transactions_${index}`, object[`transactions_${index}`]);
        modifyAndAssign(`transactions_${index}_order`, object[`transactions_${index}_order`]);
        modifyAndAssign(`transactions_${index}_order_billingAddress`, object[`transactions_${index}_order_billingAddress`]);
      } else {
        object[`transactions_${index}_amount`] = 0.00;
        object[`transactions_${index}_id`] = "N/A";
        object[`transactions_${index}_createdAt`] = "N/A";
        object[`transactions_${index}_authorizationCode`] = "N/A";
        object[`transactions_${index}_status`] = "N/A";
        object[`transactions_${index}_paymentId`] = "N/A";
        object[`transactions_${index}_kind`] = "N/A";
      }
    }
  }

  // for Fulfillment
  if (object["fulfillments"] !== undefined && object["fulfillments"] !== null) {

    for (let index = 0; index < 3; index++) {

      if (object["fulfillments"][index] !== undefined && object["fulfillments"][index] !== null) {

        object[`fulfillments_${index}`] = object["fulfillments"][index];
        modifyAndAssign(`fulfillments_${index}`, object[`fulfillments_${index}`]);
        modifyAndAssign(`fulfillments_${index}_service`, object[`fulfillments_${index}_service`]);
        modifyAndAssign(`fulfillments_${index}_trackingInfo`, object[`fulfillments_${index}_trackingInfo`]);
        modifyAndAssign(`fulfillments_${index}_service_location`, object[`fulfillments_${index}_service_location`]);
      }

      else {
        object[`fulfillments_${index}_name`] = "N/A";
        object[`fulfillments_${index}_status`] = "N/A";
        object[`fulfillments_${index}_createdAt`] = "N/A";
        object[`fulfillments_${index}_originAddress`] = "N/A";
        object[`fulfillments_${index}_displayStatus`] = "N/A";
        object[`fulfillments_${index}_deliveredAt`] = "N/A";
        object[`fulfillments_${index}_updatedAt`] = "N/A";
        object[`fulfillments_${index}_service_handle`] = "N/A";
        object[`fulfillments_${index}_totalQuantity`] = 0.00;
        object[`fulfillments_${index}_trackingInfo_url`] = "N/A";
      }

    }
  }

  // For Refunds 
  if (object["refunds"] !== undefined) {
    for (let index = 0; index < 1; index++) {
      if (object["refunds"][index] !== undefined) {
        object[`refunds_${index}`] = object["refunds"][index];
        modifyAndAssign(`refunds_${index}`, object[`refunds_${index}`]);
        modifyAndAssign(`refunds_${index}_order`, object[`refunds_${index}_order`]);
        modifyAndAssign(`refunds_${index}_totalRefunded`, object[`refunds_${index}_totalRefunded`]);
      } else {
        object[`refunds_${index}_createdAt`] = "N/A";
        object[`refunds_${index}_order_cancelReason`] = "N/A";
        object[`refunds_${index}_totalRefunded_amount`] = "N/A";
        object[`refunds_${index}_note`] = "N/A";
      }
    }
  }



  // Customer Default Address 
  modifyAndAssign("customer_defaultAddress", object["customer_defaultAddress"]);

  

  // Customer Last Order 
  modifyAndAssign("customer_lastOrder", object["customer_lastOrder"]);
  (object["customer_lastOrder_netPayment"] == "N/A") ? object["customer_lastOrder_netPayment"] = 0.00 : null;

  // Customer amountSpent 
  modifyAndAssign("customer_amountSpent", object["customer_amountSpent"]);
  (object["customer_amountSpent_amount"] == "N/A") ? object["customer_amountSpent_amount"] = 0.00 : null;
  (object["customer_numberOfOrders"] == "N/A") ? object["customer_numberOfOrders"] = 0 : null;
  (object["customer_averageOrderAmount"] == "N/A") ? object["customer_averageOrderAmount"] = 0.00 : null;

  // Customer customer_averageOrderAmountV2 
  modifyAndAssign("customer_averageOrderAmountV2", object["customer_averageOrderAmountV2"]);

  // customer_tags
  // modifyAndAssign("customer_tags", object["customer_tags"]);

  // shippingLine_taxLines 
  modifyAndAssign("shippingLine_taxLines", object["shippingLine_taxLines"]);

  // for shippingLine_requestedFulfillmentService
  modifyAndAssign("shippingLine_requestedFulfillmentService", object["shippingLine_requestedFulfillmentService"]);

  // for shippingMethods
  modifyAndAssign("shippingLine_requestedFulfillmentService_shippingMethods", object["shippingLine_requestedFulfillmentService_shippingMethods"]);

  // For App name
  modifyAndAssign("app", object["app"]);

  // for dates 
  dates.forEach(prop => object[prop] && (object[prop] = object[prop]));

  // for Presentments
  pricesets.forEach(prop => {

    if (object[prop] && object[prop].presentmentMoney && object[prop].presentmentMoney.amount !== undefined) {
      object[`presentment_${prop}`] = object[prop].presentmentMoney.amount;
    }

    if (object[prop] && object[prop].presentmentMoney && object[prop].presentmentMoney.currencyCode !== undefined) {
      object[`presentment_currency_${prop}`] = object[prop].presentmentMoney.currencyCode;
    }

  });

  // for shopmoney 
  pricesets.forEach(prop => {
    if (object[prop] && object[prop].shopMoney && object[prop].shopMoney.amount !== undefined) {
      object[`shopmoney_${prop}`] = object[prop].shopMoney.amount;
    }
  });

  if (!object["__parentId"]) {
    // const orderid = object["id"].split("gid://shopify/Order/");
     object["paymentGatewayNames"] = object[`paymentGatewayNames`].join(', ');
     object["tags"] = object[`tags`].join(', ');

  //2022-12-19T19:10:49Z
  let splitdate = object["processedAt"].split('-');
  let month_val = splitdate[1];

  switch(month_val) {
    case "01":
    object["Month"] = "Jan";
    break;
    case "02":
      object["Month"] = "Feb";
    break;
    case "03":
      object["Month"] = "March";
    break;
    case "04":
      object["Month"] = "April";  
    break;
    case "05":
      object["Month"] = "May"; 
    break;
    case "06":
      object["Month"] = "June"; 
    break;
    case "07":
      object["Month"] = "July"; 
    break;
    case "08":
      object["Month"] = "Aug";
    break;
    case "09":
      object["Month"] = "Sept";  
    break;
    case "10":
      object["Month"] = "Oct";  
    break;
    case "11":
      object["Month"] = "Nov";   
    break;
    case "12":
      object["Month"] = "Dec";   
    break;
    default:
      
  }

  }
  else {
    modifyAndAssign("variant", object["variant"]);
    modifyAndAssign("product", object["product"]);


    if (object["product"] == "N/A" || object["product"] == undefined) {
      object[`product_tags`] = "N/A";
      object[`product_productType`] = "N/A";

    } else {
      object[`product_tags`] = object[`product_tags`].join(', ');
      object[`product_productType`] = "N/A";
    }


    if (object["variant"] == "N/A" || object["variant"] == undefined) {
      object[`variant_compareAtPrice`] = 0.00;
      object[`variant_createdAt`] = "N/A";
      object[`variant_displayName`] = "N/A";
      object[`variant_price`] = 0.00;
      object[`variant_sku`] = "N/A";
      object[`variant_taxCode`] = "N/A";
      object[`variant_title`] = "N/A";
      object[`variant_weight`] = "N/A";
      object[`variant_weightUnit`] = "N/A";
      object[`variant_updatedAt`] = "N/A";
      object[`variant_id`] = "N/A";
    }
    for (let key in object) {
      if (key == "id") {
        object[`lineitem_${key}`] = object["id"];
      }
    }

  }

  var id = object["id"];

  // code for gross sale
  if (object["__parentId"]) {

    var RefundedQty = object["quantity"] - object["currentQuantity"];

    // GROSS SALE
    var gross_sale = parseFloat(parseFloat(object["originalUnitPrice"]) * object["quantity"]).toFixed(2);
    object["grosssale"] = parseFloat(gross_sale) || 0;
    object["discount_percentage"] = (object["totalDiscounts"] / object["finalprice"]) * 100 ?? 0.00;

    var discount_price = object["grosssale"] * (object["discount_percentage"] / 100);

    if(object["title"] == "N/A"){
      object["discount_price"] = 0;
    }
    else{
      object["discount_price"] = "-" + discount_price.toFixed(2) || 0;
    }
      
  
   

    // CALCULATING REFUND DISCOUNT
    var refundDiscount = (parseFloat(object["originalUnitPrice"]) * (object["quantity"] - object["currentQuantity"])) * (object["discount_percentage"] / 100);
    
    // REFUND AFTER DEDUCTING DISCOUNT
    var refunded_amnt = parseFloat(object["originalUnitPrice"]) * (object["quantity"] - object["currentQuantity"]) - refundDiscount;
   
    

    if(object["title"] == "N/A"){
      object["refunded_amnt"] = 0;
    }
    else{
      object["refunded_amnt"] = ("-" + refunded_amnt.toFixed(2)) || 0;
    }


    // NET SALE
    object["netsale"] = parseFloat((parseFloat(object["grosssale"]) - parseFloat(discount_price) - parseFloat(refunded_amnt)).toFixed(2));
 
    // CALCULATING TAX
    var tax = parseFloat(parseFloat(parseFloat(object["line_taxLines_0_ratePercentage"]) / 100) * parseFloat(object["netsale"]).toFixed(2)).toFixed(2);

    object["tax_amount"] = parseFloat(tax) || 0;


    // TOTAL SALES
    if(object["quantity"] != 0){
      object["shipping_price"] = 0.00;
    object["totalsale"] = parseFloat((parseFloat(object["netsale"]) + parseFloat(object["tax_amount"]) + parseFloat(object["shipping_price"])).toFixed(2));

    }

  }

 


  delete object["billingAddress"];
  delete object["shippingAddress"];
  delete object["customer_defaultAddress"];
  delete object["customer_lastOrder"];
  delete object["customer_amountSpent"];
  delete object["customer_averageOrderAmountV2"];
  delete object["customer"];
  delete object["app"];
  delete object["shippingLine"];
  delete object["shippingLine_taxLines"];
  delete object["shippingLine_requestedFulfillmentService"];
  delete object["shippingLine_requestedFulfillmentService_shippingMethods"];

  pricesets.forEach(prop => {
    if (object[prop] && object[prop].shopMoney && object[prop].shopMoney.amount !== undefined && object[prop].presentmentMoney && object[prop].presentmentMoney.amount !== undefined) {
      delete object[prop];
    }
  });

  if (object["fulfillments"] !== undefined) {
    object["fulfillments"].forEach((prop, index) => {
      delete object[`fulfillments_${index}_service_location`];
      delete object[`fulfillments_${index}_trackingInfo`];
      delete object[`fulfillments_${index}_service`];
      delete object[`fulfillments_${index}`];
      delete object[`fulfillments`];
    });
  }

  if (object["refunds"] !== undefined) {
    object["refunds"].forEach((prop, index) => {
      delete object[`refunds_${index}_totalRefunded`];
      delete object[`refunds_${index}_order`];
      delete object[`refunds_${index}`];
      delete object[`refunds`];
    });
  }

  if (object["transactions"] !== undefined) {
    object["transactions"].forEach((prop, index) => {
      delete object[`transactions_${index}_order_billingAddress`];
      delete object[`transactions_${index}_order`];
      delete object[`transactions_${index}`];
      delete object[`transactions`];
    });
  }

  // for taxLines
  if (!object["__parentId"]) {
    if (object["taxLines"] !== undefined) {
      object["taxLines"].forEach((prop, index) => {
        delete object[`taxLines_${index}`];
        delete object[`taxLines`];
      });
    }
  }
  else {

    if (object["taxLines"] !== undefined) {
      object["taxLines"].forEach((prop, index) => {
        delete object[`line_taxLines_${index}`];
        delete object[`taxLines`];
      });
    }

  }

  if (object["__parentId"]) {
    delete object["id"];
    delete object["variant"];
    delete object["product"];
    delete object["name"];

  }

  if (object["customerJourney"] !== undefined && object["customerJourney"] !== null) {
    
    if (object.customerJourney.firstVisit == undefined || object.customerJourney.firstVisit == null) {
      object.customerJourney.firstVisit = dammyformet.customerJourney.firstVisit;
    }
    if (object.customerJourney.lastVisit == undefined || object.customerJourney.lastVisit == null) {
      object.customerJourney.lastVisit = dammyformet.customerJourney.lastVisit;
    }

    if (object.customerJourney.customerOrderIndex !== undefined && object.customerJourney.customerOrderIndex !== null) {
      object["customerJourney_customerOrderIndex"] = object.customerJourney.customerOrderIndex;
    } else {
      object["customerJourney_customerOrderIndex"] = "N/A";
    }

    if (object.customerJourney.daysToConversion !== undefined && object.customerJourney.daysToConversion !== null) {
      object["customerJourney_daysToConversion"] = object.customerJourney.daysToConversion;
    } else {
      object["customerJourney_daysToConversion"] = "N/A";
    }

    if (object.customerJourney.firstVisit.id !== undefined && object.customerJourney.firstVisit.id !== null) {
      object["customerJourney_firstVisit_id"] = object.customerJourney.firstVisit.id;
    } else {
      object["customerJourney_firstVisit_id"] = "N/A";
    }

    if (object.customerJourney.firstVisit.landingPage !== undefined && object.customerJourney.firstVisit.landingPage !== null) {
      object["customerJourney_firstVisit_landingPage"] = object.customerJourney.firstVisit.landingPage;
    } else {
      object["customerJourney_firstVisit_landingPage"] = "N/A";
    }
    if (object.customerJourney.firstVisit.landingPageHtml !== undefined && object.customerJourney.firstVisit.landingPageHtml !== null) {
      object["customerJourney_firstVisit_landingPageHtml"] = object.customerJourney.firstVisit.landingPageHtml;
    } else {
      object["customerJourney_firstVisit_landingPageHtml"] = "N/A";
    }
    if (object.customerJourney.firstVisit.occurredAt !== undefined && object.customerJourney.firstVisit.occurredAt !== null) {
      object["customerJourney_firstVisit_referralCode"] = object.customerJourney.firstVisit.occurredAt;
    } else {
      object["customerJourney_firstVisit_referralCode"] = "N/A";
    }
    if (object.customerJourney.firstVisit.referrerUrl !== undefined && object.customerJourney.firstVisit.referrerUrl !== null) {
      object["customerJourney_firstVisit_referrerUrl"] = object.customerJourney.firstVisit.referrerUrl;
    } else {
      object["customerJourney_firstVisit_referrerUrl"] = "N/A";
    }
    if (object.customerJourney.firstVisit.referralInfoHtml !== undefined && object.customerJourney.firstVisit.referralInfoHtml !== null) {
      object["customerJourney_firstVisit_referralInfoHtml"] = object.customerJourney.firstVisit.referralInfoHtml;
    } else {
      object["customerJourney_firstVisit_referralInfoHtml"] = "N/A";
    }

    if (object.customerJourney.firstVisit.source !== undefined && object.customerJourney.firstVisit.source !== null) {
      object["customerJourney_firstVisit_source"] = object.customerJourney.firstVisit.source;
    } else {
      object["customerJourney_firstVisit_source"] = "N/A";
    }
    if (object.customerJourney.firstVisit.sourceDescription !== undefined && object.customerJourney.firstVisit.sourceDescription !== null) {
      object["customerJourney_firstVisit_sourceDescription"] = object.customerJourney.firstVisit.sourceDescription;
    } else {
      object["customerJourney_firstVisit_sourceDescription"] = "N/A";
    }
    if (object.customerJourney.firstVisit.sourceType !== undefined && object.customerJourney.firstVisit.sourceType !== null) {
      object["customerJourney_firstVisit_sourceType"] = object.customerJourney.firstVisit.sourceType;
    } else {
      object["customerJourney_firstVisit_sourceType"] = "N/A";
    }

    if (object.customerJourney.firstVisit.sourceType !== undefined && object.customerJourney.firstVisit.sourceType !== null) {
      object["customerJourney_firstVisit_sourceType"] = object.customerJourney.firstVisit.sourceType;
    } else {
      object["customerJourney_firstVisit_sourceType"] = "N/A";
    }
    if (object.customerJourney.firstVisit.utmParameters !== null && object.customerJourney.firstVisit.utmParameters !== undefined) {
      if (object.customerJourney.firstVisit.utmParameters.content !== undefined && object.customerJourney.firstVisit.utmParameters.content !== null) {
        object["customerJourney_firstVisit_utmParameters_content"] = object.customerJourney.firstVisit.utmParameters.content;
      } else {
        object["customerJourney_firstVisit_utmParameters_content"] = "N/A";
      }

      if (object.customerJourney.firstVisit.utmParameters.source !== undefined && object.customerJourney.firstVisit.utmParameters.source !== null) {
        object["customerJourney_firstVisit_utmParameters_source"] = object.customerJourney.firstVisit.utmParameters.source;
      } else {
        object["customerJourney_firstVisit_utmParameters_source"] = "N/A";
      }

      if (object.customerJourney.firstVisit.utmParameters.term !== undefined && object.customerJourney.firstVisit.utmParameters.term !== null) {
        object["customerJourney_firstVisit_utmParameters_term"] = object.customerJourney.firstVisit.utmParameters.term;
      } else {
        object["customerJourney_firstVisit_utmParameters_term"] = "N/A";
      }

      if (object.customerJourney.firstVisit.utmParameters.medium !== undefined && object.customerJourney.firstVisit.utmParameters.medium !== null) {
        object["customerJourney_firstVisit_utmParameters_medium"] = object.customerJourney.firstVisit.utmParameters.medium;
      } else {
        object["customerJourney_firstVisit_utmParameters_medium"] = "N/A";
      }

      if (object.customerJourney.firstVisit.utmParameters.campaign !== undefined && object.customerJourney.firstVisit.utmParameters.campaign !== null) {
        object["customerJourney_firstVisit_utmParameters_campaign"] = object.customerJourney.firstVisit.utmParameters.campaign;
      } else {
        object["customerJourney_firstVisit_utmParameters_campaign"] = "N/A";
      }
    } else {
      object["customerJourney_firstVisit_utmParameters_term"] = "N/A";
      object["customerJourney_firstVisit_utmParameters_medium"] = "N/A";
      object["customerJourney_firstVisit_utmParameters_campaign"] = "N/A";
      object["customerJourney_firstVisit_utmParameters_content"] = "N/A";
      object["customerJourney_firstVisit_utmParameters_source"] = "N/A";
    }

    if (object.customerJourney.lastVisit.id !== undefined && object.customerJourney.lastVisit.id !== null) {
      object["customerJourney_lastVisit_id"] = object.customerJourney.lastVisit.id;
    } else {
      object["customerJourney_lastVisit_id"] = "N/A";
    }

    if (object.customerJourney.lastVisit.landingPage !== undefined && object.customerJourney.lastVisit.landingPage !== null) {
      object["customerJourney_lastVisit_landingPage"] = object.customerJourney.lastVisit.landingPage;
    } else {
      object["customerJourney_lastVisit_landingPage"] = "N/A";
    }

    if (object.customerJourney.lastVisit.landingPageHtml !== undefined && object.customerJourney.lastVisit.landingPageHtml !== null) {
      object["customerJourney_lastVisit_landingPageHtml"] = object.customerJourney.lastVisit.landingPageHtml;
    } else {
      object["customerJourney_lastVisit_landingPageHtml"] = "N/A";
    }

    if (object.customerJourney.lastVisit.occurredAt !== undefined && object.customerJourney.lastVisit.occurredAt !== null) {
      object["customerJourney_lastVisit_occurredAt"] = object.customerJourney.lastVisit.occurredAt;
    } else {
      object["customerJourney_lastVisit_occurredAt"] = "N/A";
    }

    if (object.customerJourney.lastVisit.referralCode !== undefined && object.customerJourney.lastVisit.referralCode !== null) {
      object["customerJourney_lastVisit_referralCode"] = object.customerJourney.lastVisit.referralCode;
    } else {
      object["customerJourney_lastVisit_referralCode"] = "N/A";
    }

    if (object.customerJourney.lastVisit.referralInfoHtml !== undefined && object.customerJourney.lastVisit.referralInfoHtml !== null) {
      object["customerJourney_lastVisit_referralInfoHtml"] = object.customerJourney.lastVisit.referralInfoHtml;
    } else {
      object["customerJourney_lastVisit_referralInfoHtml"] = "N/A";
    }

    if (object.customerJourney.lastVisit.referrerUrl !== undefined && object.customerJourney.lastVisit.referrerUrl !== null) {
      object["customerJourney_lastVisit_referrerUrl"] = object.customerJourney.lastVisit.referrerUrl;
    } else {
      object["customerJourney_lastVisit_referrerUrl"] = "N/A";
    }

    if (object.customerJourney.lastVisit.source !== undefined && object.customerJourney.lastVisit.source !== null) {
      object["customerJourney_lastVisit_source"] = object.customerJourney.lastVisit.source;
    } else {
      object["customerJourney_lastVisit_source"] = "N/A";
    }

    if (object.customerJourney.lastVisit.sourceDescription !== undefined && object.customerJourney.lastVisit.sourceDescription !== null) {
      object["customerJourney_lastVisit_sourceDescription"] = object.customerJourney.lastVisit.sourceDescription;
    } else {
      object["customerJourney_lastVisit_sourceDescription"] = "N/A";
    }

    if (object.customerJourney.lastVisit.sourceType !== undefined && object.customerJourney.lastVisit.sourceType !== null) {
      object["customerJourney_lastVisit_sourceType"] = object.customerJourney.lastVisit.sourceType;
    } else {
      object["customerJourney_lastVisit_sourceType"] = "N/A";
    }
    if (object.customerJourney.lastVisit.utmParameters !== undefined && object.customerJourney.lastVisit.utmParameters !== null) {

      if (object.customerJourney.lastVisit.utmParameters.content !== undefined && object.customerJourney.lastVisit.utmParameters.content !== null) {
        object["customerJourney_lastVisit_utmParameters_content"] = object.customerJourney.lastVisit.utmParameters.content;
      } else {
        object["customerJourney_lastVisit_utmParameters_content"] = "N/A";
      }

      if (object.customerJourney.lastVisit.utmParameters.source !== undefined && object.customerJourney.lastVisit.utmParameters.source !== null) {
        object["customerJourney_lastVisit_utmParameters_source"] = object.customerJourney.lastVisit.utmParameters.source;
      } else {
        object["customerJourney_lastVisit_utmParameters_source"] = "N/A";
      }

      if (object.customerJourney.lastVisit.utmParameters.term !== undefined && object.customerJourney.lastVisit.utmParameters.term !== null) {
        object["customerJourney_lastVisit_utmParameters_term"] = object.customerJourney.lastVisit.utmParameters.term;
      } else {
        object["customerJourney_lastVisit_utmParameters_term"] = "N/A";
      }

      if (object.customerJourney.lastVisit.utmParameters.medium !== undefined && object.customerJourney.lastVisit.utmParameters.medium !== null) {
        object["customerJourney_lastVisit_utmParameters_medium"] = object.customerJourney.lastVisit.utmParameters.medium;
      } else {
        object["customerJourney_lastVisit_utmParameters_medium"] = "N/A";
      }

      if (object.customerJourney.lastVisit.utmParameters.campaign !== undefined && object.customerJourney.lastVisit.utmParameters.campaign !== null) {
        object["customerJourney_lastVisit_utmParameters_campaign"] = object.customerJourney.lastVisit.utmParameters.campaign;
      } else {
        object["customerJourney_lastVisit_utmParameters_campaign"] = "N/A";
      }
    } else {
      object["customerJourney_lastVisit_utmParameters_term"] = "N/A";
      object["customerJourney_lastVisit_utmParameters_medium"] = "N/A";
      object["customerJourney_lastVisit_utmParameters_source"] = "N/A";
      object["customerJourney_lastVisit_utmParameters_content"] = "N/A";

      object["customerJourney_lastVisit_utmParameters_campaign"] = "N/A";

    }



  } 
  else {
    object["customerJourney_customerOrderIndex"] = "N/A"
    object["customerJourney_daysToConversion"] = "N/A"
    object["customerJourney_firstVisit_id"] = "N/A"
    object["customerJourney_firstVisit_landingPage"] = "N/A"
    object["customerJourney_firstVisit_landingPageHtml"] = "N/A"
    object["customerJourney_firstVisit_occurredAt"] = "N/A"
    object["customerJourney_firstVisit_referralCode"] = "N/A"
    object["customerJourney_firstVisit_referralInfoHtml"] = "N/A"
    object["customerJourney_firstVisit_referrerUrl"] = "N/A"
    object["customerJourney_firstVisit_source"] = "N/A"
    object["customerJourney_firstVisit_sourceDescription"] = "N/A"
    object["customerJourney_firstVisit_sourceType"] = "N/A"
    object["customerJourney_firstVisit_utmParameters_content"] = "N/A";
    object["customerJourney_firstVisit_utmParameters_source"] = "N/A";
    object["customerJourney_firstVisit_utmParameters_term"] = "N/A";
    object["customerJourney_firstVisit_utmParameters_medium"] = "N/A";
    object["customerJourney_firstVisit_utmParameters_campaign"] = "N/A"
    object["customerJourney_lastVisit_id"] = "N/A"
    object["customerJourney_lastVisit_landingPage"] = "N/A"
    object["customerJourney_lastVisit_landingPageHtml"] = "N/A"
    object["customerJourney_lastVisit_occurredAt"] = "N/A"
    object["customerJourney_lastVisit_referralCode"] = "N/A"
    object["customerJourney_lastVisit_referralInfoHtml"] = "N/A"
    object["customerJourney_lastVisit_referrerUrl"] = "N/A"
    object["customerJourney_lastVisit_source"] = "N/A"
    object["customerJourney_lastVisit_sourceDescription"] = "N/A"
    object["customerJourney_lastVisit_sourceType"] = "N/A"
    object["customerJourney_lastVisit_utmParameters_content"] = "N/A";
    object["customerJourney_lastVisit_utmParameters_source"] = "N/A";
    object["customerJourney_lastVisit_utmParameters_term"] = "N/A";
    object["customerJourney_lastVisit_utmParameters_medium"] = "N/A";
    object["customerJourney_lastVisit_utmParameters_campaign"] = "N/A"
  }

  if (object["customer_tags"] == undefined || object["customer_tags"] == "N/A") {
    object["customer_tags"] = "N/A";
  } else {
    if( object["customer_tags"].length == 1 ){
    object["customer_tags"] = object["customer_tags"][0];
    }else if(Array.isArray(object["customer_tags"])){
      object["customer_tags"] = object["customer_tags"].join(', ');
    }else{
  
      object["customer_tags"] = object["customer_tags"];
    }
  }
  
  if (object["tags"] == undefined || object["tags"] == "N/A") {
    object["tags"] = "N/A";
  } else {
    if( object["tags"].length == 1 ){
    object["tags"] = object["tags"][0];
    }else if(Array.isArray(object["tags"])){
      object["tags"] = object["tags"].join(', ');
    }else{
   
      object["tags"] = object["tags"];
    }
  }
  if (object["discountCodes"] == undefined || object["discountCodes"] == "N/A") {
    object["discountCodes"] = "N/A";
  } else {
    if( object["discountCodes"].length == 1 ){
    object["discountCodes"] = object["discountCodes"][0];
    }else if(Array.isArray(object["discountCodes"])){
      object["discountCodes"] = object["discountCodes"].join(', ');
    }else{
    
      object["discountCodes"] = object["discountCodes"];
    }
  }
  if((object["channel"] != undefined && object["channel"] != "N/A")){
   object["channel"]=object["channel"].name;
  }
  
  delete object["customerJourney"]
  replaceEmptyElements(object);

}
