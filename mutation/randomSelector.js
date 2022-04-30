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
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
    
  })
  finalJs = []
  arrayOfFiles.forEach(function(eachFile){
    if(eachFile.split('.')[2] == 'js'){
      finalJs.push(eachFile)
    }
  })
  
  return finalJs
}

all_javascript_files = getAllFiles('/home/vagrant/checkbox.io-micro-preview/', [])
var ignore_files_list = ['index.js', 'node_modules']
all_javascript_files_new = []


for(let i=0; i < all_javascript_files.length; i++){
  temp_file = all_javascript_files[i].split('/')
  flag = true
  for(let j=0; j < ignore_files_list.length; j++){
    
    if(temp_file.includes(ignore_files_list[j])){
      
      flag = false
      break
    }
  }
  if(flag == true){
    if(! all_javascript_files_new.includes(temp_file)){
      all_javascript_files_new.push(temp_file)
    }
  } 
}


const randomElement = all_javascript_files_new[Math.floor(Math.random() * all_javascript_files_new.length)];
random_file_name = ''
for(let i = 4; i<randomElement.length; i++){
  random_file_name += randomElement[i]
  let random_file_name_length = randomElement.length
  if(! (i==random_file_name_length-1)){
    random_file_name += '/'
  }else{
    continue
  }
}
console.log(random_file_name)