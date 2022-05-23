const fs = require("fs");
const path = require("path");
const process = require("process");

const readline = require("readline");
const {
    stdin: input,
    stdout: output
} = require("process");

const rl = readline.createInterface({
    input,
    output,
});

const dirName = path.join(__dirname, "/text.txt");
let writeStream = fs.createWriteStream(dirName);

rl.question("Hello! Write some text here! \n", (answer) => {
    writeStream.write(answer + "\n");
});

rl.on("line", (input) => {
    if (input === "exit") {
        rl.close();
    } else {
        writeStream.write(input + "\n");
    }
});

rl.on("SIGINT", () => {
    rl.close();
});

process.on("exit", () => {
    console.log("Good Luck!");
});