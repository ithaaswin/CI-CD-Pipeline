const child  = require("child_process");
const fs = require('fs');
const chalk = require("chalk");
const dotenv = require('dotenv');
dotenv.config();


class Builder{
    async executeVM(processor, cmd)
    {
        console.log(chalk.green(cmd));
        
        if (processor == 'Arm64'){
                child.execSync(`vm exec ${process.env.vm_name} "'${cmd}'"`, {stdio: ['inherit', 'inherit', 'inherit']});
        } else {
            var configJSON = fs.readFileSync('config.json');
            var keyPath = JSON.parse(configJSON).bakerx_keyPath
            var vm_port = JSON.parse(configJSON).vm_port
            child.execSync(`ssh -q -i ${keyPath} -p ${vm_port} -o StrictHostKeyChecking=no vagrant@127.0.0.1 "${cmd}"`, {stdio: ['inherit', 'inherit', 'inherit']});
        }
    }

    async executeDroplet(processor, cmd){
        var inventoryJSON = fs.readFileSync('inventory.JSON');
        var ip = JSON.parse(inventoryJSON).ip;
        console.log(chalk.green(cmd));

        if (processor == 'Arm64'){
                child.execSync(`vm exec ${process.env.vm_name} "'ssh -i ~/.ssh/${process.env.vm_name} -o StrictHostKeyChecking=no root@${ip} ${cmd}'"`, {stdio: ['inherit', 'inherit', 'inherit']});
        } else{
            var configJSON = fs.readFileSync('config.json');
            let keyPath = JSON.parse(configJSON).bakerx_keyPath
            let vm_port = JSON.parse(configJSON).vm_port
            child.execSync(`ssh -q -i ${keyPath} -p ${vm_port} -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ssh -i ~/.ssh/${process.env.vm_name} root@${ip} ${cmd} ${cmd}"`, {stdio: ['inherit', 'inherit', 'inherit']});
        }
    }
        
} module.exports = new Builder();