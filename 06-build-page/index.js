const fs = require("fs");
const path = require("path");

const distFileStylePath = path.join(__dirname, '/project-dist/style.css');
const stylesFilesPath = path.join(__dirname, '/styles');


let writeStream = fs.createWriteStream(distFileStylePath);

fs.mkdir(__dirname + '/project-dist', {
    recursive: true
}, (err) => {
    if (err) throw err;
});

fs.mkdir(__dirname + '/project-dist/assets', {
    recursive: true
}, (err) => {
    if (err) throw err;
});


fs.readdir(
    stylesFilesPath, {
        withFileTypes: true,
    },
    (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
            if (path.extname(`${file.name}`) === ".css") {
                let readableStream = fs.createReadStream(stylesFilesPath + "/" + file.name);
                readableStream.pipe(writeStream);
            }
        });
    }
);

const assetsPath = path.join(__dirname, '/assets');
const assetsDistPath = path.join(__dirname, '/project-dist/assets');


// async function copyDir(src, dest) {
//     const entries = await fs.readdir(src, {
//         withFileTypes: true
//     });
//     await fs.mkdir(dest);
//     for (let entry of entries) {
//         const srcPath = Path.join(src, entry.name);
//         const destPath = Path.join(dest, entry.name);
//         if (entry.isDirectory()) {
//             await copyDir(srcPath, destPath);
//         } else {
//             await FSP.copyFile(srcPath, destPath);
//         }
//     }
// }


fs.readdir(assetsPath, {
    withFileTypes: true
}, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        fs.stat(assetsPath + '/' + file.name, (err, stat) => {
            if (err) throw err;

            if (!stat.isDirectory()) {
                fs.copyFile(assetsPath + `/${file.name}`, assetsDistPath + `/${file.name}`, (err) => {
                    if (err) throw err;
                });
            } else {
                fs.readdir(path.join(assetsPath, file.name), {
                    withFileTypes: true
                }, (err, files1) => {
                    if (err) throw err;

                    files1.forEach(file1 => {
                        // console.log(file1.name);
                        fs.mkdir(path.join(assetsDistPath, file.name), {
                            recursive: true
                        }, (err) => {
                            if (err) throw err;
                        });
                        fs.copyFile(path.join(assetsPath, file.name) + '/' + file1.name, path.join(assetsDistPath, file.name) + '/' + file1.name, (err) => {
                            if (err) throw err;
                        });
                    });
                });
            }
        });

    });
});


async function getComponents() {
    const data = await fs.promises.readFile(__dirname + '/template1.html');

    let arrComponents = data.toString().match(/[^{{\}}]+(?=})/g);

    return arrComponents;
}

async function readFile(name) {
    return await fs.promises.readFile(__dirname + `/components/${name}`);
}

async function readDir() {
    const files = await fs.promises.readdir(__dirname + '/components');
    return files;
}

async function replaceComponents(nameFile, obj) {
    let data = await (await fs.promises.readFile(__dirname + '/' + nameFile)).toString();

    const arrComp = await getComponents();

    for (let i = 0; i < arrComp.length; i++) {
        data = data.replace(`{{${arrComp[i]}}}`, obj[arrComp[i]]);
    }

    let writeableStream = fs.createWriteStream(__dirname + '/project-dist/index.html');

    writeableStream.write(data);
}

(async () => {

    const obj = {};

    const arrFiles = await readDir();

    for (let i = 0; i < arrFiles.length; i++) {
        const name = arrFiles[i].slice(0, -5);

        obj[name] = await (await readFile(arrFiles[i])).toString();

    }

    await replaceComponents('template1.html', obj);

    // await copyDir(assetsPath, assetsDistPath);

})();