var fs = require('fs');
var math = require('Math')
var files = fs.readdirSync('C:/Users/haris/Desktop/devops/DEVOPS-14');

var js_files_in_directory = []
for(let i=0; i < files.length; i++){
    if(files[i].split('.')[1] == 'js'){
        js_files_in_directory.push(files[i])

    }
}

js_json = {}

for(let j=0; j < js_files_in_directory.length; j++){
    js_json[j] = js_files_in_directory[j]
}


random_key = Object.keys(js_json)[Object.keys(js_json).length * Math.random() << 0]

console.log(js_files_in_directory[random_key]);