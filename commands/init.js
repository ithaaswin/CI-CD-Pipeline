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
        console.log(`VM is currently: ${state}`);
        let info_cmd = 'bakerx ssh-info --format config pj'
        const info = child.execSync(info_cmd).toString();
        console.log("Info", info)
        info_split = info.split("\n");
        for(let i=0; i<info_split.length; i++){
            if(i!=0){
                temp = info_split[i].split(' ')
                if(temp.length == 6){
                    key = temp[4]
                    value = temp[5]
                    d[key] = value
                }
            }
        }
        console.log('information after retrieving', d)
    }
};
