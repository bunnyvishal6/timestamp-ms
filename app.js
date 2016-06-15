var http = require("http");
var fs = require("fs");
var url = require("url");

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function convertion(time){
    if(isUnixTime(time)){
        return convertToNaturalTime(time);
    } else if(isNaturaTime(time)){
        return convertToUnixTime(time);
    } else {
        return {
            'unix': null,
            'natural': null
        }
    }
}

function isNaturaTime(time){
    time = time.replace(/\%20/g, ' ');
    return !isNaN(Date.parse(time));
}

function isUnixTime(time){
    return new Date(parseInt(time)).getTime() > 0;
}

function convertToUnixTime(time){
    time = time.replace(/\%20/g, ' ');
    return {
        'unix': Date.parse(time) / 1000,
        'natural': time
    }
}


function convertToNaturalTime(time){
    var date = new Date(time * 1000);
    var month = checkMonth(date.getMonth());
    var day = date.getDate();
    var year = date.getFullYear();
    return {
        unix: time,
        natural: month + " " + day + ", " + year
    }
}

function checkMonth(val){
    return months[val];
}


http.createServer(function(request, response){
    var inputUrl = url.parse(request.url, true);
    var time = inputUrl.path.substring(1, inputUrl.length);
    var outputTime = convertion(time);
    if(inputUrl.path == '/' ){
        var data = fs.readFileSync('./index.html');
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end(data);
    } else {
        response.writeHead(200, {"title": "Timestamp Microservice"});
        response.end(JSON.stringify(outputTime));
    }
}).listen(process.env.PORT);