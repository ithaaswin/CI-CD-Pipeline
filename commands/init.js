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
    let name = 'pj'
    if(processor == 'Arm64' ) {            
        try{child.execSync("vm stop pj",{stdio: 'pipe'});}
        catch{}
        try{child.execSync("vm rm pj",{stdio: 'pipe'});}
        catch{}
        child.execSync("vm run pj ubuntu:focal",{stdio: 'inherit'});
        child.execSync("vm ssh-config pj > config.json")
        child.execSync("echo 'path: ~/Library/Application\ Support/basicvm/key' >> config.json")
    } else {
        child.execSync("bakerx run pj focal", {stdio: 'inherit'});
        let state = await VBoxManage.show(name);
        console.log(`VM is currently: ${state}`);
    }
};
