const child  = require("child_process");
const fs = require('fs');
const chalk = require("chalk");
const dotenv = require('dotenv');
dotenv.config();


class Builder{
    async execute(processor, quote, cmd)
    {
        console.log(chalk.green(cmd));
        if (processor == 'Arm64'){
            if (quote)
                child.execSync(`vm exec ${process.env.vm_name} "'${cmd}'"`, {stdio: ['inherit', 'inherit', 'inherit']});
            else
                child.execSync(`vm exec ${process.env.vm_name} "${cmd}"`, {stdio: ['inherit', 'inherit', 'inherit']});
        }
        else {
            var configJSON = fs.readFileSync('config.json');
            let keyPath=JSON.parse(configJSON).bakerx_keyPath
            let vm_port=JSON.parse(configJSON).vm_port
            child.execSync(`ssh -q -i ${keyPath} -p ${vm_port} -o StrictHostKeyChecking=no vagrant@127.0.0.1 "${cmd}"`, {stdio: ['inherit', 'inherit', 'inherit']});
        }
    }
} module.exports = new Builder();