const path = require('path');
const fs = require('fs');
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
    if (answers.addBuildScript) {
        try {
            const packageJSONPath = path.join(process.cwd(), 'package.json');
            // eslint-disable-next-line
            const packageJSON = require(packageJSONPath)
            const buildScript = (packageJSON.scripts || {})['now-build'] || 'npm run build';
            const buildAnswers = await inquirer
                .prompt([
                    {
                        type: 'text',
                        name: 'buildCommand',
                        message: 'What is the build command?',
                        default: buildScript,
                    }
                ]);
            packageJSON.scripts = (packageJSON.scripts || {})
            packageJSON.scripts['now-build'] = buildAnswers.buildCommand;
            fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 4, 'utf8'))
        } catch (error) {
            console.log('package.json does not exist 👎🏾');
            process.exit(1) // exit with an error;
        }
    }
    return {
        ...config,
        ...baseConfig
    };
}

module.exports = reactConfig;