#!/usr/bin/env node
const yargs = require('yargs');
const chalk = require('chalk');
// const deployer = require("../lib/deployer.js");
const serve = require("./serve.js");

// exports.builder = yargs => {
//     yargs.options({
//     });
// };

// exports.handler = async argv => {
//     // const { processor, jobName, buildFile } = argv;
//     // const processor="Intel/Amd64"
//     var homePage = 'iTrust2-10/login';
//     console.log(chalk.cyan(homePage));
//     await serve.loadProxy(homePage);
//     console.log(chalk.red("**********************************************************************************************************"));
//     await serve.run();
// };

(async () => {
    var homePage = process.argv[2];
    var port=process.argv[3];
    console.log(chalk.cyan(homePage));
    serve.loadProxy(homePage,port);
    serve.run();
   
})();
