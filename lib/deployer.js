const child  = require("child_process");
const fs = require('fs');
const yaml = require('js-yaml');
const chalk = require("chalk");
const vmSSH =require("./SSH");
const dotenv = require('dotenv');
dotenv.config();

class Deployment{
    async deployJob(processor, jobName, buildFile){
        let mysql_pass = process.env.db_pass;
        let build_file =`lib/${buildFile}`;

        for(let i=0; i < setup.length; i++) {
            setup[i] = setup[i].replace("{{mysql_pass}}", mysql_pass);
            await vmSSH.execute(processor, setup[i])
        }

        for(let i=0; i< jobs.length;i++){
            if(jobs[i].name == jobName && jobName == "itrust-deploy"){
                let steps = jobs[i].steps;
                steps = JSON.stringify(steps);
                steps = JSON.parse(steps);

                for(let j=0;j<steps.length;j++){
                    let cmd_name = steps[j].name;
                    console.log(chalk.green(cmd_name))
                    let cmd = steps[j].run;
                    cmd = cmd.replace("{{mysql_pass}}", mysql_pass);
                    await vmSSH.execute(operation, processor, cmd)
                }
            }
        }
    }
}
module.exports = new Deployment();
