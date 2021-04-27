const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');

const baseConfig = {
  builds: [
    {
      src: 'package.json',
      use: '@now/static-build',
      config: { distDir: 'build' },
    },
  ],
  routes: [
    { handle: 'filesystem' },
    { src: '/.*', dest: 'index.html' },
  ],
};

async function reactConfig(config, defaultBuild = 'dist') {
  let packageJSONPath;
  let packageJSON;
  let buildScript = '';
  try {
    packageJSONPath = path.join(process.cwd(), 'package.json');
    // eslint-disable-next-line
        packageJSON = require(packageJSONPath)
    buildScript = (packageJSON.scripts || {})['now-build'] || 'npm run build';
  } catch (error) {
    console.log('package.json does not exist 👎🏾');
    process.exit(1); // exit with an error;
  }

  const answers = await inquirer
    .prompt([
      {
        type: 'text',
        name: 'directory',
        message: 'What is the build directory? 🔎',
        default: defaultBuild,
      },
      {
        type: 'confirm',
        name: 'addBuildScript',
        message: 'Do you want to add a "now-build" script to your package.json? 📦',
        default: true,
      },
      {
        type: 'text',
        name: 'buildCommand',
        message: 'What is the build command? 💐',
        default: buildScript,
        when: (a) => a.addBuildScript === true,
      },
    ]);
  baseConfig.builds[0].config.distDir = answers.directory;
  if (answers.addBuildScript) {
    packageJSON.scripts = (packageJSON.scripts || {});
    packageJSON.scripts['now-build'] = answers.buildCommand;
    fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 4, 'utf8'));
  }
  return {
    ...config,
    ...baseConfig,
  };
}

module.exports = reactConfig;
