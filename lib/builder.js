const child  = require("child_process");
const VBoxManage = require('../lib/VBoxManage');
const fs = require('fs');
const yaml = require('js-yaml');
const dotenv = require('dotenv');
dotenv.config();
let vm_name = process.env.vm_name;
class Builder{
    async mac(job_name, build_path){

        child.execSync(`ansible-playbook ${build_path} --tags "${job_name}" -i inventory`,{stdio: ['inherit', 'inherit', 'inherit']});
    }
    async windows(job_name, build_path)
    {
        console.log(job_name);
        child.execSync(`echo`)
        // child.execSync(`bakerx run  ${vm_name} focal`, {stdio: 'inherit'});
        child.execSync(`ansible-playbook ~/commands/build.yml --tags "${job_name}" -i inventory`);
        child.execSync(`ansible-playbook ~/commands/build.yml --list-tags -i inventory`);
        child.execSync(`ansible-playbook ~/commands/build.yml  --list-tasks -i inventory`);
        // child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2003 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && sudo apt-get update -y"`, {stdio: 'inherit'});
        // child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2003 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && sudo apt-get install nodejs -y"`, {stdio: 'inherit'});
        // child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2003 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && sudo apt-get install mysql-server -y"`, {stdio: 'inherit'});
        // child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2003 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && sudo apt-get install wget -y"`, {stdio: 'inherit'});
        // child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2003 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && sudo apt-get install openjdk-11-jdk -y"`, {stdio: 'inherit'});
        // child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2003 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && sudo apt-get install maven -y"`, {stdio: 'inherit'});
        // child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2003 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && "wget https://github.ncsu.edu/engr-csc326-staff/iTrust2-v10"`, {stdio: 'inherit'});
        // console.log("itrust cloning completed")
    }
}
module.exports = new Builder();