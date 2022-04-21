// var fs = require('fs');
// var files = fs.readdirSync(process.argv[2]);
// /*******************************************************************************/
// const ignoreFiles = ["index.js"]; // Add the js files to be ignored here
// /*******************************************************************************/
// var js_files_in_directory = []
// for(let i=0; i < files.length; i++){
//     if(files[i].split('.')[1] == 'js'){
//         let file=files[i]
//         if (ignoreFiles.indexOf(file) >= 0) {
//             continue;
//          }
//         js_files_in_directory.push(files[i])

//     }
// }
// js_json = {}

// for(let j=0; j < js_files_in_directory.length; j++){
//     js_json[j] = js_files_in_directory[j]
// }


// function getRandomInt(max) {
//     return Math.floor(Math.random() * max);
// }

// random_key = getRandomInt(js_files_in_directory.length)

// console.log(js_files_in_directory[random_key]);



const fs = require("fs")
const path = require("path")
// var files = fs.readdirSync(process.argv[2]);

const getAllFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    // console.log(file)
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
    
  })
  
  finalJs = []

  arrayOfFiles.forEach(function(eachFile){
    if(eachFile.split('.')[1] == 'js'){
        finalJs.push(eachFile)
    }

  })
  
  return finalJs
}
console.log()
all_javascript_files = getAllFiles('C:/Users/haris/Desktop/DEVOPS-14/', [])
console.log(all_javascript_files)


var ignore_files_list = fs.readFileSync('C:/Users/haris/Desktop/files_ignore.txt').toString().split("\n");
for(i in ignore_files_list) {
    console.log(ignore_files_list[i]);
}

diff = all_javascript_files.filter(x => !ignore_files_list.includes(x) );

console.log('diff', diff);


const randomElement = all_javascript_files[Math.floor(Math.random() * all_javascript_files.length)];

console.log(randomElement)