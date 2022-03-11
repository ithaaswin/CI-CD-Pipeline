# Pipeline-Template
| Readme Loc | Git Link |
| ----- | ----- |
| [Automatically provision and configure a build server (20%)](#provision_tag) | [Click Here]() |
| [Create a build job specification (20%)](#buildjob_tag) | [Click Here]() |
| [Automatically configure a build environment for given build job specification (30%)](#buildenv_tag) | [Click Here]() |
| [Checkpoint and milestone report (20%)](#milestone_tag) | [Click Here]() |
| [Screencast (10%)](#screencast_tag) | [Click Here() ]|


<a name = "provision_tag"></a>
## Automatically provision and configure a build server

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
*   

<a name = "screencast_tag"></a>