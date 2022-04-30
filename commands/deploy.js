exports.command = 'deploy inventory <jobName> <buildFile>';
exports.desc = 'Deploys the job into cloud';
const builder = require("../lib/builder.js");
const deployer = require("../lib/deployer.js");
const serve = require("../lib/serve.js");
const chalk = require('chalk');

exports.builder = yargs => {
    yargs.options({
    });
};

exports.handler = async argv => {
    const { processor, jobName, buildFile } = argv;
    // await deployer.deployJob(processor, jobName, buildFile);
    serve.loadProxy(processor);
    // serve.monitor(processor)
    // console.log(chalk.red("**********************************************************************************************************"))
    serve.run();
    
};