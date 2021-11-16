const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj = require("./scorecard");
// const scorecard = require("./scorecard");

function getAllMatchesLink(url){
    request(url, function(err, response, html){
        if(err){
            console.log("error");
        }else{
            //console.log(html);
            extractAllLink(html);
        }
    });
}

function extractAllLink(html){
    let $ = cheerio.load(html);
    let scorecardEle = $("a[data-hover='Scorecard']");
    for(let i = 0; i < scorecardEle.length; i++){
        let link = $(scorecardEle[i]).attr("href");
        let fullLink = "https://www.espncricinfo.com" + link;
        console.log(fullLink);
        scoreCardObj.ps(fullLink);
    }
}

module.exports = {
    gALmatches : getAllMatchesLink
}