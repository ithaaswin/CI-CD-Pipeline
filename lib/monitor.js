const fs = require('fs');
const yaml = require('js-yaml');
const chalk = require("chalk");
const SSH =require("./SSH");
const dotenv = require('dotenv');
dotenv.config();
var ip='';

class Monitor{
    //copy .json files into monitor vm
    //inventory file
    async init(processor)
    {
    // let dropletsList=["droplet-blue", "droplet-green", "monitor"]
    // blue=dropletsList[0]+'.JSON'
    // green=dropletsList[1]+'.JSON'
    // var monitorJson=dropletsList[2]+'.JSON'
     var monitor_info_json = fs.readFileSync('inventory.json');
     monitor_info_json=JSON.parse(monitor_info_json)
     ip=monitor_info_json["monitor"].ip
    //  console.log(chalk.red("ips is", ip))
    var configJSON = fs.readFileSync('config.json');
    var sharedPath=JSON.parse(configJSON).sharedPath
    //copy .json files into monitor vm
     await SSH.executeVM(processor, `cp ${sharedPath}/inventory.json ~/.ssh/`);
    //  await SSH.executeVM(processor, `cp ${sharedPath}/${green} ~/.ssh/`);
    //
    // copy siege.sh
    await SSH.executeVM(processor, `cp ${sharedPath}/scripts/seige.sh ~/.ssh/`);
    //copy serve.js file
    await SSH.executeVM(processor, `cp ${sharedPath}/lib/serve.js ~/.ssh/`);
    // copy index.js file
    await SSH.executeVM(processor, `cp ${sharedPath}/lib/first.js ~/.ssh/`);
    //copy cloud.sh file
    await SSH.executeVM(processor, `cp ${sharedPath}/scripts/cloud.sh ~/.ssh/`);
   
    }
    async Monitordroplet(processor,homePage,port)
    {
        await SSH.executeVM(processor, `scp -i ~/.ssh/${process.env.vm_name}  -o StrictHostKeyChecking=no  -o UserKnownHostsFile=/dev/null -r ~/.ssh/inventory.json root@${ip}:`, ip);
        // await SSH.executeVM(processor, `scp -i ~/.ssh/${process.env.vm_name}  -o StrictHostKeyChecking=no  -o UserKnownHostsFile=/dev/null -r ~/.ssh/${green} root@${ip}:`, ip);
        await SSH.executeVM(processor, `scp -i ~/.ssh/${process.env.vm_name}  -o StrictHostKeyChecking=no  -o UserKnownHostsFile=/dev/null -r ~/.ssh/seige.sh root@${ip}:`, ip);
        await SSH.executeVM(processor, `scp -i ~/.ssh/${process.env.vm_name}  -o StrictHostKeyChecking=no  -o UserKnownHostsFile=/dev/null -r ~/.ssh/serve.js root@${ip}:`, ip);
        await SSH.executeVM(processor, `scp -i ~/.ssh/${process.env.vm_name}  -o StrictHostKeyChecking=no  -o UserKnownHostsFile=/dev/null -r ~/.ssh/first.js root@${ip}:`, ip);
        await SSH.executeVM(processor, `scp -i ~/.ssh/${process.env.vm_name}  -o StrictHostKeyChecking=no  -o UserKnownHostsFile=/dev/null -r ~/.ssh/cloud.sh root@${ip}:`, ip);

    
     //first execute cloud.sh
    await SSH.executeDroplet(processor, `sudo chmod 600 seige.sh`, ip)
    await SSH.executeDroplet(processor, `sudo chmod 600 cloud.sh`, ip)
    await SSH.executeDroplet(processor, `sudo bash cloud.sh`, ip);

    //then run index.js file which runs serve.js file
    await SSH.executeDroplet(processor, `node first.js ${homePage} ${port}`, ip);

    
    }
}
module.exports = new Monitor();