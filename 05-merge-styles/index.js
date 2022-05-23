const fs = require("fs");
const path = require("path");

const projectDist = path.join(__dirname, "/project-dist");
const bundle = path.join(projectDist, "/bundle.css");
const styles = path.join(__dirname, "/styles");

let writeStream = fs.createWriteStream(bundle);

fs.readdir(
    styles, {
        withFileTypes: true,
    },
    (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
            if (path.extname(`${file.name}`) === ".css") {
                let readableStream = fs.createReadStream(styles + "/" + file.name);


                readableStream.pipe(writeStream);
            }
        });
    }
);