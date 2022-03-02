const child  = require("child_process");
const VBoxManage = require('../lib/VBoxManage');
const fs = require('fs');
const yaml = require('js-yaml');

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
        child.execSync(`bakerx run  ${name} focal`, {stdio: 'inherit'});
        let state = await VBoxManage.show(name);
        console.log(`VM is currently: ${state}`);
        let info_cmd = 'bakerx ssh-info --format config pj'
        const info = child.execSync(info_cmd).toString();
        let data={}
        console.log("Info", info)
        let info_split = info.split("\n");
        for(let i=0; i<info_split.length; i++){
            if(i!=0){
                let temp = info_split[i].split(' ')
                if(temp.length == 6){
                    let key = temp[4]
                    let value = temp[5]
                    data[key] = value
                }
            }
        }
        jsonData= JSON.stringify(data);
        this.writeToJson();
    }
}
module.exports = new Builder();