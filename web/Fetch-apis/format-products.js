import { ConnectDB1 } from "../db.js";

export async function FormatProducts(object, callType, collection, databaseName) {
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

    if(object["tags"] == "N/A" || object["tags"] == undefined){
        object["tags"] = "N/A";
        
      }else{
        object[`tags`] = object[`tags`].join(', ');
      }

  const dates = ["createdAt", "updatedAt", "publishedAt"];
  dates.forEach(prop => object[prop] && (object[prop] = object[prop]));


  replaceEmptyElements(object);

}
