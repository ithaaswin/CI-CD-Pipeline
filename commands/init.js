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

var d={}
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
        var jsonData = JSON.stringify(d);
        var fs = require('fs');
        fs.writeFile("config.JSON", jsonData, function(err) {
            if (err) {
                console.log(err);
            }
        
});
    }
};
