const chalk = require("chalk");
// const path = require("path");
const child = require('child_process');
const fs = require('fs');
const yaml = require('js-yaml');

exports.command = 'build <job_name> <build_path>';
exports.desc = 'runs the build command and executes the job from given file';

exports.handler = async argv => {
    const vm_name = 'pj';
    const{job_name, build_path} = argv;
    console.log(job_name);
    console.log(build_path);
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
};


// npm install js-yaml

// $ sudo apt update
// $ sudo apt install software-properties-common
// $ sudo add-apt-repository --yes --update ppa:ansible/ansible
// $ sudo apt install ansible

// sudo apt remove initramfs-tools
// sudo apt clean
// sudo apt install initramfs-tools


// sudo hwclock --hctosys 