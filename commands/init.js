const chalk = require('chalk');
const path = require('path');
const createVM = require('../lib/provision')
const child  = require("child_process");
const VBoxManage = require('../lib/VBoxManage');


exports.command = 'init';
exports.desc = 'Prepare tool';
exports.builder = yargs => {
    yargs.options({
    });
};


exports.handler = async argv => {
    const { processor } = argv;
    let name = 'pj'
    if(processor == 'Arm64' ) {            
        createVM.mac(name);
    } 
    else {
        child.execSync("bakerx run pj focal", {stdio: 'inherit'});
        let state = await VBoxManage.show(name);
        console.log(`VM is currently: ${state}`);
    }
};
