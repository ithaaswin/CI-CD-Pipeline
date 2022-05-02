const fs = require('fs');
const SSH =require("./SSH");
const dotenv = require('dotenv');
dotenv.config();
var ip;

class Monitor{

    async dropletMonitor(processor,homePage,port){
        var monitor_info_json = fs.readFileSync('inventory.json');
        monitor_info_json = JSON.parse(monitor_info_json)
        ip = monitor_info_json["monitor"].ip
        var configJSON = fs.readFileSync('config.json');
        var sharedPath = JSON.parse(configJSON).sharedPath;

        await SSH.executeVM(processor, `scp -i ~/.ssh/${process.env.vm_name}  -o StrictHostKeyChecking=no  -o UserKnownHostsFile=/dev/null -r ${sharedPath}/inventory.json root@${ip}:`, ip);
        await SSH.executeVM(processor, `scp -i ~/.ssh/${process.env.vm_name}  -o StrictHostKeyChecking=no  -o UserKnownHostsFile=/dev/null -r ${sharedPath}/scripts/seige.sh root@${ip}:`, ip);
        await SSH.executeVM(processor, `scp -i ~/.ssh/${process.env.vm_name}  -o StrictHostKeyChecking=no  -o UserKnownHostsFile=/dev/null -r ${sharedPath}/lib/serve.js root@${ip}:`, ip);
        await SSH.executeVM(processor, `scp -i ~/.ssh/${process.env.vm_name}  -o StrictHostKeyChecking=no  -o UserKnownHostsFile=/dev/null -r ${sharedPath}/lib/first.js root@${ip}:`, ip);
        await SSH.executeVM(processor, `scp -i ~/.ssh/${process.env.vm_name}  -o StrictHostKeyChecking=no  -o UserKnownHostsFile=/dev/null -r ${sharedPath}/scripts/cloud.sh root@${ip}:`, ip);
        await SSH.executeDroplet(processor, `dos2unix cloud.sh seige.sh`, ip)
        await SSH.executeDroplet(processor, `sudo chmod 600 seige.sh`, ip)
        await SSH.executeDroplet(processor, `sudo chmod 600 cloud.sh`, ip)
        await SSH.executeDroplet(processor, `sudo bash cloud.sh`, ip);
        await SSH.executeDroplet(processor, `node first.js ${homePage} ${port}`, ip);
    }
} module.exports = new Monitor();