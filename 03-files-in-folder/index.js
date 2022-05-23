const fs = require("fs");
const path = require("path");

const dirName = path.join(__dirname, "/secret-folder");

fs.readdir(dirName, {
    withFileTypes: true
}, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        fs.stat(dirName + '/' + file.name, (err, stats) => {
            if (err) throw err;
            if (!stats.isDirectory()) {
                console.log(path.parse(file.name).name + '-' + path.extname(`${file.name}`).slice(1) + '-' + stats.size);
            }
        });
    });
});