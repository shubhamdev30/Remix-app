const filterquery = (newdata, columndata,tempdata) => {
  const data = [];
  for (let obj of newdata) {
    const tag = obj.tag;
    let newObj = { ...obj }; // Create a new object based on the current one
    for (let section of columndata) {
      for (let value of section.values) {
        if (value.label === tag) {
          newObj.tag = value.key;
          newObj.type = value.type;
          break;
        }
      }
    }

    data.push(newObj);
  }
  let query = {};
  data.forEach((dataItem) => {
    if (dataItem.type == "number") {
      switch (dataItem.condition) {
        case "equal":

          query[dataItem.tag] = { $eq: dataItem.value } // Wrap value in an array for $in operator
          break;
        case "notequal":
          query[dataItem.tag] = { $ne: dataItem.value } // Wrap value in an array for $in operator
          break;
        case "less than":
          query[dataItem.tag] = { $lt: dataItem.value } // Wrap value in an array for $in operator
          break;
        case "grater than":
          query[dataItem.tag] = { $gt: dataItem.value } // Wrap value in an array for $in operator
          break;
        case ">=":
          query[dataItem.tag] = { $gte: dataItem.value } // Wrap value in an array for $in operator
          break;
        case "<=":
          query[dataItem.tag] = { $lte: dataItem.value } // Wrap value in an array for $in operator
          break;
        default:
          // Handle invalid condition if needed
          break;
      }

    } else if (dataItem.type == "date") {
      switch (dataItem.condition) {
        case "After":
          query[dataItem.tag] = { $gte: dataItem.value}
          break;
        case "Before":
          query[dataItem.tag] = { $lte: dataItem.value }
          break;
        case "Equal":
          query[dataItem.tag] = {
            $regex: dataItem.value,
            $options: "i"
          };
          break;
        case "In Range":
          query[dataItem.tag] = { $gte: dataItem.value, $lte: dataItem.rangeopt }
          break;
          case "is blank":
            query[dataItem.tag] = dataItem.value;
            break;
          case "is not blank":
            query[dataItem.tag] = { $ne: dataItem.value };
            break;
        default:
          // Handle invalid condition if needed
          break;
      }

    } else if (dataItem.type == "boolean") {
      switch (dataItem.condition) {
        case "True":
          query[dataItem.tag] = true
          break;
        case "False":
          query[dataItem.tag] = false
          break;
        case "is blank":
          query[dataItem.tag] = dataItem.value;
          break;
        case "is not blank":
          query[dataItem.tag] = { $ne: dataItem.value };
          break;
        default:
          // Handle invalid condition if needed
          break;
      }

    } else if (dataItem.type == "array") {
      switch (dataItem.condition) {
        case "contains":
          query[dataItem.tag] = {$in: [dataItem.value]}
          break;
        case "not contains":
          query[dataItem.tag] = {$in: [dataItem.value]}
          break;
        case "is blank":
          query[dataItem.tag] = dataItem.value;
          break;
        case "is not blank":
          query[dataItem.tag] = { $ne : [] };
          break;
        default:
          // Handle invalid condition if needed
          break;
      }

    } else {
      switch (dataItem.condition) {
          case "is":
            query[dataItem.tag] = {$in: dataItem.multiple};
            break;
          case "is not":
            query[dataItem.tag] = { $nin: dataItem.multiple };
            break;
          case "contains":
            if (dataItem.term == "and") {
              query[dataItem.tag] = {
                $regex: dataItem.multiple.map(value => `(?=.*${value})`).join(""),
                $options: "i"
              };
            } else {
              query[dataItem.tag] = {
                $regex: dataItem.multiple.map(value => `(${value})`).join("|"),
                $options: "i"
              };
            }
            break;
        case "not contains":
          query[dataItem.tag] = query[dataItem.tag] = {
            $not: {
              $regex: dataItem.multiple.map(value => `(${value})`).join("|"),
              $options: "i"
            }
          };
          break;
        case "include":
          query[dataItem.tag] = { $regex: dataItem.value } // Wrap value in an array for $in operator
          break;
        case "begins with":
          query[dataItem.tag] ={
            $regex: `^${dataItem.multiple.map(value => `(${value})`).join("|")}`,
            $options: "i"
          } 
          break;
        case "ends with":
          query[dataItem.tag] = {
            $regex: `${dataItem.multiple.map(value => `(${value})`).join("|")}$`,
            $options: "i"
          }
          break;
        case "is blank":
          query[dataItem.tag] = "N/A";
          break;
        case "is not blank":
          query[dataItem.tag] = { $ne: "N/A" };
          break;
        default:
          // Handle invalid condition if needed
          break;
      }
    }
  });
 // transform into object
 let Param = {
  orderQuery:{},
  lineitemsQuery:{}
}
 let prdtParam = {
  productQuery:{},
  variantsQuery:{}
}


if(tempdata == "Orders") {
  columndata.forEach(column => {
   column.values.forEach(field => {
     if (query.hasOwnProperty(field.key)) {
       if (field.calltype === 'order') {
         Param.orderQuery[field.key] = query[field.key];
       } else if (field.calltype === 'lineitem') {
         Param.lineitemsQuery[field.key] = query[field.key];
       }
     }
   });
  });
  return Param
}else if(tempdata == "Products") {
  columndata.forEach(column => {
   column.values.forEach(field => {
     if (query.hasOwnProperty(field.key)) {
       if (field.calltype === 'product') {
         prdtParam.productQuery[field.key] = query[field.key];
       } else if (field.calltype === 'variant') {
         prdtParam.variantsQuery[field.key] = query[field.key];
       }
     }
   });
  });
return prdtParam;

} else{
return query;
}

 

};

export default filterquery;
