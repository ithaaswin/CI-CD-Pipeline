const child  = require("child_process");
const VBoxManage = require('../lib/VBoxManage');
const fs = require('fs');
const yaml = require('js-yaml');
const dotenv = require('dotenv');
dotenv.config();
let vm_name = process.env.vm_name;
class Builder{
    async mac(job_name, build_path){

        console.log('Entered handler properly');

        // child.execSync(`vm exec ${vm_name}sudo timedatectl set-local-rtc 1`,{stdio: ['inherit', 'inherit', 'inherit']});
    
        // child.execSync(`vm exec ${vm_name} sudo apt-get remove initramfs-tools`,{stdio: ['inherit', 'inherit', 'inherit']});
        // child.execSync(`vm exec ${vm_name} sudo apt-get clean`,{stdio: ['inherit', 'inherit', 'inherit']});
        // child.execSync(`vm exec ${vm_name} sudo apt-get install initramfs-tools`,{stdio: ['inherit', 'inherit', 'inherit']});
    
        // child.execSync(`sudo apt-get update`,{stdio: ['inherit', 'inherit', 'inherit']});
        // child.execSync(`sudo apt-get install software-properties-common`,{stdio: ['inherit', 'inherit', 'inherit']});
        // child.execSync(`sudo add-apt-repository --yes --update ppa:ansible/ansible`,{stdio: ['inherit', 'inherit', 'inherit']});
        // child.execSync(`sudo apt-get install ansible`,{stdio: ['inherit', 'inherit', 'inherit']});
    
        const obj = yaml.load(fs.readFileSync(`${build_path}`), {encoding: 'utf-8'});
        console.log(obj);
        for (let i=0; i<obj.setup.length; i++){
            child.execSync(`vm exec ${vm_name} '${obj.setup[i]}'`,{stdio: ['inherit', 'inherit', 'inherit']});
        }
    
        // child.execSync(`vm exec ${name} sudo apt-get update`,{stdio: ['inherit', 'inherit', 'inherit']});
   
    
    
    // npm install js-yaml
    
    // $ sudo apt update
    // $ sudo apt install software-properties-common
    // $ sudo add-apt-repository --yes --update ppa:ansible/ansible
    // $ sudo apt install ansible
    
    // sudo apt remove initramfs-tools
    // sudo apt clean
    // sudo apt install initramfs-tools
    
    
    // sudo hwclock --hctosys 
    }
    async windows(job_name, build_path)
    {
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2005 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && sudo apt-get update -y"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2005 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && sudo apt-get install nodejs -y"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2005 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && sudo apt-get install mysql-server -y"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2005 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && sudo apt-get install wget -y"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2005 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && sudo apt-get install openjdk-11-jdk -y"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2005 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && sudo apt-get install maven -y"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2005 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "ls / && "wget https://github.ncsu.edu/engr-csc326-staff/iTrust2-v10"`, {stdio: 'inherit'});

    }
}
module.exports = new Builder();