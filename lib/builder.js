const child  = require("child_process");
const VBoxManage = require('../lib/VBoxManage');
const fs = require('fs');
const yaml = require('js-yaml');
const chalk = require("chalk");
const dotenv = require('dotenv');
dotenv.config();




class Builder{
    async vmExecute(processor,cmd)
    {
        console.log(chalk.red(cmd))
        if(processor=='Arm64')
        child.execSync(`vm exec ${vm_name} "${cmd}"`)
        else
        {
            let configJSON = fs.readFileSync('config.json');
            let keyPath=JSON.parse(configJSON).bakerx_keyPath
            let vm_port=JSON.parse(configJSON).vm_port
            child.execSync(`ssh -q -i ${keyPath} -p ${vm_port} -o StrictHostKeyChecking=no vagrant@127.0.0.1 "${cmd}"`, {stdio: 'inherit'});
        }
       
    }
    async build_job(processor, build_path, job_name) {
       // let gituser = process.env.git_user;
        let git_token = process.env.git_token;
        //let url = process.env.itrust_url;
        let mysql_pass = process.env.db_pass;
        let build_file =`lib/${build_path}`;
        console.log(job_name)
        console.log(processor)
        try {
            const ymlfile = yaml.load(fs.readFileSync(build_file, 'utf8'));
            let jsonfile = JSON.stringify(ymlfile);
            jsonfile = JSON.parse(jsonfile);
            //setup json object
            let setup = jsonfile.setup;
            console.log(setup); 
            for(let i=0; i< setup.length; i++) {
                setup[i] = setup[i].replace("{{mysql_pass}}", mysql_pass);
                console.log(setup[i])
                await this.vmExecute(processor,setup[i])
                //child.execSync(`ssh -q -i ${keyPath} -p ${vm_port} -o StrictHostKeyChecking=no vagrant@127.0.0.1 "${setup[i]}"`, {stdio: 'inherit'});
               
            }
            let jobs = jsonfile.jobs;
            console.log(jobs)
            for(let i=0; i< jobs.length;i++){
                if (jobs[i].name == job_name){
                    console.log(typeof jobs[i].steps);                  
                    if(jobs[i].name=="mutation-coverage") {
                        let mutation = jobs[i].mutation;
                        let url=mutation.url;
                        let iterations=mutation.iterations
                        let snapshots = mutation.snapshots;                       
                       await this.vmExecute(processor,"git clone "+url)
                        console.log(iterations);                    
                        console.log(snapshots)
                        
                    }
                    else {
                        let steps = jobs[i].steps;
                        steps = JSON.stringify(steps);
                        steps = JSON.parse(steps);
                        for(let j=0;j<steps.length;j++){
                            let cmd_name = steps[j].name;
                            console.log(chalk.green(cmd_name))
                            let cmd = steps[j].run;
                            cmd =  cmd.replace("{{git_token}}", git_token);
                            cmd = cmd.replace("{{mysql_pass}}", mysql_pass);
                            await this.vmExecute(processor,cmd)
                            //await sshcmd(cmd_name, cmd, "pipeline_info.json", processor);
                           // child.execSync(`ssh -q -i ${keyPath} -p ${vm_port} -o StrictHostKeyChecking=no vagrant@127.0.0.1 "${cmd}"`, {stdio: 'inherit'});
                        }
                    } 
                }
            }


          } catch (e) {
            console.log(e);
          }
    }

}
module.exports = new Builder();
