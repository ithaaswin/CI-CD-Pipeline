const builder =require("../lib/builder")
exports.command = 'build <job_name> <build_path>';
exports.desc = 'runs the build command and executes the job from given file';
exports.builder = yargs => {
    yargs.options({
    });
};
exports.handler = async argv => {
    const{job_name, build_path, processor} = argv;
    console.log('Job Name', job_name);
    console.log(build_path);
    console.log(processor);
    await builder.build_job(processor, build_path, job_name);
    
};