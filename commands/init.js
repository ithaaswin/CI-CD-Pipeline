const chalk = require('chalk');
const path = require('path');
const createVM = require('../lib/provision')
const dotenv = require('dotenv');
dotenv.config();
let vm_name = process.env.vm_name;


exports.command = 'init';
exports.desc = 'Prepare tool';
exports.builder = yargs => {
    yargs.options({
    });
};

var d={}
exports.handler = async argv => {
    const { processor } = argv;
    if(processor == 'Arm64' ) {            
        createVM.mac(vm_name);
    } 
    else {
        createVM.windows(process.env.vm_name);   
    }
};
