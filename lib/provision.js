const child  = require("child_process");
const VBoxManage = require('../lib/VBoxManage');
var fs = require('fs');
var jsonData={}

class Builder{
    async mac(name){

        try{child.execSync(`vm stop ${name}`,{stdio: 'pipe'});}
        catch{}
        try{child.execSync(`vm rm ${name}`,{stdio: 'pipe'});}
        catch{}
        child.execSync(`vm run ${name} ubuntu:focal`,{stdio: 'inherit'});
        let info = child.execSync(`vm ssh-config ${name}`).toString();

        let info_dic = {};
        var temp;
        info = info.trim();
        info = info.split("\n");

        for(let i=0; i<info.length; i++){
            temp = info[i].trim();
            temp = temp.split(' ');
            info_dic[temp[0]] = temp[1];
        }
        info_dic['path'] = "~/Library/'Application Support'/basicvm/key";
        console.log(info_dic);
        jsonData= JSON.stringify(info-disc);
        this.writeToJson();
    }
    async windows(name)
    {
        child.execSync(`bakerx run  ${name} focal`, {stdio: 'inherit'});
        let state = await VBoxManage.show(name);
        console.log(`VM is currently: ${state}`);
        console.log(`VM is currently: ${state}`);
        let info_cmd = 'bakerx ssh-info --format config pj'
        const info = child.execSync(info_cmd).toString();
        let data={}
        console.log("Info", info)
        let info_split = info.split("\n");
        for(let i=0; i<info_split.length; i++){
            if(i!=0){
                let temp = info_split[i].split(' ')
                if(temp.length == 6){
                    let key = temp[4]
                    let value = temp[5]
                    data[key] = value
                }
            }
        }
        console.log('information after retrieving', data)
        jsonData= JSON.stringify(data);
        this.writeToJson();
    }

    async writeToJson(){
        fs.writeFile("config.JSON", jsonData, function(err) {
            if (err) {
                console.log(err);
            }  
            console.log("data saved to config.JSON")      
        });
    }
}
module.exports = new Builder();