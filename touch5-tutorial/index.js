const fs = require('fs');

// // console.log('hello.')

// console.log(process.argv);

// // third argument of process.argv is our filename

// // gives the current working directory
// console.log(process.cwd());

exports.writeHTML5public = writeHTML5;

function writeHTML5() {
    const html5 = fs.readFileSync(`${__dirname}/template.html`)

    const filename = process.argv[2];
    const currentWorkingDirectory = process.cwd();

    fs.writeFileSync(`${currentWorkingDirectory}/${filename}`, html5);
}

writeHTML5();

// run the following in the terminal 
// $ node touch5-tutorial/index.js myFile.html 

// run npm init -y to create a quick package.json file