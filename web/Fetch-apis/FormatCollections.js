import { ConnectDB1 } from "../db.js";

export async function FormatCollections(object, callType, collection, databaseName) {



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
      }
  
    }
    const dates = ["updatedAt"];
    dates.forEach(prop => object[prop] && (object[prop] = object[prop]));


   
  replaceEmptyElements(object);

}
