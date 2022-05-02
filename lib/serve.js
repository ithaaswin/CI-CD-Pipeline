const chalk = require('chalk');
// const SSH =require("./SSH");
const fs = require('fs');
const got = require('got');
const http = require('http');
const httpProxy = require('http-proxy');
const child = require("child_process");
var BLUE='a';
var GREEN='b';
var url='';
var server;
exports.command = 'serve';
exports.desc = 'Run traffic proxy.';
exports.builder = yargs => {};

exports.handler = async argv => {
    const { } = argv;

    (async () => {

        await run( );

    })();

};


class Production
{
    
    //load blue and green
    async loadProxy(homePage,port)
    {   
        console.log("setting up  BLUE, GREEN AND TARGET")
        var monitor_info_json = fs.readFileSync('inventory.json');
        monitor_info_json=JSON.parse(monitor_info_json)
        var ip_blue=monitor_info_json["droplet-blue"].ip
        console.log(chalk.red("blue ips is", ip_blue))
        var ip_green=monitor_info_json["droplet-green"].ip
        console.log(chalk.red("green ip is", ip_green))
        // var configJSON = fs.readFileSync('config.json');
        // var sharedPath=JSON.parse(configJSON).sharedPath
        // console.log("loading init")
        BLUE  = 'http://'+ip_blue+':'+port+'/';
        GREEN = 'http://'+ip_green+':'+port+'/';
        this.TARGET = GREEN;   
        console.log("BLUE  is", BLUE)
        console.log("GREEN is", GREEN)  
        console.log("TARGET is", this.TARGET)
        // await SSH.executeVM(processor, `sudo cp ${sharedPath}/scripts/seige.sh .`);
        // await SSH.executeVM(processor, `sudo chmod 600 seige.sh`)
        // end of initialization
        console.log("Monitoring the System")
        
        for(let i = 1;i <= 10;i++)
        {
            // console.log("health check iteration",i)
            
            this.healthCheck()
            
            if(((i == 5)) && (this.TARGET == GREEN))
            // if((i%8)==0)
             {
                url=this.TARGET+homePage;
                console.log(chalk.red("execute seige to stress test the droplet on ", url))
                // SSH.executeVM(processor, `sudo bash ~/seige.sh "${url}"`);
                child.execSync(`sudo bash ~/seige.sh > /dev/null 2>&1 "${url}"`)
               
             } 
             await new Promise(resolve => setTimeout(resolve, 3000));
            
        }
        server.close()

       
    }

    
   
    async healthCheck()
    {
       try 
       {
        //  console.log("inside health")
         var response=null
         setTimeout(()=>{
             if(response==null){
                // console.log(chalk.red("late response"))
                  this.failover()
                   console.log("*********************************************************");
                   console.log("Droplet failed, switching target to :", this.TARGET)
                   console.log("*********************************************************");
             }
             },5000)
          response = await got(this.TARGET, {throwHttpErrors: false});
          let status = response.statusCode == 200 ? chalk.green(response.statusCode) : chalk.red(response.statusCode);
         //  if(this.TARGET==GREEN && response.statusCode==500)
         if(response.statusCode!=200)
          {
            //    console.log("500")
              this.failover();
          }
          console.log( chalk`{grey Health check on ${this.TARGET}}: ${status}`);
       }
       catch (error) {
          console.log(error);
       }
     //   await new Promise(resolve => setTimeout(resolve, 2000));
    //    console.log("outside healthcheck")s
    }
    
    failover(){
        if(this.TARGET == GREEN){
            this.TARGET = BLUE;
        } 
        // else{
        //     this.TARGET = GREEN
        // }
    }
    // TASK 1: 
    proxy(){
        // console.log("inside proxy")
        
        // this.monitor()
        let options = {};
        let proxy   = httpProxy.createProxyServer(options);
        let self = this;
        // Redirect requests to the active TARGET (BLUE or GREEN)
        server  = http.createServer(function(req, res)
        {
            // console.log("this.Target is :",self.TARGET)
            proxy.web( req, res, {target: self.TARGET } );
        });
        server.listen(3590);
        
        // console.log("end of proxy")
   }
    async run(){
    console.log(chalk.keyword('pink')('Starting proxy on localhost:3590'));
    this.proxy();
   }
}


module.exports = new Production();