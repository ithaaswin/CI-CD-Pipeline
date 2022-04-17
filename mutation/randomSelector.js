var fs = require('fs');
var files = fs.readdirSync(process.argv[2]);

var js_files_in_directory = []
for(let i=0; i < files.length; i++){
    if(files[i].split('.')[1] == 'js'){
        let b="index.js"
        let result=strcmp(files[i], b);
        if(result===0){
            continue
        }
        js_files_in_directory.push(files[i])

    }
}
function strcmp(a, b) {
    if (a.toString() < b.toString()) return -1;
    if (a.toString() > b.toString()) return 1;
    return 0;
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
