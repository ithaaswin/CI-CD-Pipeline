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
    if(processor == 'Arm64' ) {            
        await builder.mac(job_name, build_path);
    } 
    else {
        await builder.windows(job_name, build_path);   
    }
};