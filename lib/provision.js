const child  = require("child_process");
const VBoxManage = require('../lib/VBoxManage');
var fs = require('fs');
const dotenv = require('dotenv');
const { async } = require("hasbin");
const { dir } = require("console");
const chalk = require("chalk");
dotenv.config();
let ip_address = process.env.ip_address;
let ip_address_config = process.env.ip_address_config;
var jsonData={}
let vm_name = process.env.vm_name;
let config_vm_name=process.env.config_vm_name;
let newData={}
class Builder{
    async mac(name){

        try{child.execSync(`vm stop ${name}`,{stdio: 'pipe'});}
        catch{}
        try{child.execSync(`vm rm ${name}`,{stdio: 'pipe'});}
        catch{}
        child.execSync(`vm run ${name} ubuntu:focal`,{stdio: 'inherit'});
        let info = child.execSync(`vm ssh-config ${name}`).toString();

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
        jsonData = JSON.stringify(info_dc);
        this.writeToJson();
    }

    async windows(name)
    {
        
        let vmdata= await this.vmSetup(name,ip_address)
        let configdata=await this.vmSetup(config_vm_name, ip_address_config)       
        let newData = {
            "Host": vm_name,
            "HostName": process.env.ip_address,
            "User": vmdata["user"],
            "keyPath": `~/.ssh/vm-server`,
            "vm_port":vmdata["Port"],
            "config_port":configdata["Port"],
            "loopback_ip": '127.0.0.1'
        }
        jsonData= JSON.stringify(newData);
        await this.writeToJson();  
        let configport=configdata["Port"];
        let vmport=vmdata["Port"];
        child.execSync(`rm -f vm-server vm-server.pub`);
        console.log(chalk.green('Generating the public and private keys'));
        child.execSync(`ssh-keygen -t rsa -b 4096 -C "${keyname}" -f ${keyname} -N ""`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p ${configport} -o StrictHostKeyChecking=no ${newData.User}@${newData.loopback_ip} "cp /bakerx/vm-server .ssh/vm-server"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p ${vmport} -o StrictHostKeyChecking=no ${newData.User}@${newData.loopback_ip} "cat /bakerx/vm-server.pub >> .ssh/authorized_keys"`, {stdio: 'inherit'});
        console.log('Installing ansible inside the config server')
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p ${configport} -o StrictHostKeyChecking=no ${newData.User}@${newData.loopback_ip} "sudo add-apt-repository ppa:ansible/ansible"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p ${configport} -o StrictHostKeyChecking=no ${newData.User}@${newData.loopback_ip} "sudo apt-get update"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p ${configport} -o StrictHostKeyChecking=no ${newData.User}@${newData.loopback_ip} "sudo apt-get install ansible -y"`, {stdio: 'inherit'});
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p ${configport} -o StrictHostKeyChecking=no ${newData.User}@${newData.loopback_ip} "chmod 600 .ssh/vm-server"`, {stdio: 'inherit'});
    }

    async vmSetup(name, ipaddress)
    {
        console.log('Virtual Machine name -->', name)
        child.execSync(`bakerx run  ${name} focal --ip ${ipaddress} --sync`, {stdio: 'inherit'});
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

    async writeToJson(){
        console.log(jsonData);
        fs.writeFileSync("config.JSON", jsonData); 
        console.log("data saved to config.JSON");
        this.writeToinventory();
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
    }
}
module.exports = new Builder();