const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const existingConfig = fs.existsSync('now.json');

const nodeExpressConfig = require('./configs/nodeExpressConfig');
const staticConfig = require('./configs/staticConfig');
const reactConfig = require('./configs/reactConfig');



async function buildConfig() {
    let config = {
        version: 2
    }

    let answers = await inquirer
        .prompt([
            {
                type: 'text',
                name: 'name',
                message: 'What is the name of the project?',
                default: path.basename(process.cwd()),
            },
            {
                type: 'list',
                name: 'type',
                message: 'What type of project?',
                choices: ['node-express', 'static', 'react', 'vue', 'static-build', 'lambda'],
            },
        ])

    config.name = answers.name;
    switch (answers.type) {
        case 'node-express':
            config = await nodeExpressConfig(config);
            break;
        case 'static':
            config = await staticConfig(config);
            break;
        case 'react':
            config = await reactConfig(config);
            break;
        default:
            break;
    }
    console.log(config);
}

if (existingConfig) {
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: 'now.json already exists! Would you like to overwrite it?',
                default: false,
            },
        ])
        .then((answers) => {
            if (answers.overwrite) {
                buildConfig();
            } else {
                console.log('Goodbye! 👋🏾');
            }
        });
} else {
    buildConfig();
}
