const chalk = require('chalk');
const path = require('path');
const m1 = require('./mac.js')
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
    console.log(processor);
    let name = 'pj'
    if(processor == 'Arm64' ) {            
        try{child.execSync("vm stop pj",{stdio: 'pipe'});}
        catch{}
        try{child.execSync("vm rm pj",{stdio: 'pipe'});}
        catch{}
        child.execSync("vm run pj ubuntu:focal",{stdio: 'inherit'});
        child.execSync("vm ssh-config pj > config.txt")
    } else {
        child.execSync("bakerx run pj focal", {stdio: 'inherit'});
        let state = await VBoxManage.show(pj);
        console.log(`VM is currently: ${state}`);
    }
};
