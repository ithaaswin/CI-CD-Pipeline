const axios    = require("axios");
const child  = require("child_process");
const chalk  = require('chalk');
const fs = require('fs');
const dotenv = require('dotenv');
const vmSSH =require("./vmSSH");
dotenv.config();
const vm_name=process.env.vm_name
var config = {};
var sshData=[]
config.token = process.env.DROPLET_TOKEN;

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

	async keygen(processor){
        child.execSync(`rm -rf ${vm_name}`);
        child.execSync(`rm -rf ${vm_name}.pub`);

		child.execSync(`ssh-keygen -t rsa -b 4096 -C "${vm_name}" -f ${vm_name} -N ""`, {stdio: ['inherit', 'inherit', 'inherit']});		
		await vmSSH.execute(processor, true, `cp ~/shared/cwd/${vm_name} ~/.ssh/`);

		let key = fs.readFileSync(`${vm_name}.pub`, 'utf8')
		key = key.trim()
		var data={
			"name": vm_name, 
			"public_key": key
		};
		console.log("Adding SSH public key to droplet before creation");

		let response = await axios.post("https://api.digitalocean.com/v2/account/keys", 
		data, { headers:headers,
		}).catch( err => 
		 	console.error(chalk.red(`Failed to add SHH Key: ${err}`)) 
		 );
		
		 if( !response ) return;
		 
		 if(response.status == 201){
			 sshData[0]=response.data.ssh_key.id
			 sshData[1]=response.data.ssh_key.fingerprint
		 }
	}

	async createDroplet (){
        var dropletName = process.env.droplet_name;
        var region = "nyc1";
	    var imageName = "ubuntu-21-10-x64";
		
        console.log(chalk.cyan("------------ Create Droplet ------------"));
		if( dropletName == "" || region == "" || imageName == "" ){
			console.log( chalk.red("You must provide non-empty parameters for createDroplet!") );
			return;
		}

		var data = {
			"name": dropletName,
			"region":region,
			"size":"s-1vcpu-1gb",
			"image":imageName,
			"ssh_keys":[sshData[0]],
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};
		console.log(data)

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
			var droplet = infoResponse.data.droplet;

			droplet.networks.v4.forEach(i => {
				if(i.type == 'public'){
                    var inventoryDic = {
                        "DropletID": response.data.droplet.id,
                        "ip": i.ip_address
                    }
					
                    var inventoryData = JSON.stringify(inventoryDic);
                    fs.writeFileSync("inventory.JSON", inventoryData); 
                    console.log(`Droplet Data: ${inventoryData}`);
                }
            })
		}
	}
}
module.exports = new DigitalOceanProvider();