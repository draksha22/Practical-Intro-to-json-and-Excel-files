// const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

function processScorecard(url){
    request(url,cb);

}

//homepage
function cb(err, response, html){
    if(err){
        console.log("error");
    }else{
        //console.log(html);
        extractMatchDetails(html);
    }
}

function extractMatchDetails(html){
    let $ = cheerio.load(html);
    //date venue -> .match-header-container .description
    //result -> .match-header-container .status-text
    let descEle = $(".match-header-container .description");
    let res = $(".match-header-container .status-text");
    let strArr = descEle.text().split(",");
    let venue = strArr[1].trim();
    let date = strArr[2].trim();
    res = res.text();
    let innings = $(".card.content-block.match-scorecard-table .Collapsible");
    // let htmlStr = "";
    for(let i = 0; i < innings.length;i++){
        // htmlStr += $(innings[i]).html();
        //team opponent
        let teamName = $(innings[i]).find("h5").text();
        teamName = teamName.split("INNINGS")[0].trim();
        let opponentIndex = i == 0 ? 1 : 0;
        let opponentName = $(innings[opponentIndex]).find("h5").text();
        opponentName = opponentName.split("INNINGS")[0].trim();
        let cinnings = $(innings[i]);
        console.log(`${venue}| ${date} |${teamName} |${opponentName}| ${res}`);
        let allRows = cinnings.find(".table.batsman tbody tr");
        for(let j = 0; j < allRows.length;j++){
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("batsman-cell");
            if(isWorthy){
                // console.log(allCols.text());
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();
                console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentName,venue,date,res);
            }
        }
    }
    // console.log(htmlStr);
}

function processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentName,venue,date,res){
    let teamPath = path.join(__dirname,"ipl", teamName);
    dirCreator(teamPath);
    let filePath = path.join(teamPath,playerName + ".xlsx");
    let content = excelReader(filePath,playerName); //content empty array ki form m aaya
    let playerObj = {
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentName,
        venue,
        date,
        res
    }
    content.push(playerObj);
    excelWriter(filePath,content,playerName);

}

function dirCreator(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}

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
    return ans;

}


module.exports = {
    ps: processScorecard
}
