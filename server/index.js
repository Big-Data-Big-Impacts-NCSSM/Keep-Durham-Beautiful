const express = require("express");
const app = express();
const port = 3000;
var fs = require("fs");
var parse = require("csv-parse");
const path = require("path");

app.get("/", (req, res) => {
  res.send("Go to /getHotspots for data.");
});

app.get("/getHotspots", (req, res) => {
  var csvData = [];
  fs.createReadStream(path.join(__dirname, "/litterHotspots.csv"))
    .pipe(parse({ delimiter: "," }))
    .on("data", function (csvrow) {
      console.log(csvrow);
      csvData.push(csvrow);
    })
    .on("end", function () {
      res.send(csvData);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
