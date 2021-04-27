const path = require('path');
const inquirer = require('inquirer');

const baseConfig = {
    builds: [
        {
            src: 'src/index.js',
            use: '@now/node-server',
        },
    ],
    routes: [
        { src: '/.*', dest: 'src/index.js' },
    ],
};

async function nodeExpressConfig(config) {
    let mainFile = 'src/index.js'
    try {
        // eslint-disable-next-line
        const packageJSON = require(path.join(process.cwd(), '/package.json'))
        mainFile = packageJSON.main;
        // eslint-disable-next-line
    } catch (error) {
        // swallowing this error 
    }

    const answers = await inquirer
        .prompt([
            {
                type: 'text',
                name: 'name',
                message: 'What is the path to your express entry point?',
                default: mainFile,
            },
        ]);

    baseConfig.builds[0].src = answers.name;
    baseConfig.routes[0].destination = answers.name;

    return {
        ...config,
        ...baseConfig
    };
}

module.exports = nodeExpressConfig;