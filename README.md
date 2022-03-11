# Pipeline-Template
| Readme Loc | Git Link |
| ----- | ----- |
| [Automatically provision and configure a build server (20%)](#provision_tag) | [Click Here]() |
| [Create a build job specification (20%)](#buildjob_tag) | [Click Here]() |
| [Automatically configure a build environment for given build job specification (30%)](#buildenv_tag) | [Click Here]() |
| [Checkpoint and milestone report (20%)](#milestone_tag) | [Click Here]() |
| [Screencast (10%)](#screencast_tag) | [Click Here]()|


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
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"                                        # To install brew
$ brew install ottomatica/ottomatica/basicvm          # To install basicvm
$ vm pull                                             # To install Ubuntu:Jammy image -- Downloads to ~/.basicvm/BaseImages/Ubuntu/Jammy
$ brew install ansible                                # To Install Ansible
$ ansible-galaxy collection install community.mysql   # To install mysql module for playbook
```

```.env```
```bash
# Add the following env variables for any OS
vm_name = Name_Of_VM
git_user = Name_Of_GitUser          # Ex: wolf@ncsu.edu
git_token = Git_Token               # Ex: 123adsfh32jjhg

# Add the following for Windows and MAC Intel
ip_address = 192.168.52.100         # Any ip can be assigned
config_vm_name = Config_VM_Name
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
is used to provision and configure a build server.
The init script calls provision.js and a build server is configured.

For MAC M1, nameserver is added to the /etc/resolv.conf so that a connection with ports.ubuntu.com can be established.

```bash
pipeline build itrust-build lib/build.yml
```
[click here]() to check init.js

[click here]() to check provision.js

<a name = "buildjob_tag"></a>

## Create a build job specification

The build.yml file has all the setup and job specifications required to be run inside the build server. Tag 'itrust-build' is assigned for setting up itrust and running the application.

[Click here]() to check build.yml

<a name = "buildenv_tag"></a>

## Automatically configure a build environment for given build job specification

```bash
pipeline build itrust-build lib/build.yml
```

The above command calls build.js which calls builder.js and execute the jobs defined in build.yml targeting build server.

[Click here]() to check build.yml

<a name = "milestone_tag"></a>

## Checkpoint and Milestone Report

### Challenges Faced:

Our Task Board can be found [here]().

The CHECKPOINT.md file submitted for this milestone is available [here]().
##### For MAC M1
*   Installing Ansible on MAC M1 was simple but Ansible was throwing different errors than when using json file and to parse and running commands on build server.
*   Initially Ansible was running build.yml smoothly. Then [package not found error]() started appearing. The error was not self explanatory as the error was sporadic and root cause was not found.
*   Sometimes [DPKG was locked]() and Ansible couldn't complete installation process. This happened because before dpkg was released after an installation another package was trying to access it.
*   [DPKG process captured]() happens if I force quit build server while an installtion is happening. Manually to resolve this, we need to find the PID capturing the dpkg and force stop the proces.
*   Finally to resolve the above errors, I found that one of the reasons was that my build server was not able to contact [ports.ubuntu.com](). This is one of the prime reasons why the package missing was also occuring. I was stuck at this point for about 3 full days. There were not really helpful resources available even online on this issue as this is happening only with MAC M1.
*   I tried to automate the process of updating nameserver in init.js but the resolv.conf is being re-written once the ssh command execution is complete and the process is ending.
*   Used Ansible playbook to finish this process. This is exclusive to MAC M1.
*   Sometimes faced dpkg locked error even before the first process is executed. So, automated the process of removing lock whenever build.yml is called.
*   Made sure that each time a init is ran, a new vm instance is created. If an old vm with same name is available, it is removed without any user interruption.

<a name = "screencast_tag"></a>

[Click Here]() for Screencast of MAC M1

[Click Here]() for Screencast of Windows