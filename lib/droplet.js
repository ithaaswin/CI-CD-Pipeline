const axios    = require("axios");
const chalk  = require('chalk');
const dotenv = require('dotenv');
dotenv.config();

var config = {};
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

	async createDroplet (dropletName, region, imageName ){
        var dropletName = process.env.droplet_name;
        var region = "nyc1";
	    var imageName = "ubuntu-21-10-x64";
		
        console.log(chalk.cyan("------------Create Droplet------------"));
		if( dropletName == "" || region == "" || imageName == "" ){
			console.log( chalk.red("You must provide non-empty parameters for createDroplet!") );
			return;
		}

		var data = {
			"name": dropletName,
			"region":region,
			"size":"s-1vcpu-1gb",
			"image":imageName,
			"ssh_keys":null,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: "+ JSON.stringify(data) );

		let response = await axios.post("https://api.digitalocean.com/v2/droplets", 
		data, {
			headers:headers,
		}).catch( err => 
			console.error(chalk.red(`createDroplet: ${err}`)) 
		);

		if( !response ) return;
		console.log(response.status);
		console.log(response.data);

		if(response.status == 202){
			console.log(chalk.green(`Created droplet id ${response.data.droplet.id}`));
		}
	}

	async dropletInfo (id){
		console.log(chalk.cyan("------------Get Droplet ip------------"));
		if( typeof id != "number" ){
			console.log( chalk.red("You must provide an integer id for your droplet!") );
			return;
		}

		// Make REST request
		let response = await axios.get(`https://api.digitalocean.com/v2/droplets/${id}`, {headers:headers,})
		.catch(err => console.error(`dropletInfo ${err}`));

		// let response = null; /// await axios.get

		if( !response ) return;

		if( response.data.droplet ){
			let droplet = response.data.droplet;

			droplet.networks.v4.forEach(i => {
				if(i.type=='public') console.log(i.ip_address,i.type)})
			
			// Print out IP address
		}
	}
}
module.exports = new DigitalOceanProvider();