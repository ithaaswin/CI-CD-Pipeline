const chalk = require('chalk');
const SSH =require("./SSH");
const fs = require('fs');
const got = require('got');
const http = require('http');
const httpProxy = require('http-proxy');
var BLUE='a';
var GREEN='b';
var url='';

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
    async loadProxy(processor, homePage)
    {   
        console.log("setting up  BLUE, GREEN AND TARGET")
        var configJSON = fs.readFileSync('config.json');
        var sharedPath=JSON.parse(configJSON).sharedPath
        // console.log("loading init")
        let dropletsList=["droplet-blue", "droplet-green"]
        var blue_info_json = fs.readFileSync(dropletsList[0]+'.json');
        var ip_blue=JSON.parse(blue_info_json).ip;
        var green_info_json = fs.readFileSync(dropletsList[1]+'.json');
        var ip_green=JSON.parse(green_info_json).ip
        BLUE  = 'http://'+ip_blue+':8080/';
        GREEN = 'http://'+ip_green+':8080/';
        this.TARGET = GREEN;     
        await SSH.executeVM(processor, `sudo cp ${sharedPath}/scripts/seige.sh .`);
        await SSH.executeVM(processor, `sudo chmod 600 seige.sh`)
        // end of initialization
        console.log("Monitoring the System")
        
        for(let i = 1;i <= 20;i++)
        {
            // console.log("health check iteration",i)
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.healthCheck()
            if((i%5) == 0)
             {
                url=this.TARGET+homePage;
                SSH.executeVM(processor, `sudo bash ~/seige.sh "${url}"`);
               
             } 
            
        }

        // let counter=0
        // let timer=setInterval(function(){ 
        //     //this code runs every secondf
        //     counter++;
        //     // await new Promise(resolve => setTimeout(resolve, 3000));
        //     this.healthCheck();
        //     if((counter) ==5)
        //      {
        //         url=this.TARGET+'iTrust2-10/login';
        //         SSH.executeVM(processor, `sudo bash ~/seige.sh "${url}"`);
        //      } 
            
        // }, 1000);
        // setTimeout(() => { clearInterval(timer); }, 10000);
        // console.log("end monitor") 
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
                   console.log(chalk.green("failover switchin target to :",this.TARGET))
             }
             },1000)
          response = await got(this.TARGET, {throwHttpErrors: false});
          let status = response.statusCode == 200 ? chalk.green(response.statusCode) : chalk.red(response.statusCode);
         //  if(this.TARGET==GREEN && response.statusCode==500)
         if(response.statusCode==500)
          {
            //   console.log("500")
              this.failover();
          }
          console.log( chalk`{grey Health check on ${this.TARGET}}: ${status}`);
       }
       catch (error) {
          console.log(error);
       }
     //   await new Promise(resolve => setTimeout(resolve, 2000));
    //    console.log("outside healthcheck")
    }
    
    failover(){
        if(this.TARGET == BLUE){
            this.TARGET = GREEN;
        } else{
            this.TARGET = BLUE
        }
    }

    // TASK 1: 
    proxy(){
        // console.log("inside proxy")
        
        // this.monitor()
        let options = {};
        let proxy   = httpProxy.createProxyServer(options);
        let self = this;
        // Redirect requests to the active TARGET (BLUE or GREEN)
        let server  = http.createServer(function(req, res)
        {
            // console.log("this.Target is :",self.TARGET)
            proxy.web( req, res, {target: self.TARGET } );
        });
        server.listen(3090);
        // console.log("end of proxy")
   }
  
    async run(){
    console.log(chalk.keyword('pink')('Starting proxy on localhost:3090'));
    this.proxy();
   }
}


module.exports = new Production();