const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const fs = require("fs");
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");
const AllMatchObj = require("./allmatch");
const iplPath = path.join(__dirname, "ipl");
dirCreator(iplPath);

//homepage
request(url,cb);
function cb(err, response, html){
    if(err){
        console.log("error");
    }else{
        //console.log(html);
        extractLink(html);
    }
}

function extractLink(html){
    let $ = cheerio.load(html);
    let anchorEle = $("a[data-hover='View All Results']");
    let link = anchorEle.attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    // console.log(fullLink);
    AllMatchObj.gALmatches(fullLink);
}

function dirCreator(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}