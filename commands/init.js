const chalk = require('chalk');
const path = require('path');
const createVM = require('../lib/provision')


exports.command = 'init';
exports.desc = 'Prepare tool';
exports.builder = yargs => {
    yargs.options({
    });
};

var d={}
exports.handler = async argv => {
    const { processor } = argv;
    let name = 'pj'
    if(processor == 'Arm64' ) {            
        createVM.mac(name);
    } 
    else {
        createVM.windows(name);   
    }
};
