const axios = require("axios");
const child = require("child_process");
const chalk = require('chalk');
const fs = require('fs');
const dotenv = require('dotenv');
const SSH = require("./SSH");
dotenv.config();
const vm_name = process.env.vm_name
var sshData = [];
var headers;
var dropletName = process.env.droplet_name;
var region = "nyc1";
var imageName = 'ubuntu-20-04-x64';
class DigitalOceanProvider{
	
	constructor(){
		if( !process.env.DROPLET_TOKEN ){
			console.log(chalk`{red.bold DROPLET_TOKEN is not defined!}`);
			console.log(`Please set your environment variables with appropriate token.`);
			console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
			process.exit(1);
		}
		
		// Configure our headers to use our token when making REST api requests.
		headers = {
			'Content-Type':'application/json',
			Authorization: 'Bearer ' + process.env.DROPLET_TOKEN
		};
	}

	async keyGen(){
        child.execSync(`rm -rf ${vm_name}`);
        child.execSync(`rm -rf ${vm_name}.pub`);
		child.execSync(`ssh-keygen -t rsa -b 4096 -C "${vm_name}" -f ${vm_name} -N ""`, {stdio: ['inherit', 'inherit', 'inherit']});		
	}

	async keyToDroplet(processor){
		var configJSON = fs.readFileSync('config.json');
		var sharedPath=JSON.parse(configJSON).sharedPath;
		await SSH.executeVM(processor, `cp ${sharedPath}/${vm_name} ~/.ssh/${vm_name}`);
		await SSH.executeVM(processor, `chmod 600 ~/.ssh/${vm_name}`)

		let key = fs.readFileSync(`${vm_name}.pub`, 'utf8')
		key = key.trim()
		var data={
			"name": dropletName, 
			"public_key": key
		};
		console.log("Adding SSH public key to droplet before creation");
		let response = await axios.post("https://api.digitalocean.com/v2/account/keys", 
		data, { headers:headers,
		}).catch( err => console.error(chalk.red(`Failed to add SHH Key: ${err}`)));
		
		 if( !response ) return;
		 
		 if(response.status == 201){
			 sshData[0]=response.data.ssh_key.id
			 sshData[1]=response.data.ssh_key.fingerprint
		 }
	}
	
	async createDroplet (){
        
		let dropletsList=["droplet-blue", "droplet-green"]
		
		for(let i=0;i<dropletsList.length;i++)
		{
			await this.dropletSetup(dropletsList[i])
			// await new Promise(resolve => setTimeout(resolve, 10000));
		}
	}
	async dropletSetup(dropletserver)
	{	
		
		console.log(chalk.cyan("------------ Create Droplet ------------",dropletserver));
			if( dropletserver == "" || region == "" || imageName == "" ){
				console.log( chalk.red("You must provide non-empty parameters for createDroplet!") );
				return;
			}

			var data = {
				"name": dropletserver,
				"region":region,
				"size":"s-4vcpu-8gb",
				"image":imageName,
				"ssh_keys":[sshData[1]],
				"backups":false,
				"ipv6":false,
				"user_data":null,
				"private_networking":null
			};
			let response = await axios.post("https://api.digitalocean.com/v2/droplets",
			data, {
				headers:headers,
			}).catch( err => console.error(chalk.red(`createDroplet: ${err}`)));

			if( !response ) return;

			if(response.status == 202){
				
				let getDropResponse = await axios.get(`https://api.digitalocean.com/v2/droplets/${response.data.droplet.id}`, {headers:headers,})
				.catch(err => console.error(`dropletInfo ${err}`));
				if( !getDropResponse ) return;

				if(getDropResponse.status == 200){
					if( getDropResponse.data.droplet ){
						var droplet = getDropResponse.data.droplet;

						droplet.networks.v4.forEach(i => {
							if(i.type == 'public'){
								var inventoryDic = {
									"DropletName":dropletserver,
									"DropletID": response.data.droplet.id,
									"ip": i.ip_address
								}
								var inventoryData = JSON.stringify(inventoryDic);
								fs.writeFileSync(dropletserver+'.JSON', inventoryData); 
								console.log(chalk.green(`Droplet Data for ${dropletserver}: ${inventoryData}`));
							}
						})
					}
				}
			}
	}
}
module.exports = new DigitalOceanProvider();