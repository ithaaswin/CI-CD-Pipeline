const chalk = require('chalk');
const path = require('path');
const os = require('os');
const got = require('got');
const http = require('http');
const httpProxy = require('http-proxy');
var counter =0;
exports.command = 'serve';
exports.desc = 'Run traffic proxy.';
exports.builder = yargs => {};

exports.handler = async argv => {
    const { } = argv;

    (async () => {

        await run( );

    })();

};
let dropletsList=["droplet-blue", "droplet-green"]
var blue_info_json = fs.readFileSync(dropletsList[0]+'.json');
var ip_blue=JSON.parse(blue_info_json).ip;
var green_info_json = fs.readFileSync(dropletsList[1]+'.json');
var ip_green=JSON.parse(green_info_json).ip

const BLUE  = 'http://'+ip_blue+':8080';
const GREEN = 'http://'+ip_green+':8080';

class Production
{
    constructor()
    {
        this.TARGET = GREEN;
        setInterval( this.healthCheck.bind(this), 5000 );
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
        this.TARGET = GREEN;
        else
            this.TARGET = BLUE;
    counter =0;
   }

   async healthCheck()
   {
      try 
      {
         const response = await got(this.TARGET, {throwHttpErrors: false});
         let status = response.statusCode == 200 ? chalk.green(response.statusCode) : chalk.red(response.statusCode);
         counter++;
         if( response.statusCode==500 || counter >=5)
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