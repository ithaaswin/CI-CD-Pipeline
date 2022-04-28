const chalk = require('chalk');
const path = require('path');
const os = require('os');

const got = require('got');
const http = require('http');
const httpProxy = require('http-proxy');
var BLUE;
var GREEN;
var count=0;
exports.command = 'serve';
exports.desc = 'Run traffic proxy.';
exports.builder = yargs => {};

exports.handler = async argv => {
    const { } = argv;

    (async () => {

        await run( );

    })();

};
//urls from json files

// const BLUE  = 'http://192.168.56.25:3000';
// const GREEN = 'http://192.168.56.30:3000';

class Production
{
    constructor()
    {
        this.TARGET = GREEN;
        setInterval( this.healthCheck.bind(this), 5000 );
    }
    async loadProxy()
    {
    let dropletsList=["droplet-blue", "droplet-green"]
    var blue_info_json = fs.readFileSync(dropletsList[0]+'.json');
    var ip_blue=JSON.parse(blue_info_json).ip;
    var green_info_json = fs.readFileSync(dropletsList[1]+'.json');
    var ip_green=JSON.parse(green_info_json).ip
    BLUE  = 'http://'+ip_blue+':8080/';
    GREEN = 'http://'+ip_green+':8080/';
    }

    // TASK 1: 
    proxy()
    {
        let options = {};
        let proxy   = httpProxy.createProxyServer(options);
        let self = this;
        // Redirect requests to the active TARGET (BLUE or GREEN)
        let server  = http.createServer(function(req, res)
        {
            // callback for redirecting requests.
            proxy.web( req, res, {target: self.TARGET } );
        });
        server.listen(3090);
   }

   failover()
   {
      if(this.TARGET == BLUE)
        this.TARGET =GREEN;
      else
      this.TARGET == BLUE
      count=0
   }

   async healthCheck()
   {
      try 
      {
         const response = await got(this.TARGET, {throwHttpErrors: false});
         let status = response.statusCode == 200 ? chalk.green(response.statusCode) : chalk.red(response.statusCode);
        //  if(this.TARGET==GREEN && response.statusCode==500)
         if(statusCode!=200 || count>=2)
         {
             this.failover();
         }
         console.log( chalk`{grey Health check on ${this.TARGET}}: ${status}`);
      }
      catch (error) {
         console.log(error);
      }
   }
   
}

async function run() {

    console.log(chalk.keyword('pink')('Starting proxy on localhost:3090'));

    let prod = new Production();
    prod.proxy();

}