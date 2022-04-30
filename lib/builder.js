const fs = require('fs');
const yaml = require('js-yaml');
const chalk = require("chalk");
const SSH =require("./SSH");
const dotenv = require('dotenv');
dotenv.config();


class Builder{

    async build_job(processor, job_name, build_path) {
        let git_token = process.env.git_token;
        let mysql_pass = process.env.db_pass;
        var configJSON = fs.readFileSync('config.json');
        let build_file =`lib/${build_path}`;
        var sharedPath=JSON.parse(configJSON).sharedPath
        var user=JSON.parse(configJSON).User

        const ymlFile = yaml.load(fs.readFileSync(build_file, 'utf8'));
        let yamlFile = JSON.stringify(ymlFile);
        yamlFile = JSON.parse(yamlFile);
        let setup = yamlFile.setup;
        let jobs = yamlFile.jobs;
        await SSH.executeVM(processor, `sudo apt-get update`)
        await SSH.executeVM(processor, `sudo apt-get install dos2unix`)
        await SSH.executeVM(processor, `sudo cp -rp ${sharedPath}/scripts/dpkgUnlocker.sh .`)
        await SSH.executeVM(processor, `sudo dos2unix dpkgUnlocker.sh`)
        await SSH.executeVM(processor, `sudo bash dpkgUnlocker.sh "/home/${user}"`);
        
        for(let i=0; i < setup.length; i++) {
            setup[i] = setup[i].replace("{{mysql_pass}}", mysql_pass);
            await SSH.executeVM(processor, setup[i])
        }

        for(let i=0; i< jobs.length;i++){
            
            if(jobs[i].name == job_name){
                
                if(typeof jobs[i].mutation !== 'undefined'){
                    var mutation = jobs[i].mutation;
                    var url = mutation.url;
                    var iterations = mutation.iterations
                    var snapshots = mutation.snapshots;
                    
                    await this.renderSnapshot(snapshots);
                    await SSH.executeVM(processor, `sudo cp -rp ${sharedPath}/mutation/. .`);
                    await SSH.executeVM(processor, `sudo bash ~/mutate.sh "${url}" "${sharedPath}" "${iterations}" "${user}"`);
                } else{
                    let steps = jobs[i].steps;
                    steps = JSON.stringify(steps);
                    steps = JSON.parse(steps);
                    
                    for(let j=0;j<steps.length;j++){
                        let cmd_name = steps[j].name;
                        console.log(chalk.green(cmd_name));
                        let cmd = steps[j].run;
                        cmd =  cmd.replace("{{git_token}}", git_token);
                        cmd = cmd.replace("{{mysql_pass}}", mysql_pass);
                        cmd = cmd.replace("{{shared_path}}", sharedPath);
                        await SSH.executeVM(processor, cmd);
                    }
                } 
            }
        }
    }


    async renderSnapshot(snapshots){
        var urlList =[]

        for(let j=0; j<snapshots.length; j++){
            var list={};
            var snapName = snapshots[j].split("/").pop().split('.')[0];
            list["name"] = snapName;
            list["url"] = snapshots[j];
            urlList.push(list);
        }

        var jsonData={"snaps":urlList}
        jsonData = JSON.stringify(jsonData);
        fs.writeFileSync('mutation/snapshots.json', jsonData);
    }
}
module.exports = new Builder();
