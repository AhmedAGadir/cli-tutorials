const path = require('path');
const inquirer = require('inquirer');

const baseConfig = {
    builds: [
        {
            src: 'package.json',
            use: '@now/static-build',
            config: { distDir: 'build' }
        },
    ],
    routes: [
        { handle: 'filesystem' },
        { src: '/.*', dest: 'index.html' }
    ],
};

async function reactConfig(config) {
    const answers = await inquirer
        .prompt([
            {
                type: 'text',
                name: 'directory',
                message: 'What is the build directory?',
                default: 'build',
            },
            {
                type: 'confirm',
                name: 'addBuildScript',
                message: 'Do you want to add a "now-build" script to your package.json?',
                default: true,
            },
        ]);

    baseConfig.builds[0].config.distDir = answers.directory;
    return {
        ...config,
        ...baseConfig
    };
}

module.exports = reactConfig;