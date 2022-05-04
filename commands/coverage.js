exports.command = 'coverage <job_name> <build_path>';
exports.desc = 'e-mails the code coverage';
const code = require("../lib/codeCov");
exports.builder = yargs => {
    yargs.options({
    });
};
exports.handler = async argv => {
    const{job_name, build_path, processor} = argv;
    await code.execCoverage(processor, job_name, build_path);
};