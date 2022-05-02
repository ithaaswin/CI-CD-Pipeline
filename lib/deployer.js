const fs = require('fs');
const yaml = require('js-yaml');
const chalk = require("chalk");
const dpkg = require("./dpkg");
const SSH =require("./SSH");
const dotenv = require('dotenv');
dotenv.config();

class Deployment{

    async deployJob(processor, jobName,buildFile){
        var inventoryJSON = fs.readFileSync('inventory.JSON');
        inventoryJSON = JSON.parse(inventoryJSON)
        var info = [];
        for(let k in inventoryJSON){
            if(k == 'monitor'){
                await this.monitorSetup(processor,inventoryJSON[k].ip)
            } else {
                info = await this.deployDroplet(processor, jobName, buildFile, inventoryJSON[k].ip);
            }
	    }
        return info;
    }

    async monitorSetup(processor, ip){
        console.log("MonitorSetup");
        await dpkg.dropletUnlocker(processor, ip);
        await SSH.executeDroplet(processor, `sudo apt-get -qqq update -y`, ip);
        await SSH.executeDroplet(processor, `sudo apt-get -qqq install -y nodejs npm dos2unix`, ip);
    }

    async deployDroplet(processor, jobName, buildFile, ip){
        let mysql_pass = process.env.db_pass;
        let build_file =`yaml/${buildFile}`;
        var configJSON = fs.readFileSync('config.json');
        var sharedPath=JSON.parse(configJSON).sharedPath;

        const ymlFile = yaml.load(fs.readFileSync(build_file, 'utf8'));
        let yamlFile = JSON.stringify(ymlFile);
        yamlFile = JSON.parse(yamlFile);
        let setup = yamlFile.setup;
        let jobs = yamlFile.jobs;

        await dpkg.dropletUnlocker(processor, ip);
        for(let i=0; i < setup.length; i++) {
            setup[i] = setup[i].replace("{{mysql_pass}}", mysql_pass);
           await SSH.executeDroplet(processor,setup[i], ip);  
        }

        for(let i=0; i< jobs.length;i++){
            if(jobs[i].name == jobName){

                let steps = jobs[i].steps;
                steps = JSON.stringify(steps);
                steps = JSON.parse(steps);

                for(let j=0;j<steps.length;j++){
                    let cmd_name = steps[j].name;
                    console.log(chalk.green(cmd_name));
                    let cmd = steps[j].run;
                    cmd = cmd.replace("{{mysql_pass}}", mysql_pass);
                    await SSH.executeDroplet(processor, cmd, ip);
                }

                await SSH.executeVM(processor, `scp -i ~/.ssh/${process.env.vm_name}  -o StrictHostKeyChecking=no  -o UserKnownHostsFile=/dev/null -r ${sharedPath}/scripts/${jobs[i].server}.sh root@${ip}:`, ip);
                await SSH.executeDroplet(processor, `sudo bash ${jobs[i].server}.sh`, ip);
                await SSH.executeVM(processor, `scp -i ~/.ssh/${process.env.vm_name} -o StrictHostKeyChecking=no  -o UserKnownHostsFile=/dev/null -r ~/${jobs[i].sourceFileLoc} root@${ip}:${jobs[i].deployFileLoc}`);
                var info=[];
                info.push(jobs[i].homePage);
                info.push(jobs[i].port)
                return info;
            }
        }
    }
} module.exports = new Deployment();
