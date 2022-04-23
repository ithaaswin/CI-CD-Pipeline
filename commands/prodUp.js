exports.command = 'prod up';
exports.desc = 'Creates a droplet and saves the instances information in inventory';
const droplet =require("../lib/droplet")


exports.builder = yargs => {
    yargs.options({
    });
};

exports.handler = async argv => {
    const { processor } = argv;
    await droplet.keyGen(processor);
    await droplet.createDroplet();
};