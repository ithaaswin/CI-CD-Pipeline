const chalk = require('chalk');
const path = require('path');
const m1 = require('./mac.js')
const child  = require("child_process");

exports.command = 'init';
exports.desc = 'Prepare tool';
exports.builder = yargs => {
    yargs.options({
    });
};


exports.handler = async argv => {
    const { processor } = argv;
    console.log(processor);

    if(processor == 'Arm64' ) {            
        try{child.execSync("vm stop v1",{stdio: 'pipe'});}
        catch{}
        try{child.execSync("vm rm v1",{stdio: 'pipe'});}
        catch{}
        child.execSync("vm run v1 ubuntu:focal",{stdio: 'inherit'});
        child.execSync("vm ssh-config v1 > config.txt")
    } else {
        docker.something
    }
};