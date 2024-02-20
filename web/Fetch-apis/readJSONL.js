import readline from 'readline';
import axios from "axios";
import { PostData } from "./PostData.js";
import { updatedata } from './updatedata.js';
import { FormatLineItems } from './FormatLineItems.js';
import { FormatCustomers } from './FormatCustomers.js';
import { FormatProducts } from './format-products.js';
import { FormatVariant } from './FormatVariant.js';
import { FormatCollections } from './FormatCollections.js';
import { ConnectDB1 } from '../db.js';

export async function readJSONLFileFromURL(url, session, callType, collection, databaseName, plan) {

  try {

    let jso = [];

    const response = await axios.get(url, { responseType: 'stream' });

    const rl = readline.createInterface({
      input: response.data,
      crlfDelay: Infinity
    });
  let ordercount = 0;
    rl.on('line', (line) => {

      const json = JSON.parse(line);
      // Process each line (JSON object) as needed
      if(callType == "Orders"){

        if(plan == "free"){
          if(ordercount >= 501){
            return true;
           }
           else{
   
             if(!json.__parentId){
              
               if(ordercount < 501){
                 ordercount++;
                 jso.push(json);
               }
              
             }else{
               jso.push(json);
             }
           }
        } else{
        jso.push(json);
      }
       

      }
      else{
        jso.push(json);
      }

     

    });

    rl.on('close', async () => {
      // Completed reading the file
      console.log('Finished reading JSONL file.');
      // Modify keys in each object

      function extractLastNumberFromId(idString){
        const idParts = idString.split('/');
        var idString = parseInt(idParts[idParts.length - 1]).toString();

        return idString;
      }

      if (callType == "Orders") {
        const lineItemsByParentId = {};
        const lineItemsByOrderId = {};


        // Find all main orders
        const mainOrders = jso.filter(item => !item.__parentId);

        // Iterate through each main order and copy createdAt to line items
        mainOrders.forEach(mainOrder => {
          const createdAtValue = mainOrder.processedAt;

          jso.forEach(item => {
            if (item.__parentId === mainOrder.id) {
              item.processedAt = createdAtValue;
              item.order_obj = mainOrder;
            }
          });
        });
      


        jso.forEach(item => {
          if (item.__parentId) {

          const parentidd = extractLastNumberFromId(item.__parentId);

            if (!lineItemsByParentId[parentidd]) {
              lineItemsByParentId[parentidd] = [];
            }
            lineItemsByParentId[parentidd].push(item);
          }

        });

        jso.forEach((order) => {


           const orderid = extractLastNumberFromId(order.id);
           if(order.__parentId){
            const parentid = extractLastNumberFromId(order.__parentId);
            order.__parentId = parentid;
           }
           order.id = orderid;
          
           order.check = parseFloat(order.subtotalPrice) + parseFloat(order.totalDiscounts);

           if(!order.__parentId){
           const totalShippingPricee = order.totalShippingPrice;
          const newLineItem = {
            "variantTitle": "N/A",
            "vendor": "N/A",
            "canRestock": "N/A",
            "currentQuantity": 0,
            "discountedTotal": "0",
            "fulfillableQuantity": 0,
            "fulfillmentStatus": "N/A",
            "merchantEditable": "N/A",
            "nonFulfillableQuantity":0,
            "originalTotal": 0,
            "originalUnitPrice": 0,
            "quantity": 0,
            "refundableQuantity": 0,
            "requiresShipping": "N/A",
            "restockable": "N/A",
            "sku": "N/A",
            "taxable": "N/A",
            "title": "N/A",
            "totalDiscount": "0",
            "unfulfilledDiscountedTotal": "0",
            "unfulfilledOriginalTotal": "0",
            "unfulfilledQuantity":0,
            "__parentId": order.id,
            "createdAt": order.createdAt,
            "processedAt":order.processedAt,
            "order_obj":order,
            "check":0,
            "totalDiscounts": "0",
            "billingAddress_address1": "N/A",
            "billingAddress_address2": "N/A",
            "billingAddress_city": "N/A",
            "billingAddress_company": "N/A",
            "billingAddress_coordinatesValidated": "N/A",
            "billingAddress_country": "N/A",
            "billingAddress_countryCode": "N/A",
            "billingAddress_countryCodeV2": "N/A",
            "billingAddress_firstName": "N/A",
            "billingAddress_id": "N/A",
            "billingAddress_lastName": "N/A",
            "billingAddress_name": "N/A",
            "billingAddress_phone": "N/A",
            "billingAddress_province": "N/A",
            "billingAddress_provinceCode": "N/A",
            "billingAddress_timeZone": "N/A",
            "billingAddress_zip": "N/A",
            "billingAddress_formattedArea": "N/A",
            "billingAddress_longitude": "N/A",
            "customer_taxExempt": "N/A",
            "customer_taxExemptions": "N/A",
            "customer_acceptsMarketing": "N/A",
            "customer_acceptsMarketingUpdatedAt": "N/A",
            "customer_averageOrderAmount": "N/A",
            "customer_canDelete": "N/A",
            "customer_createdAt": "N/A",
            "customer_displayName": "N/A",
            "customer_email": "N/A",
            "customer_firstName": "N/A",
            "customer_hasTimelineComment": "N/A",
            "customer_id": "N/A",
            "customer_lastName": "N/A",
            "customer_note": "N/A",
            "customer_numberOfOrders": "N/A",
            "customer_phone": "N/A",
            "customer_state": "N/A",
            "customer_productSubscriberStatus": "N/A",
            "customer_unsubscribeUrl": "N/A",
            "customer_updatedAt": "N/A",
            "customer_validEmailAddress": "N/A",
            "customer_verifiedEmail": "N/A",
            "customer_addresses": [
                "N/A"
            ],
            "shippingAddress_address1": "N/A",
            "shippingAddress_address2": "N/A",
            "shippingAddress_city": "N/A",
            "shippingAddress_company": "N/A",
            "shippingAddress_coordinatesValidated": "N/A",
            "shippingAddress_country": "N/A",
            "shippingAddress_countryCode": "N/A",
            "shippingAddress_countryCodeV2": "N/A",
            "shippingAddress_firstName": "N/A",
            "shippingAddress_lastName": "N/A",
            "shippingAddress_id": "N/A",
            "shippingAddress_name": "N/A",
            "shippingAddress_phone": "N/A",
            "shippingAddress_province": "N/A",
            "shippingAddress_provinceCode": "N/A",
            "shippingAddress_timeZone": "N/A",
            "shippingAddress_zip": "N/A",
            "shippingAddress_formattedArea": "N/A",
            "shippingAddress_longitude": "N/A",
            "shippingAddress_latitude": "N/A",
            "shippingLine_carrierIdentifier": "N/A",
            "shippingLine_code": "N/A",
            "shippingLine_source": "N/A",
            "shippingLine_shippingRateHandle": "N/A",
            "shippingLine_id": "N/A",
            "shippingLine_deliveryCategory": "N/A",
            "shippingLine_phone": "N/A",
            "shippingLine_price": "N/A",
            "line_taxLines_0_price": 0.00,
            "line_taxLines_0_rate": 0,
            "line_taxLines_0_ratePercentage": "0",
            "line_taxLines_0_title": "N/A",
            "line_taxLines_1_title": "N/A",
            "line_taxLines_1_price": 0.00,
            "line_taxLines_1_rate": "N/A",
            "line_taxLines_1_ratePercentage": "N/A",
            "line_taxLines_2_title": "N/A",
            "line_taxLines_2_price": 0.00,
            "line_taxLines_2_rate": "N/A",
            "line_taxLines_2_ratePercentage": "N/A",
            "line_taxLines_3_title": "N/A",
            "line_taxLines_3_price": 0.00,
            "line_taxLines_3_rate": "N/A",
            "line_taxLines_3_ratePercentage": "N/A",
            "line_taxLines_4_title": "N/A",
            "line_taxLines_4_price": 0.00,
            "line_taxLines_4_rate": "N/A",
            "line_taxLines_4_ratePercentage": "N/A",
            "customer_defaultAddress_address1": "N/A",
            "customer_defaultAddress_address2": "N/A",
            "customer_defaultAddress_city": "N/A",
            "customer_defaultAddress_company": "N/A",
            "customer_defaultAddress_country": "N/A",
            "customer_defaultAddress_countryCode": "N/A",
            "customer_defaultAddress_countryCodeV2": "N/A",
            "customer_defaultAddress_firstName": "N/A",
            "customer_defaultAddress_id": "N/A",
            "customer_defaultAddress_lastName": "N/A",
            "customer_defaultAddress_name": "N/A",
            "customer_defaultAddress_phone": "N/A",
            "customer_defaultAddress_province": "N/A",
            "customer_defaultAddress_provinceCode": "N/A",
            "customer_defaultAddress_timeZone": "N/A",
            "customer_defaultAddress_zip": "N/A",
            "customer_lastOrder_name": "N/A",
            "customer_lastOrder_id": "N/A",
            "customer_lastOrder_fullyPaid": "N/A",
            "customer_lastOrder_landingPageDisplayText": "N/A",
            "customer_lastOrder_landingPageUrl": "N/A",
            "customer_lastOrder_returnStatus": "N/A",
            "customer_lastOrder_restockable": "N/A",
            "customer_lastOrder_refundable": "N/A",
            "customer_lastOrder_displayFinancialStatus": "N/A",
            "customer_lastOrder_displayFulfillmentStatus": "N/A",
            "customer_lastOrder_createdAt": "N/A",
            "customer_lastOrder_currentSubtotalLineItemsQuantity": "N/A",
            "customer_lastOrder_fulfillable": "N/A",
            "customer_lastOrder_netPayment": "N/A",
            "customer_amountSpent_amount": 0.00,
            "customer_averageOrderAmountV2_amount": "N/A",
            "shippingLine_taxLines_title": "N/A",
            "shippingLine_taxLines_ratePercentage": "N/A",
            "shippingLine_taxLines_rate": "N/A",
            "shippingLine_taxLines_price": "N/A",
            "shippingLine_requestedFulfillmentService_callbackUrl": "N/A",
            "shippingLine_requestedFulfillmentService_fulfillmentOrdersOptIn": "N/A",
            "shippingLine_requestedFulfillmentService_handle": "N/A",
            "shippingLine_requestedFulfillmentService_inventoryManagement": "N/A",
            "shippingLine_requestedFulfillmentService_type": "N/A",
            "shippingLine_requestedFulfillmentService_id": "N/A",
            "shippingLine_requestedFulfillmentService_shippingMethods_code": "N/A",
            "shippingLine_requestedFulfillmentService_shippingMethods_label": "N/A",
            "variant_compareAtPrice": 0.00,
            "variant_createdAt": "N/A",
            "variant_displayName": "N/A",
            "variant_price": 0.00,
            "variant_sku": "N/A",
            "variant_taxCode": "N/A",
            "variant_title": "N/A",
            "variant_weight":0,
            "variant_weightUnit": "KILOGRN/AAMS",
            "variant_updatedAt": "N/A",
            "variant_requiresShipping": "N/A",
            "variant_position":0,
            "variant_barcode": "N/A",
            "variant_id": "N/A",
            "lineitem_id": "N/A",
            "grosssale": 0,
            "discount_percentage":0,
            "discount_price": 0,
            "refunded_amnt":0,
            "netsale": 0,
            "tax_amount": 0,
            "shipping_price":totalShippingPricee,
            "totalsale":order.totalShippingPrice
           };
    
       
        if (order.totalShippingPrice != 0.00) {
          console.log(order.totalShippingPrice);
           jso.push(newLineItem);
           if (lineItemsByParentId[order.id]) {
             lineItemsByParentId[order.id].push(newLineItem);
           }
        }

          const lineItems = lineItemsByParentId[order.id];
          // console.log(lineItems);
          if (lineItems && lineItems.length > 0) {
            const totalDiscounts = order.totalDiscounts;
            const subtotal = order.subtotalPrice;
            const totalShippingPrice = order.totalShippingPrice;
    
            lineItems.forEach(lineItem => {
               
              
              if(lineItem.quantity == 0){

              } else{
                lineItem.check = parseFloat(order.subtotalPrice) + parseFloat(order.totalDiscounts);
                lineItem.finalprice = parseFloat(order.subtotalPrice) + parseFloat(order.totalDiscounts);
              }
              lineItem.totalDiscounts = totalDiscounts;
              lineItem.totalShippingPrice = totalShippingPrice;
              lineItem.shipping_price = totalShippingPrice;
              
             
            });
          }
          }
        });
      
      
      for (const obj of jso) {
           if(obj["check"] != undefined){
            updatedata(obj, callType, collection, databaseName);
           }
        }
      }


      if (callType == "Customers") {
        for (const obj of jso) {
          FormatCustomers(obj, callType, collection, databaseName);
        }
      }
      if (callType == "Variants") {
        for (const obj of jso) {
          FormatVariant(obj, callType, collection, databaseName);
        }
      }
      if(callType == "Products"){
     for (const obj of jso) {
      FormatProducts(obj, callType, collection, databaseName);
        }
      }
      if(callType == "Collections"){
        for (const obj of jso) {
         FormatCollections(obj, callType, collection, databaseName);
           }
      }

      const bulkOps = jso.map((document) => ({
        insertOne: {
          document
        }
      }));

      // const bulkOps = jso.map((document) => ({
      //   updateOne: {
      //     document
      //   }
      // }));


     PostData(session, bulkOps, callType, plan);


    });
  }
  catch (error) {
    console.error('Error reading JSONL file:', error.message);
  }
}