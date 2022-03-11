const child  = require("child_process");
const VBoxManage = require('../lib/VBoxManage');
var fs = require('fs');
const dotenv = require('dotenv');
const chalk = require("chalk");
dotenv.config();
let ip_address = process.env.ip_address;
let ip_address_config = process.env.ip_address_config;
var jsonData={}
let vm_name = process.env.vm_name;
let config_vm_name=process.env.config_vm_name;
var mac = false;

class Builder{
    async mac(){
        
        mac = true;
        try{child.execSync(`vm stop ${vm_name}`,{stdio: 'pipe'});}
        catch{}
        try{child.execSync(`vm rm ${vm_name}`,{stdio: 'pipe'});}
        catch{}
        child.execSync(`vm run ${vm_name} ubuntu:jammy`,{stdio: 'inherit'});
        
        let info = child.execSync(`vm ssh-config ${vm_name}`).toString();
        let info_dic = {};
        var temp;
        info = info.trim();
        info = info.split("\n");

        for(let i=0; i<info.length; i++){
            temp = info[i].trim();
            temp = temp.split(' ');
            info_dic[temp[0]] = temp[1];
        }

        info_dic['keyPath'] = "~/Library/'Application Support'/basicvm/key";
        jsonData = JSON.stringify(info_dic);
        console.log('Before going to json');
        await this.writeToJson();
    }

    async windows(name)
    {
        console.log(chalk.green(`Windows machine detected and processor is Intel/AMD`))
        let vmdata = await this.vmSetup(name,ip_address)
        let configdata = await this.vmSetup(config_vm_name, ip_address_config)       
        let newData = {
            "Host": vm_name,
            "HostName": process.env.ip_address,
            "User": vmdata["user"],
            "keyPath": `~/.ssh/${process.env.key_name}`,
            "bakerx_keyPath": vmdata['IdentityFile'],
            "vm_port":vmdata["Port"],
            "config_port":configdata["Port"],
            "loopback_ip": '127.0.0.1'
        }
        jsonData= JSON.stringify(newData);
        await this.writeToJson();  
        let configport=configdata["Port"];
        let vmport=vmdata["Port"];
        let check_for_key = await this.check_if_key_exists(process.env.key_name);
        let key_exist = check_for_key[0]
        let private_key_path = check_for_key[1]
        let public_key_path = check_for_key[2]

        if (key_exist){
            child.execSync(`rm -f ${private_key_path}`);
            child.execSync(`rm -f ${public_key_path}`);
        }
        console.log(chalk.green('Generating the public and private keys'));
        child.execSync(`ssh-keygen -t rsa -b 4096 -C "${process.env.key_name}" -f ${process.env.key_name} -N ""`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i ${newData.bakerx_keyPath} -p ${configport} -o StrictHostKeyChecking=no ${newData.User}@${newData.loopback_ip} "cp /bakerx/"${process.env.key_name} ".ssh/"${process.env.key_name}"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i ${newData.bakerx_keyPath} -p ${vmport} -o StrictHostKeyChecking=no ${newData.User}@${newData.loopback_ip} "cat /bakerx/"${process.env.key_name}".pub >> .ssh/authorized_keys"`, {stdio: 'inherit'});
        console.log('Installing ansible inside the config server')
        child.execSync(`ssh -q -i ${newData.bakerx_keyPath} -p ${configport} -o StrictHostKeyChecking=no ${newData.User}@${newData.loopback_ip} "sudo add-apt-repository ppa:ansible/ansible"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i ${newData.bakerx_keyPath} -p ${configport} -o StrictHostKeyChecking=no ${newData.User}@${newData.loopback_ip} "sudo apt-get update"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i ${newData.bakerx_keyPath} -p ${configport} -o StrictHostKeyChecking=no ${newData.User}@${newData.loopback_ip} "sudo apt-get install ansible -y"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i ${newData.bakerx_keyPath} -p ${configport} -o StrictHostKeyChecking=no ${newData.User}@${newData.loopback_ip} "chmod 600 .ssh/"${process.env.key_name}`, {stdio: 'inherit'});
    }

    async vmSetup(name, ipaddress)
    {
        console.log('Virtual Machine name -->', name)
        child.execSync(`bakerx run  ${name} focal --ip ${ipaddress} --sync --memory ${process.env.memory}`, {stdio: 'inherit'});
        let state = await VBoxManage.show(name);
        console.log(`VM is currently: ${state}`); 
        var info_cmd = `bakerx ssh-info --format config ${name}`;
        const info = child.execSync(info_cmd).toString();
        let data={}
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
        return data
    }

    async check_if_key_exists(keyname){
        const fs = require("fs");
        var dir_split = __dirname.split('\\');
        dir_split = dir_split.splice(0, dir_split.length-1).join('/');
        let path_public_key = `${dir_split}/${keyname}.pub`
        let path_private_key = `${dir_split}/${keyname}`
        if (fs.existsSync(path_private_key) && fs.existsSync(path_public_key)) {
            return [true, path_private_key, path_public_key]
        }else{
            return [false, path_private_key, path_public_key]
        }
    }

    async writeToJson(){
        console.log(jsonData);
        fs.writeFileSync("config.JSON", jsonData); 
        console.log("data saved to config.JSON");
        await this.writeToinventory();
    }

    async writeToinventory(){
        let configData = fs.readFileSync('config.json');
        configData = JSON.parse(configData);
        var logger = fs.createWriteStream('inventory');
        logger.write('[web]\n');
        logger.write(`${configData.HostName} ansible_ssh_user=${configData.User} ansible_ssh_private_key_file=${configData.keyPath}\n`);
        logger.write('[web:vars]\n');
        logger.write(`ansible_ssh_common_args='-o StrictHostKeyChecking=no'\n`);
        logger.write(`ansible_python_interpreter=/usr/bin/python3`);
        
        if (mac){

            console.log('Updating the cache. Takes less than a minute');
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            await delay(30000);
            await child.execSync(`ansible-playbook lib/build.yml --tags "nameserver" -i inventory`,{stdio: 'inherit'});
        }
    }
}
module.exports = new Builder();
