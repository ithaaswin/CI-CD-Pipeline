const chalk = require('chalk');
exports.command = 'deploy inventory <jobName> <buildFile>';
exports.desc = 'Deploys the job into cloud';
const deployer = require("../lib/deployer.js");
const serve = require("../lib/serve.js");


exports.builder = yargs => {
    yargs.options({
    });
};

exports.handler = async argv => {
    const { processor, jobName, buildFile } = argv;
    var homePage = await deployer.deployJob(processor, jobName, buildFile);
    console.log(chalk.cyan(homePage));
    await serve.loadProxy(processor, homePage);
    console.log(chalk.red("**********************************************************************************************************"));
    await serve.run();
};
