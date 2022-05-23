const fs = require("fs");
const path = require("path");

const folderFiles = path.join(__dirname + '/files');
const folderFilesCopy = path.join(__dirname + '/files-copy');

fs.mkdir(__dirname + '/files-copy', {
    recursive: true
}, (err) => {
    if (err) throw err;
});

fs.readdir(__dirname + '/files-copy', (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        fs.unlink(folderFilesCopy + '/' + file, err => {
            if (err) throw err;
        });
    });

    fs.readdir(__dirname + '/files', (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            fs.copyFile(folderFiles + `/${file}`, folderFilesCopy + `/${file}`, (err) => {
                if (err) throw err;
            });
        });
    });

});