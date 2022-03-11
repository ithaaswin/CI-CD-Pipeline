const child  = require("child_process");
const VBoxManage = require('../lib/VBoxManage');
const fs = require('fs');
const yaml = require('js-yaml');
const dotenv = require('dotenv');
dotenv.config();
let vm_name = process.env.vm_name;


class Builder{
    async mac(job_name, build_path){

        child.execSync(`ansible-playbook ${build_path} --tags "${job_name}" -i inventory --extra-vars "git_user=${process.env.git_user} git_token=${process.env.git_token}"`,{stdio: ['inherit', 'inherit', 'inherit']});
    }
    async windows(job_name, build_path)
    {
        console.log(job_name);
        console.log(build_path);
        let configJSON = fs.readFileSync('config.json');
        child.execSync(`ssh -q -i ${JSON.parse(configJSON).bakerx_keyPath} -p ${JSON.parse(configJSON).config_port} -o StrictHostKeyChecking=no ${JSON.parse(configJSON).User}@${JSON.parse(configJSON).loopback_ip} "ansible-playbook /bakerx/lib/build.yml --tags ${job_name} -i /bakerx/inventory --extra-vars 'git_user=${process.env.git_user} git_token=${process.env.git_token}'"`, {stdio: 'inherit'});
        //child.execSync(`ansible-playbook ~/commands/build.yml --tags "${job_name}" -i inventory`);
        //child.execSync(`ansible-playbook ~/commands/build.yml --list-tags -i inventory`);
        //child.execSync(`ansible-playbook ~/commands/build.yml  --list-tasks -i inventory`);
    }
}
module.exports = new Builder();
