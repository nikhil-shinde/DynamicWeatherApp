require('dotenv').config();
const http = require("http"); //to create server
const fs = require("fs"); //require filesystem
var requests = require("requests"); //require requests


const homeFile = fs.readFileSync("index.html", "utf-8"); //here we are using synchronous version


const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);


  return temperature;
};

//creating server with asynchronous version | use createServer() function
const server = http.createServer((req, res) => {
    //creating request url
  if (req.url == "/") {
    requests(
      `http://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=${process.env.APPID}`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1");