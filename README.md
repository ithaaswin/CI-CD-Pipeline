# Pipeline-Template
| Readme Loc | Git Link |
| ----- | ----- |
| [Automatically provision and configure a build server (20%)](#provision_tag) | [Click Here](/lib/provision.js) |
| [Create a build job specification (20%)](#buildjob_tag) | [Click Here](/lib/build.yml) |
| [Automatically configure a build environment for given build job specification (30%)](#buildenv_tag) | [Click Here](/lib/builder.js) |
| [Checkpoint and Milestone report (20%)](#milestone_tag) | [Click Here](/README.md) |
| [Screencast (10%)](#screencast_tag) | [Click Here](#screencast_tag)|


<a name = "provision_tag"></a>
## Automatically provision and configure a build server

```MAC M1 requirements```
```text
brew
basicvm
Ubuntu:Jammy Image
Ansible
Ansible mysql module
```
``` bash
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" # To install brew
$ brew install ottomatica/ottomatica/basicvm          # To install basicvm
$ vm pull                                             # To install Ubuntu:Jammy image -- Downloads to ~/.basicvm/BaseImages/Ubuntu/Jammy
$ brew install ansible                                # To Install Ansible
$ ansible-galaxy collection install community.mysql   # To install mysql module for playbook
```
```Windows/MAC Intel requirements```
```text
Windows/Intel Requirements
Choco
Virtual box
Nodejs
Bakerx
Npm

```

```.env file```
```bash
# Add the following env variables for any OS
vm_name = Name_Of_VM                # Ex: vm-server
git_user = Name_Of_GitUser          # Ex: wolf@ncsu.edu
git_token = Git_Token               # Ex: 123adsfh32jjhg

# Add the following for Windows and MAC Intel
ip_address = 192.168.52.100         # Any ip can be assigned
config_vm_name = Config_VM_Name     # Ex:config-server
ip_address_config = Config_VM_IP    # Ex: 192.168.64.121
key_name = vm-server                # To create public and private key
memory = 2048                       # RAM to be assigned for vm --Recommended to use atleast 2GB
# Please make sure no comment lines are in .env file
```

For MAC M1, the host machine is used to directly connect with web-server and run the build file.

For Windows and Mac Intel, we create a config server and use it to connect and maintain web-server which is the end point.

```bash
pipeline init
```
When pipeline init is executed, the script will detect the processor (M1, Intel) and call the respective function to create the virtual machine(provision.js)</br>
The script will store the connection information of virtual machine is stored in config.json and will config inventory file, which will change for every init step by varying values </br>
For windows, the script will install ansible in the config server and it will generate and copies the key pair to respective paths inside the virtual machines.</br>


For MAC M1, nameserver is added to the /etc/resolv.conf so that a connection with ports.ubuntu.com can be established.</br>

```bash
pipeline build itrust-build build.yml
```
[click here](/commands/init.js) to check init.js

[click here](/lib/provision.js) to check provision.js

<a name = "buildjob_tag"></a>

## Create a build job specification

The build.yml file has all the setup and job specifications required to be run inside the build server. Tag 'itrust-build' is assigned for setting up itrust and running the application.

[Click here](/lib/build.yml) to check build.yml

<a name = "buildenv_tag"></a>
For windows: The build script executes and ssh into config server and executes the ansible playbook to install & clone the itrust and other dependencies inside the vm-server(destination).</br>
It will fetch credentials for git and sql from .env file and executes the ansible playbook, which installs dependencies and runs maven test and cleans the build environment so that no issues occur for next builds.</br>

## Automatically configure a build environment for given build job specification

```bash
pipeline build itrust-build build.yml
```

The above command calls build.js which calls builder.js and execute the jobs defined in build.yml targeting build server.

[Click here](/commands/build.js) to check build.js
[Click here](/lib/builder.js) to check builder.js

<a name = "milestone_tag"></a>

## Checkpoint and Milestone Report

### Challenges Faced:

Our Task Board can be found [here](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-14/projects/1).

Issues faced before checkpoint are [here](/CHECKPOINT-M1.md). submitted on [date]
##### For Windows(Intel/Amd) processor
*   Storing information from vm to json file was easy, but to run ansible-playbook, we have to use different ip than local loop id and also, we need to use the private public key pair generated for connecting two vms.  We have to fetch the Ip address from env file and also path of the new public key  of the destination vm required for inventory.</br>
*   We tried to install ansible for windows in multiple ways, but not found a single useful way, as it messes up with the hyper visor and results in Vbox vm error. We came up with the solution to create a new config server and scripted the code to act this config server as a new local host, which will execute the ansible playbook inside the desination or final vm. To do this we followed CM workshop as a reference.
*   Generating inventory file from config.Json initially resulted in unable to parse  the inventory error. We used logger.write to write the inventory file</br>
*   Memory issue ->while we are running, pipeline build itrust-build build.yml with vm memory as 2048, we are facing time out issue while installing maven dependencies, so we configured env variable to 4096 and executing the script.</br>
*   Dpkg error->Sometimes we are facing dpkg lock error and ansible couldn’t complete the process, we edited the script to kill the existing dpkg process </br>
*   We faced difficulties to replace the username and password in application.yml file. we used regex to find the pattern and replace it with new username and password.
*   Mysql access denied -> We faced Access denied while creating new user and editing password due to not found credentials in.my.cnf file so we copied the file to root path as it was not recognisible.
*   Mysql Error -> when we try to run the build multiple times, we faced access denied for user root, so cleaned the build environment at the end of script by creating anew user and deleting the user at the end of the script.

##### For MAC M1
*   Installing Ansible on MAC M1 was simple but Ansible was throwing different errors than when using json file and to parse and running commands on build server.
*   Initially Ansible was running build.yml smoothly. Then [package not found error](/Pictures/Errors/Package%20Matching%20-%202.png) started appearing. The error was not self explanatory as the error was sporadic and root cause was not found.
*   Sometimes [DPKG was locked](/Pictures/Errors/DPKG%20Process%20Held.png) and Ansible couldn't complete installation process. This happened because before dpkg was released after an installation another package was trying to access it.
*   [DPKG process captured](/Pictures/Errors/DPKG%20Subprocess.png) happens if I force quit build server while an installtion is happening. Manually to resolve this, we need to find the PID capturing the dpkg and force stop the proces.
*   Finally to resolve the above errors, I found that one of the reasons was that my build server was not able to contact [ports.ubuntu.com](/Pictures/Errors/Ports.png). This is one of the prime reasons why the package missing was also occuring. I was stuck at this point for about 3 full days. There were not really helpful resources available even online on this issue as this is happening only with MAC M1.
*   I tried to automate the process of updating nameserver in init.js but the resolv.conf is being re-written once the ssh command execution is complete and the process is ending.
*   Used Ansible playbook to finish this process. This is exclusive to MAC M1.
*   Sometimes faced dpkg locked error even before the first process is executed. So, automated the process of removing lock whenever build.yml is called.
*   Made sure that each time a init is ran, a new vm instance is created. If an old vm with same name is available, it is removed without any user interruption.

<a name = "screencast_tag"></a>

[Click Here]() for Screencast of MAC M1

[Click Here]() for Screencast of Windows
