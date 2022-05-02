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


class Production {
    
    async loadProxy(homePage,port){   
        console.log("setting up  BLUE, GREEN AND TARGET")
        var monitor_info_json = fs.readFileSync('inventory.json');
        monitor_info_json=JSON.parse(monitor_info_json)
        var ip_blue=monitor_info_json["droplet-blue"].ip
        console.log(chalk.red("blue ips is", ip_blue))
        var ip_green=monitor_info_json["droplet-green"].ip
        console.log(chalk.red("green ip is", ip_green))
        
        BLUE  = 'http://'+ip_blue+':'+port+'/';
        GREEN = 'http://'+ip_green+':'+port+'/';
        this.TARGET = GREEN;   
        console.log("BLUE  is", BLUE)
        console.log("GREEN is", GREEN)  
        console.log("TARGET is", this.TARGET)
        console.log("Monitoring the System")
        
        for(let i = 1;i <= 10;i++){
            this.healthCheck()
            if(((i == 5)) && (this.TARGET == GREEN)){
                url=this.TARGET+homePage;
                console.log(chalk.red("execute seige to stress test the droplet on ", url))
                child.execSync(`sudo bash ~/seige.sh > /dev/null 2>&1 "${url}"`)
             } 
             await new Promise(resolve => setTimeout(resolve, 3000));
        }
        server.close()  
    }
   
    async healthCheck(){
        try {
            var response=null
            setTimeout(()=>{
                if(response == null){
                    this.failover()
                    console.log("*********************************************************");
                    console.log("Droplet failed, switching target to :", this.TARGET)
                    console.log("*********************************************************");
                }
            },5000)
            response = await got(this.TARGET, {throwHttpErrors: false});
            let status = response.statusCode == 200 ? chalk.green(response.statusCode) : chalk.red(response.statusCode);

            if(response.statusCode!=200){
                this.failover();
            }
            console.log( chalk`{grey Health check on ${this.TARGET}}: ${status}`);
        } catch (error) {
            console.log(error);
        }
    }
    
    failover(){
        if(this.TARGET == GREEN){
            this.TARGET = BLUE;
        } 
    }

    proxy(){
        let options = {};
        let proxy   = httpProxy.createProxyServer(options);
        let self = this;
        server  = http.createServer(function(req, res){
            proxy.web( req, res, {target: self.TARGET } );
        });
        server.listen(3590);
   }
    
    async run(){
        console.log(chalk.keyword('pink')('Starting proxy on localhost:3590'));
        this.proxy();
    }
} module.exports = new Production();