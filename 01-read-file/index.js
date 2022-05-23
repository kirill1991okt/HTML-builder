const fs = require("fs");
const path = require('path');

let dirName = path.join(__dirname, "/text.txt");

let readStream = fs.createReadStream(dirName, "utf-8");

readStream.on("data", function (chunk) {
    console.log(chunk);
});