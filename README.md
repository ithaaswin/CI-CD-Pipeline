# Final Project
| Readme Loc | Git Link |
| ----- | ----- |
| [env file](#env_file) | [Click Here](#env_file) |
| [Pipeline Jobs](#pipeJobs) | [Click Here](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-14/tree/F0-aitha/lib) |
| [New Feature](#newFeature) | [Click Here](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-14/blob/F0-aitha/lib/codeCov.js) |
| [Challenges faced](#challenges_tag) | [Click Here](#challenges_tag) |
| [Screencast ](#screencast_tag) | [Click Here](https://youtu.be/p7b0XkFlZeg)

```MAC M1 requirements```

```text
brew
basicvm
```

``` bash
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" # To install brew
$ brew install ottomatica/ottomatica/basicvm          # To install basicvm
```

<a name = "env_file"></a>

## env File
```.env file```
```bash
vm_name = Name_Of_VM                # Ex: vm-server
git_token = Git_Token               # Ex: 123adsfh32jjhg
db_pass = 12345                     # set the password of mysql 
droplet_name=drops                  # name for the SSH KEY to be placed inside the digital ocean
DROPLET_TOKEN = dp_ac8be7da.......es  # droplet token genereated from digital ocean
toAddress = ToAddress@gmail.com       # To Address to which code coverage report is to be sent
fromAddress = FromAddress@gmail.com   # From Address to be used for coverage report
mailToken = abcdefghi                 # Token from mail app (Generated using From Address)

# Please make sure no comment lines are in .env file
```
To Generate mail Token use this [link](https://security.google.com/settings/security/apppasswords)

<a name = "pipeJobs"></a>

## Pipeline Jobs

### Application-1

Source code can be found [here](https://github.com/anvesh-lp/RecepieApp.git)

It is a spring boot application

Application Running can be verified at: dropletID:8080/RecepieApp-0.0.1-SNAPSHOT/

```bash
pipeline init
pipeline build recepie-build buildRecepie.yml
pipeline build recepie-test buildRecepie.yml
pipeline coverage recepie-coverage buildRecepie.yml
pipeline prod up
pipeline deploy inventory recepie-deploy buildRecepie.yml
```

### Application-2

Source code can be found [here](https://github.com/OwenKelvin/Angular-School-Management-System.git)

It is an Angular Application with nodeJS

Application running can be verified at: dropletID

```bash
pipeline init
pipeline build school-build buildSchool.yml
pipeline build school-test buildSchool.yml
pipeline coverage school-coverage buildSchool.yml
pipeline prod up
pipeline deploy inventory school-deploy buildSchool.yml
```
```init``` creates a vm

Creates a new vm with the name given in the .env file

```build app-build buildApp.yml``` Builds the application

Clones the application and adds patch and builds the application

```build app-test buildApp.yml``` Tests the application

Tests on the application is run and displays the results

```coverage app-coverage buildApp.yml``` Finds the Code Average

Finds code coverage and mails the report the email on .env

```deploy inventory app-deploy buildApp.yml``` Deploys the Application

Deploys the application to the production

<a name = "newFeature"></a>

## New Feature - Code Coverage

```coverage app-coverage buildApp.yml```

A new job has been defined to find the code coverage of the application. The threshold in build.yml determine's if coverage is success or failure. The result can be seen in AppNamePermission.JSON file. The report of the code coverage is sent via email. It also describes whether you can proceed with deployment or not.
In the event of code coverage not upto the threshold and the user trying to deploy it, the application will terminate with a message informing the same.
SpringBoot applications use jacoco to generate the code coverage while Angular uses ng --code-coverage to find the code coverage.

A sample of mail generated is:

<img src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-14/blob/F0-aitha/Pictures/mailSample.jpeg" width="400" >
<img src="https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-14/blob/F0-aitha/Pictures/mailSample2.jpeg" width="400" >

<a name = "challenges_tag"></a>

## Challenges Faced

* It was challenging to write the code coverage function agnostic to the type of application used.
* Rather than deploying the application it was tough to find a proper application that had test cases.
* The deployed application was causing trouble when new application was being deployed.
* Quotations were causing major problem where sometimes it broke the command and sometimes not.

<a name = "screencast_tag"></a>

## Screencast 

[Click Here](https://youtu.be/p7b0XkFlZeg) for Screencast of MAC M1
