const chalk = require('chalk');
exports.command = 'deploy inventory <jobName> <buildFile>';
exports.desc = 'Deploys the job into cloud';
const deployer = require("../lib/deployer.js");
const monitor = require('../lib/monitor.js');
// const serve = require("../lib/serve.js");


exports.builder = yargs => {
    yargs.options({
    });
};

exports.handler = async argv => {
    const { processor, jobName, buildFile } = argv;
    var info=[];
    info=await deployer.deployJob(processor, jobName, buildFile);
    console.log(chalk.cyan(info[0]));
    console.log(chalk.cyan(info[1]));
    await monitor.init(processor);
    await monitor.Monitordroplet(processor, info[0], info[1])
};
