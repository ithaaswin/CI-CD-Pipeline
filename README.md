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
| [ Milestone report ](#milestone_tag) | [Click Here](#milestone_tag) |
| [M3 Tasks ](#m3_tag) | [Click Here](/lib/build.yml) |
| [Provisioning on cloud service](#provision_tag) | [Click Here](/mutation/rewrite.js) |
| [iTrust deployment job](#deployment_tag) | [Click Here](/mutation/rewrite.js) |
| [Deployment strategy](#strategy_tag) | [Click Here](/mutation/rewrite.js) |
| [Screencast ](#screencast_tag) | [Click Here](#screencast_tag)



Specify file structure what file contains what info



```MAC M1 requirements```

```text
brew
basicvm
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
droplet_name = Name_Of_DropLet
DROPLET_TOKEN = Token_From_DigitalOcean
# Please make sure no comment lines are in .env file
```
<a name = "m1_tag"></a>
## M1 fixes
 * Pull image only if it doesnt exist. We used grep to search for the ubuntu image and if it doesn't exist, we pull new image. Our changes for this can be found in [provision.js](/lib/provision.js)
* We changed build.yml from ansible-playbook format to given M1 format and performed M1 task.
* The dependency on Ansible and its requirement for pre-installation is removed completely.
* We parsed the build.yml file using [builder.js](/lib/builder.js) and the build.yml is only called using builder.js which is triggered when build command is used.
* Build logs are completely pushed into the terminal for view without any masking

```bash
pipeline init
```

```bash
pipeline build itrust-build build.yml
```

<a name = "m2_tag"></a>

## M2 Tasks
we use [screenshot.js](/mutation/screenshot.js) to capture the screenshot of a file at the given port.

<a name = "mutate_tag"></a>

## Mutate Operators
* The function [randomSelector.js](mutation/randomSelector.js) picks a file with .js extension randomly. Specific files which shouldn't be picked from the target directory can be specified in the array ignoreFiles. This includes index.js by default.
* Mutation functions are in [rewrite.js](/mutation/rewrite.js). Each function is randomly picked and each function picks an operator randomly to be applied on a selected .js file. Functions are improvised such that compilation errors are precluded.

<a name = "harness_tag"></a>

## Test harness
* The [builder.js](/lib/builder.js) file will perform the jobs based on the job name by verifiying it in [build.yml](lib/build.yml).
* The mutation is triggered by the job-name *mutation-coverage* which executes [runMutation.sh](lib/runMutation.js). The script in turn calls [mutate.sh](mutation/mutate.sh) inside the vm and so we do not ssh into vm for executing each of the commands.
* [builder.js](lib/builder.js) captures the details of mutation snapshot urls and the details of the .md file to be rendered into mutation/snapshots.json
* Original images taken before performing any mutations are stored inside [mutation/Images/original](/mutation/Images/original/)
* Mutated images are store inside [mutation/Images/mutated](/mutation/Images/mutated/) for each of the iteration.
* Difference images are stored at [mutation/Images/difference](/mutation/Images/difference/) for each of the iteration.
* If a screenshot is unable to be captured the iteration is marked as an exception and the corresponding log file is copied into the difference instead of a difference image.

<a name = "diff_tag"></a>

## Snapshot oracle and differencing
* Snapshot differences are stored in [mutation/Images/difference](/mutation/Images/difference/) 
* imageMagick is used to find the difference between the original and mutated image and store them in difference/mutation_Number.
* If a mutated image is generated, the pixel difference between the former and it's original image with a 5% fuzz is calculated.
* If one of the image is not generated, the mutation is marked as exception and if all the images are same as original, the mutation is marked to be No Change and otherwise as changed.

<a name = "mutatecoverage_tag"></a>

## mutation-coverage
* [mutation-coverage](/mutation/mutationCoverage.txt) has the final result of the mutations run.
* The detailed result of the images failed, passed or an exception for each mutation is stored into [result.json](/mutation/result.json) with the key as mutation number.
* The images generated for the job is found at Images[mutation/Images] which hold the original, mutated and the difference images for all the mutations.
* The results of the 1000 mutations ran is stored at [1000 Mutations](/1000%20Mutations). 

```bash
pipeline build mutation-coverage build.yml
```


<a name = "milestone_tag"></a>

## Checkpoint and Milestone Report

Our Task Board can be found [here](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-14/projects/2).

#### Errors and Challenges faced
* Unable to launch chromium browser -> add executablePath: '/usr/bin/chromium-browser' in screenshot.js  </br>
* To parse snapshots.json file. This was challenging as we were trying to clean data inside the bash script. Finally we sent the exact data by doing the data cleaning in js before saving data into snapshots.json
* Dpkg error. Sometimes we were facing dpkg lock error and couldn’t complete the process. We handled this by killing the dpkg processes each time before a job is run this way preventing a run time error even when a process is force stopped and restarted.
* Mysql access denied -> Fixed this issue with the help of set deb conf utils in the set up part of build.yml
* There was a issue with how the same command is being parsed by Mac and windows. This was mainly happening because of the use of quotes inside a command which cannot be avoided. Found work arounds and fixed all these issues.
* Mysql Error -> when we try to run the itrust-build , we faced access denied for user root, so we clean the build environment at the end of script by creating a new user and deleting the user at the end of the script.
* Our first approach for M2 was to sshing each command of script into the vm. This gave rise to multiple issues as the state of vm is not guarenteed after the vm is closed. Fixed this my invoking the main script only inside the vm.
* Pug error was one of the very common errors faced due to the mismatch of directories that was happening due to the reason stated above.
* Admin previleges for many commands was asked and this was giving errors even to create a file. Fixed this by running bash script as a sudo.
* The if else function was a very tricky one. We had to understand the esprima parsing very precisely. Finally were able to achieve the exact function we expected.



<a name = "m3_tag"></a>
## M3 Tasks

<a name = "provision_tag"></a>
## Provisioning on cloud service
* The [droplet.js](/lib/droplet.js) file is used to provision the instance for a target infrastructure using Digital Ocean as cloud provider. 


```bash
pipeline prod up
```

<a name = "deployment_tag"></a>
## iTrust deployment job spec

```bash
pipeline build deploy inventory itrust-deploy build.yml
```

<a name = "strategy_tag"></a>
## Deployment Strategy

<a name = "provision_tag"></a>
## Checkpoint and Milestone Report



<a name = "screencast_tag"></a>
## Screencast 
[Click Here](https://youtu.be/KBT1o8fCUys) for Screencast of MAC M1

Use this if the above is not working - https://youtu.be/KBT1o8fCUys

[Click Here](https://youtu.be/SrHMuLjhWHM) for Screencast of Windows
<br>
Link to Screencast for Windows (If above hyperlink is not working) - https://youtu.be/SrHMuLjhWHM
