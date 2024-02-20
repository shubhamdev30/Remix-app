import { ConnectDB1 } from "../db.js";

export async function FormatVariant(object, callType, collection, databaseName) {


    function replaceEmptyElements(obj) {
      for (let key in obj) {
        if (!obj[key]) {
          if(typeof obj[key] == "number"){  obj[key] = "0";  }
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
    function renameAndAssign(prefix, source) {
      const modifiedData = {};
      for (const key in source) {
      if(key !== "product_id"){
        modifiedData[`${prefix}_${key}`] = source[key];
        // delete object[key];
      }
      }
      for (const key in modifiedData) {
          object[key] = modifiedData[key];
        // console.log(`key ${key} ` + `modifiedData ${modifiedData} ` + `object[key] ${object[key]} ` + `  modifiedData[key] ${modifiedData[key]} `);
      }
  
    }

    // modifyAndAssign("product", object["product"]);
    renameAndAssign("variant", object);
    object["product"]["tags"] = object["product"]["tags"].join(', ');
   object["variant_inventoryvalue"] =parseInt(object["variant_inventoryQuantity"])*parseFloat(object["variant_price"]);
if(parseInt(object["variant_inventoryQuantity"]) <= 0){
  object["variant_inventory_status"] ="Out Of Stock";
}else{
  object["variant_inventory_status"] ="In Stock";
}
if(object["variant_inventoryItem"] && object["variant_inventoryItem"]["unitCost"] !== undefined &&  object["variant_inventoryItem"]["unitCost"] !== null ){
  object["product_cost"] =object["variant_inventoryItem"]["unitCost"]["amount"];
}else{
  object["product_cost"] ="0";
}
if(object["variant_inventoryItem"] && object["variant_inventoryItem"]["unitCost"] !== undefined &&  object["variant_inventoryItem"]["unitCost"] !== null ){
  object["inventory_cost"] =parseInt(object["variant_inventoryItem"]["unitCost"]["amount"])*parseInt(object["variant_inventoryQuantity"]);
}else{
  object["inventory_cost"] ="0";
}

if(object["variant_inventoryQuantity"] > 20){
  object["inventory_level"] ="High";
}else if(object["variant_inventoryQuantity"] < 10){
  object["inventory_level"] ="Low";
}else{
  object["inventory_level"] ="Medium";
}

const dates = ["variant_createdAt", "variant_updatedAt","variant_product_createdAt", "variant_product_publishedAt", "variant_product_updatedAt"];
dates.forEach(prop => object[prop] && (object[prop] = object[prop]));

    delete object["variant_inventoryItem"];
    // delete object["product"];
    delete object["variant_product"];
  replaceEmptyElements(object);

}
