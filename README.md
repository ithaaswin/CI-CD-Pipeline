# Pipeline-Template
| Readme Loc | Git Link |
| ----- | ----- |
| [env file](#env_file) |[Click Here](#env_file) |
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
<a name = "m3_tag"></a>
## M3 Tasks

<a name = "provision_tag"></a>
## Provisioning on cloud service
* The [droplet.js](/lib/droplet.js) file is used to provision the instance for a target infrastructure using Digital Ocean as cloud provider. 
* After creation of droplet in the Digital Ocean webiste, the infrastructure data such as droplet name, droplet id, ip address is stored in an inventory file.


```bash
pipeline prod up
```

<a name = "deployment_tag"></a>
## iTrust deployment job spec

* The [build.yml](/yaml/build.yml) has the job - itrust-deploy which is responisble to create a war file for deploying the iTrust application to the cloud instance.
* Once, the war file is generated after succesful build and been located, the dependencies such as JRE, JDK, Maven, Apache, npm, mysql are installed and the respective commands are defined in the [build.yml](/yaml/build.yml) file.

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
