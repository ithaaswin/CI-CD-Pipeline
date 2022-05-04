const fs = require('fs');
const yaml = require('js-yaml');
const dpkg = require("./dpkg");
const SSH =require("./SSH");
const dotenv = require('dotenv');
dotenv.config();

class Builder{
    async execCoverage(processor, jobName, buildFile){
        let build_file =`yaml/${buildFile}`;
        const ymlFile = yaml.load(fs.readFileSync(build_file, 'utf8'));
        let yamlFile = JSON.stringify(ymlFile);
        yamlFile = JSON.parse(yamlFile);
        var configJSON = fs.readFileSync('config.json');
        var sharedPath=JSON.parse(configJSON).sharedPath;
        let jobs = yamlFile.jobs;

        await dpkg.vmUnlocker(processor);
        for(let i=0; i< jobs.length;i++){
            let steps = jobs[i].steps;
            steps = JSON.stringify(steps);
            steps = JSON.parse(steps);
            
            if(jobs[i].name == jobName){
                var app = jobName.trim("-");
                for(let j = 0; j < steps.length; j++){
                    let cmd = steps[j].run;
                    cmd = cmd.replace("{{threshold}}", jobs[i].threshold);
                    await SSH.executeVM(processor, cmd);
                }
                await SSH.executeVM(processor, `cp ${sharedPath}/scripts/${jobs[i].tool}.sh .`);
                await SSH.executeVM(processor, `dos2unix ${jobs[i].tool}.sh`);
                await SSH.executeVM(processor, `cp ${sharedPath}/scripts/mail.py .`);
                await SSH.executeVM(processor, `sudo bash ${jobs[i].tool}.sh "${process.env.toAddress}" "${process.env.fromAddress}" "${process.env.mailToken}" "${jobs[i].coverageLoc}" "${jobs[i].coverageFile}" "${sharedPath}" "${jobs[i].threshold}" "${app[0]}"`);
            }
        }
    }
} module.exports = new Builder();