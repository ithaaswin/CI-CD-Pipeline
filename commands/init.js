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
        await createVM.mac();
    } 
    else {
        await createVM.windows(vm_name);   
    }
};
