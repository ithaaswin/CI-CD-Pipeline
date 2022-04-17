var fs = require('fs');
var files = fs.readdirSync(process.argv[2]);
/*******************************************************************************/
const ignoreFiles = ["index.js"]; // Add the js files to be ignored here
/*******************************************************************************/
var js_files_in_directory = []
for(let i=0; i < files.length; i++){
    if(files[i].split('.')[1] == 'js'){
        let file=files[i]
        if (ignoreFiles.indexOf(file) >= 0) {
            continue;
         }
        js_files_in_directory.push(files[i])

    }
}
js_json = {}

for(let j=0; j < js_files_in_directory.length; j++){
    js_json[j] = js_files_in_directory[j]
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

random_key = getRandomInt(js_files_in_directory.length)

console.log(js_files_in_directory[random_key]);
