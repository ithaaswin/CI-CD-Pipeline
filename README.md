# Pipeline-Template
| Readme Loc | Git Link |
| ----- | ----- |
| [env file](#env_file) |[Click Here](#env_file) |
| [M1 fixes](#m1_tag) | [Click Here](/lib/build.yml) |
| [M2 Tasks ](#m2_tag) | [Click Here](/lib/build.yml) |
| [Mutate Operators](#mutate_tag) | [Click Here](/mutation/rewrite.js) |
| [Test harness](#harness_tag) | [Click Here](/mutation/mutate.sh) |
| [Snapshot oracle and differencing](#diff_tag) | [Click Here](/mutation/mutate.sh) |
| [mutation-coverage](#mutatecoverage_tag) | [Click Here](/mutation/mutationcoverage.txt) |
| [ Challenges and Errors ](#milestone_tag) | [Click Here](#milestone_tag) |
| [Screencast ](#screencast_tag) | [Click Here](#screencast_tag)

Specify file structure what file contains what info
```MAC M1 requirements```
```text
brew
basicvm
Ubuntu:Jammy Image
```
``` bash
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" # To install brew
$ brew install ottomatica/ottomatica/basicvm          # To install basicvm
```
```Windows/MAC Intel requirements```
```text
Choco
Virtual box
Nodejs
Bakerx
Npm
```
<a name = "env_file"></a>
```.env file```
```bash
# Add the following env variables for any OS
vm_name = Name_Of_VM                # Ex: vm-server
git_token = Git_Token               # Ex: 123adsfh32jjhg
db_pass = 12345                     # set the password of mysql 

# Add the following for Windows and MAC Intel
ip_address = 192.168.52.100         # Any ip can be assigned
memory = 4096                       # RAM to be assigned for vm --Recommended to use atleast 4GB
# Please make sure no comment lines are in .env file
```
<a name = "m1_tag"></a>
## M1 fixes
 * pull image only if it doesnt exist--> For this we used grep to search for the ubuntu focal image, if it doesnt exist, pull new image. else if the image exist, dont pull image and create the virtual machine. check out changes in [Provision.js](/lib/provision.js)
* we changed build.yml from ansible format to specified format and performed M1 task.</br>
 	We have modified the code in such a way that there is no requirement of ansible installation and inventory file</br>
	we parsed the build.yml file using [builder.js](/lib/builder.js). we ssh into the vm and execute the cmnds from [build.yml](/lib/build.yml) </br>
	We parse the build.yml as json object and execute the cmnds inside the vm

```bash
pipeline init
```
```bash
pipeline build itrust-build build.yml
```
<a name = "m2_tag"></a>

## M2 Tasks
we use [screenshot.js](/mutation/screenshot.js) to capture the screenshot of the file at the given port.
<a name = "mutate_tag"></a>
## Mutate Operators
*   We have defined all types of mutation operators in [rewrite.js](/mutation/rewrite.js) based on requirements  to be performed on any given .js file(randomly selected from mutate.sh).
*   This javascript file will select a random mutation operator and performs the mutation on the selected .js file

<a name = "harness_tag"></a>

## Test harness

*	we perform the mutation  by executing [mutate.sh](/mutation/mutate.sh) and the  images are store in mutation/images/ folder.
*	we generate the orignal snapshots from the url defined in build.yml, we can add more number of urls in build.yml.
*	The [builder.js](/lib/builder.js) file will perform the jobs based on the provided job name by verifiying it in <<build.yml link>>.
* 	original images are stored inside [original](/mutation/Images/original/) folder
* 	mutated images are store inside [mutated](/mutation/Images/mutated/) folder
*   differences in images are stored in [difference](/mutation/Images/difference/) folder

 For mutation-coverage, the builder.js  will capture the details of mutation snapshot urls and  writes to snapshot.json file and will execute the lib/mutation/mutate.sh script

The mutate.sh will</br>
		
*   it will clone the [microservice](https://github.com/chrisparnin/checkbox.io-micro-preview) 

*   capture original snapshots from the urls retrieved from snapshot.json by using the index.js service and save to  [original](/mutation/Images/original/) and kill the service
*   Now for every iteration, it will execute [randomSelector.js](/mutation/randomSelector.js) and picks up a random js file from the given location and mutates the js file by performing a random mutation  by executing the rewrite.js

<a name = "diff_tag"></a>

## Snapshot oracle and differencing
snapshot differences are stored inside [difference](/mutation/Images/difference/) folder
*   we use imageMagick to find the difference between the original and mutated image and store them in differences folder.
if they have differences, we calculate pixel differences between the images and decide if the image is changed or not. Based on the output we categorise it as changed or not.
if there is an exception, the exception log will be stored in the difference folder

<a name = "mutatecoverage_tag"></a>

## mutation-coverage
For every mutation, the results are stored into [result.json](/mutation/result.json).
For simplicity we have uploaded the 1000 mutation images and the results and mutation-coverage are uploaded inside a new folder (/1000 Mutations/).
*  It stores the .js file which should be mutated and the mutation operator. Along with this, the result.JSON will also store the source line and the changes made and also it stores the result of the mutation on the snapshot. i.e., whether the snapshot has been changed, not changed or exception.
The final mutation coverage details are stored in [mutation-coverage](/mutation/mutationCoverage.txt)

```bash
pipeline build mutation-coverage build.yml
```
<a name = "milestone_tag"></a>

## Challenges and Errors

### Challenges Faced:

Our issues can be found [here](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-14/issues).
We faced challenges to parse the snapshot urls from build.yml in shell script, when we tried to dynamically import the urls from job names. We used jq module to get over from this challenge.parsing snapshot.json file </br>
we faced challenges to set my sql password in application.yml--> we use sed command to set password
### Errors
*   unable to launch chromium browser--> we faced this issue only with windows, for mac it was working fine. To resolve this we have  added executablePath: '/usr/bin/chromium-browser' in screenshot.js for the chromium browser path </br>
*   Dpkg error->Sometimes we are facing dpkg lock error and  couldn’t complete the process, we edited the script(function call for dpkg) to kill the existing dpkg process </br>
*   Mysql access denied -> we fixed this issue with the help of set deb conf utils in the set up part of build.yml
*   Mysql Error -> when we try to run the itrust-build , we faced access denied for user root, so we clean the build environment at the end of script by creating a new user and deleting the user at the end of the script.


<a name = "screencast_tag"></a>
## Screencast 
[Click Here](https://youtu.be/KBT1o8fCUys) for Screencast of MAC M1

Use this if the above is not working - https://youtu.be/KBT1o8fCUys

[Click Here](https://youtu.be/SrHMuLjhWHM) for Screencast of Windows
<br>
Link to Screencast for Windows (If above hyperlink is not working) - https://youtu.be/SrHMuLjhWHM
