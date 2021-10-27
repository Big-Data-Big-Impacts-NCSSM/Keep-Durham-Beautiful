const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const express = require("express");
const app = express();
const port = 3000;
var geocoder = require("geocoder");

const { google } = require("googleapis");
const keys = require("./keys.json");

const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

//Creating the csvWriter
const csvWriter = createCsvWriter({
  path: "/litterHotspots.csv",
  header: [
    { id: "Name", title: "Name" },
    { id: "Address", title: "Address" },
    { id: "Map", title: "Map" },
    { id: "Description", title: "Description" },
    { id: "Parking", title: "Parking" },
    { id: "Types of Volunteers", title: "Types of Volunteers" },
    { id: "Group Size", title: "Group Size" },
    { id: "Type of Work", title: "Type of Work" },
    { id: "Season", title: "Season" },
    { id: "Other", title: "Other" },
    { id: "major hotspot?", title: "major hotspot?" },
  ],
});

async function gsrun(cl) {
  const gsapi = google.sheets({ version: "v4", auth: cl });

  const opt = {
    spreadsheetId: "15qcutdaPmh7UeTs58GV7YtYhXj3_HPv4uXG7hF2BGQY",
    range: "A1:K35",
  };

  let data = await gsapi.spreadsheets.values.get(opt);
  console.log(data.data.values);
}

//Source: https://www.youtube.com/watch?v=MiPpQzW_ya0

const data = [{}];

csvWriter.writeRecords(data);

//Source: https://www.codegrepper.com/code-examples/javascript/Writing+CSV+Files+nodejs

var fs = require("fs");
var parse = require("csv-parse");
const path = require("path");

const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  res.send("Go to /getHotspots for data.");
});

app.get("/getHotspots", (req, res) => {
  var csvData = [];
  fs.createReadStream(path.join(__dirname, "/litterHotspots.csv"))
    .pipe(parse({ delimiter: "," }))
    .on("data", function (csvrow) {
      if (csvrow[0] == "Name") {
        csvrow.push("Longitude");
        csvrow.push("Latitude");
      } else {
        geocoder.geocode(csvrow[1], function (err, data) {
          console.log(data);
        });
      }

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
