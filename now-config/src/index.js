#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const nowPath = path.join(process.cwd(), 'now.json');
const existingConfig = fs.existsSync('now.json');

const nodeExpressConfig = require('./configs/nodeExpressConfig');
const staticConfig = require('./configs/staticConfig');
const frontEndFrameworkConfig = require('./configs/frontEndFrameworkConfig');

async function buildConfig() {
  let config = {
    version: 2,
  };

  const answers = await inquirer
    .prompt([
      {
        type: 'text',
        name: 'name',
        message: 'What is the name of the project? 🤔',
        default: path.basename(process.cwd()),
      },
      {
        type: 'list',
        name: 'type',
        message: 'What type of project? 📦',
        choices: ['node-express', 'static', 'react', 'vue', 'static-build'],
      },
    ]);

  config.name = answers.name;
  switch (answers.type) {
    case 'node-express':
      config = await nodeExpressConfig(config);
      break;
    case 'static':
      config = await staticConfig(config);
      break;
    case 'react':
      config = await frontEndFrameworkConfig(config, 'build');
      break;
    case 'vue':
      config = await frontEndFrameworkConfig(config, 'dist');
      break;
    case 'static-build':
      config = await frontEndFrameworkConfig(config, 'dist');
      break;
    default:
      break;
  }
  const moreAnswers = await inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'specifyAlias',
        message: 'Would you like to specify an alias? 👻',
        default: true,
      },
      {
        type: 'text',
        name: 'alias',
        message: 'What is the alias? 🕵🏾‍♂️',
        default: answers.name,
        when: (a) => a.specifyAlias === true,
      },
      {
        type: 'confirm',
        name: 'deploy',
        message: 'Would you like to deploy now? 👨🏾',
        default: false,
      },
    ]);

  config.alias = moreAnswers.alias;
  fs.writeFileSync(nowPath, JSON.stringify(config, null, 2), 'utf-8');

  if (moreAnswers.deploy) {
    console.log('deploying 🚀...');
    console.log('All done! 🎉🎉');
  }
}

if (existingConfig) {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: '🚫 🚨 now.json already exists! Would you like to overwrite it? 🚫 🚨',
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
