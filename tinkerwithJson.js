let fs = require("fs");
let xlsx = require("xlsx");
// let buffer = fs.readFileSync("./example.json");
// console.log(buffer);
// console.log("```````````````````````````````");
// //array
// let data = JSON.parse(buffer);
let data = require("./example.json");
// console.log(data);

// data.push({
//     "name" : "Thor",
//     "last name" : "rogers",
//     "age" : 45,
//     "isAvenger" : true,
//     "friends" : ["tony", "bruce", "natasha"],
//     "address" : {
//         "city" : "manhatten",
//         "state" : "new york"
//     }
// });

// let stringdata = JSON.stringify(data);
// fs.writeFileSync("example.json", stringdata);

function excelWriter(filepath, json, sheetName){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
    xlsx.writeFile(newWB, filepath);
}

function excelReader(filepath,sheetName){
    if(fs.existsSync(filepath) == false){
        return[];
    }

    let wb = xlsx.readFile(filepath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return;

}

