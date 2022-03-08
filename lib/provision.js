const child  = require("child_process");
const VBoxManage = require('../lib/VBoxManage');
var fs = require('fs');

const dotenv = require('dotenv');
const { async } = require("hasbin");
dotenv.config();
let ip_address = process.env.ip_address;
let ip_address_config = process.env.ip_address_config;
var jsonData={}
let vm_name = process.env.vm_name;
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
        console.log('Virtual Machine name -->', vm_name)
        child.execSync(`bakerx run  ${vm_name} focal --ip ${ip_address} --sync`, {stdio: 'inherit'});
        child.execSync(`bakerx run  ${process.env.vm_name_config} focal --ip ${ip_address_config} --sync`, {stdio: 'inherit'});
        let state = await VBoxManage.show(name);
        console.log(`VM is currently: ${state}`);
        let info_cmd = `bakerx ssh-info --format config ${name}`
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
        newData = {
            "Host": vm_name,
            "HostName": process.env.ip_address,
            "User": data["user"],
            "keyPath": data["IdentityFile"]
        }
        }
        jsonData= JSON.stringify(newData);
        await this.writeToJson();
        child.execSync(`ssh-keygen -t rsa -b 4096 -C "${process.env.vm_name_config}" -f ${process.env.vm_name_config} -N ""`, {stdio: 'inherit'});
        console.log('This below output is inside the config server')
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2003 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "cp /bakerx/second_dummy .ssh/second_dummy"`, {stdio: 'inherit'});
        console.log('This is setting public key inside the web server ntg bug pj')
        child.execSync(`ssh -q -i "~/.bakerx/insecure_private_key" -p 2002 -o StrictHostKeyChecking=no vagrant@127.0.0.1 "cat /bakerx/second_dummy.pub >> .ssh/authorized_keys"`, {stdio: 'inherit'});
        
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