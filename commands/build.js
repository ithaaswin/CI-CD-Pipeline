const chalk = require("chalk");
// const path = require("path");
const vm_ssh =require("../lib/builder")
exports.command = 'build <job_name> <build_path>';
exports.desc = 'runs the build command and executes the job from given file';

exports.handler = async argv => {
    const{job_name, build_path, processor} = argv;
    console.log(job_name);
    console.log(build_path);
    console.log(processor);
    if(processor == 'Arm64' ) {            
        vm_ssh.mac(job_name, build_path);
    } 
    else {
        vm_ssh.windows(job_name, build_path);   
    }
};