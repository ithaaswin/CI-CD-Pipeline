const axios    = require("axios");
const child  = require("child_process");
const chalk  = require('chalk');
const fs = require('fs');
const dotenv = require('dotenv');
const vmSSH =require("./vmSSH");
dotenv.config();
let key_name=process.env.vm_name
var config = {};
const arr=[]
let dict={}
config.token = process.env.DROPLET_TOKEN;
let processor = 'abcd'
if( !config.token ){
	console.log(chalk`{red.bold DROPLET_TOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

console.log(chalk.green(`Your token is: ${config.token.substring(0,4)}...`));

// Configure our headers to use our token when making REST api requests.
const headers = {
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};


class DigitalOceanProvider{
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
	async keygen(){
		let check_for_key = await this.check_if_key_exists(key_name);
        let key_exist = check_for_key[0]
        let private_key_path = check_for_key[1]
        let public_key_path = check_for_key[2]

        if (key_exist){
            child.execSync(`rm -f ${private_key_path}`);
            child.execSync(`rm -f ${public_key_path}`);
        }
		child.execSync(`ssh-keygen -t rsa -b 4096 -C "${key_name}" -f ${key_name} -N ""`, {stdio: 'inherit'});
		// paste it to home/vagrant/.ssh for windows
		// paste it to home/ubuntu/.ssh for mac 
		
		await vmSSH.execute(processor, false, `cp /bakerx/${key_name} .ssh/${key_name}`)
        //await vmSSH.execute(processor, true, `"cat /bakerx/"${process.env.key_name}".pub >> .ssh/authorized_keys"`)
		let key = fs.readFileSync(`${key_name}.pub`, 'utf8')
		key=key.trim()
		var data={
			"name": key_name, 
			"public_key":key
		};
		console.log("adding ssh public key to droplet " + JSON.stringify(data) );

		let response = await axios.post("https://api.digitalocean.com/v2/account/keys", 
		data, {
			headers:headers,
		}).catch( err => 
		 	console.error(chalk.red(`failed to add shh Key: ${err}`)) 
		 );
		
		 if( !response ) return;
		
		 if(response.status == 201){
			//console.log(response)
			 arr[0]=response.data.ssh_key.id
			 arr[1]=response.data.ssh_key.fingerprint
		 	console.log(chalk.green(`ssh key id is ${response.data.ssh_key.id}`));
		 	console.log(chalk.green(`fingerprint ${response.data.ssh_key.fingerprint}`));
		 }
        
	}
	async createDroplet (dropletName, region, imageName ){
        var dropletName = process.env.droplet_name;
        var region = "nyc1";
	    var imageName = "ubuntu-21-10-x64";
		
        console.log(chalk.cyan("------------Create Droplet------------"));
		if( dropletName == "" || region == "" || imageName == "" ){
			console.log( chalk.red("You must provide non-empty parameters for createDroplet!") );
			return;
		}
		console.log(arr)
		var data = {
			"name": dropletName,
			"region":region,
			"size":"s-1vcpu-1gb",
			"image":imageName,
			"ssh_keys":arr,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};
		console.log(data)
		console.log("Attempting to create: "+ JSON.stringify(data) );

		let response = await axios.post("https://api.digitalocean.com/v2/droplets", 
		data, {
			headers:headers,
		}).catch( err => 
			console.error(chalk.red(`createDroplet: ${err}`)) 
		);

		if( !response ) return;

		if(response.status == 202){
			console.log(chalk.green(`Created droplet id ${response.data.droplet.id}`));
		}
        
        let infoResponse = await axios.get(`https://api.digitalocean.com/v2/droplets/${response.data.droplet.id}`, {headers:headers,})
		.catch(err => console.error(`dropletInfo ${err}`));
        if( !infoResponse ) return;

		if( infoResponse.data.droplet ){
			let droplet = infoResponse.data.droplet;

			droplet.networks.v4.forEach(i => {
				if(i.type == 'public'){
                    var inventoryDic = {
                        "DropletID": response.data.droplet.id,
                        "ip": i.ip_address
                    }
					dict=inventoryDic;
					
                    var inventoryData = JSON.stringify(inventoryDic);
                    fs.writeFileSync("inventory.JSON", inventoryData); 
                    console.log("data saved to inventory.JSON");
                    console.log(inventoryData);
                }
            })
		}
		// to check whether we can ssh into droplet from vm
		//await vmSSH.execute(processor, false, `ssh -i ~/.ssh/${key_name}  root@${dict.ip}`) 
	}
}
module.exports = new DigitalOceanProvider();