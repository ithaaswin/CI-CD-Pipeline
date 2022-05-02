#!/usr/bin/env node
const chalk = require('chalk');
const serve = require("./serve.js");

(async () => {
    var homePage = process.argv[2];
    var port=process.argv[3];
    serve.loadProxy(homePage,port);
    serve.run();
})();
