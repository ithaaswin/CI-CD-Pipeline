Team 14  --> CheckPoint
================

# Contents

- [Status](#stat)
- [Contributions](#Contrib)
- [Issues faced](#Issue) 
- [Work to be done](#tobedone)
- [Screenshots](#Screen) 

<a name="stat"></a>
# Status
We have implemented the below details for both M1 process and Inel processor.</br>
 We have currenty finished the stage 1 of the project, but have to optimise and stucture the code based on requirements.</br>
 For the rest of the Project, we created build.yaml file and done with the setup part of the code, we currently parsed the set up part of build.yml file as json object and installing the tools/softwares like java , maven, mysql, wget and also cloned itrust into the virtual machine.</br>
We are fetching the name of the Virtual Machine from .env file(we can simply edit it and import it from .env file).</br>
We are storing the network configuration details like host, ip address, ssh info in config.JSON file.</br>
Performed code optimization to structure the code into appropriate files and reducded code redundancy.

The status of our tasks, issues and discussions can be found at [Project Board](https://github.ncsu.edu/CSC-DevOps-S22/DEVOPS-14/projects/1)


<a name="Contrib"></a>
# Contributions
We coordinated and discussed abouts task to be peformed and the blueprint to perform them. We Seggregated the tasks and did our best to finish as much as possible.
We used Project boards to ditribute tasks and to perform them.
Responsibilties
Anil Kumar Yalla, Harish Hasti-->implementing windows/Intel version of the project
Aswin Itha-->Implementing the Mac M1 version of the Project.
Even though we seggregated the tasks to an extenstion but we were always coordinated and been assisting each other to implement project requirements.


<a name="Issue"></a>
# Issues faced


Issues faced for Intel Processor</br>
1)Package.json file was missing some module for pipeline init--> error "Pipeline not recognised"--> made corrections based on previous references available.</br>
2).env file not detected-->created and saved .env file</br>
3)git issues for push and commit as multiple people are working on same files--> coordinated and merged changes using git branch and git stash</br>
4)Fetching and arranging network data from bakerx to dictionary and exporting it to config.Json--> faced issues and added config.JSon to git ignore as it is dynamic and not required</br>
5)detecting os and call the specific createVM machine </br>
6)when we assign vm name to a variable"name" , we are getting name clash with "js-yaml" to avoid we used vm_name, and trying to push it to env file</br>

Issues faced for M1 processor</br>
1)Basicvm was not detected when init file was run-->Fix -- changed the binary name from basicvm to vm in the init file</br>

2)Error -- .env file missing -->Fix -- Created .env file in the main repo</br>

3)Error -- When the vm with a name is already existing, new vm is not created and process is stopped. -->Fix -- Introduced new lines to stop and delete the old vm with same name.</br>

4)Error -- When the vm with the default name is not available, it is spitting vm no available in to the console. --> Fix -- Used 'pipe' to avoid pushing the default lines.</br>

5)Error -- There was a TimeZone difference error when trying to download or even update the apt package as shown below.</br>
<img src="/Pictures/Errors/TimeZone.png" width="700" height="400" ></br>

Fix -- Resolved this using the command:</br>
vm exec pj 'sudo apt-get -o Acquire::Check-Valid-Until=false -o Acquire::Check-Date=false update'</br>

But this error is repeating each time a new vm is created.</br>

6)Error -- Process Captured Error happening when build is re executed. Not happening for a new vm. Yet to find the root cause for this issue.</br>

<img src="/Pictures/Errors/Process%20Captured%20Error.png" width="700" height="400"></br>


<a name="tobedone"></a>
# Work to be done
 we have parsed the build.yaml file as json object and executed as script file similar to CLI, we are planning to optimise the code using Ansible</br>
 We are planning to write opunit to verify whether the installation and version checks of all the softwares required for running itrust</br>
 We have to implement the build jobs using Ansible(currently working on this>).
 We have to configure .env file with appropriate details.


<a name="Screen"></a>
# Screenshots
Intel Processor/Windows Os</br>
1)Pipeline Init Success and saving configuration details to config.JSON</br>
<img src="https://media.github.ncsu.edu/user/22767/files/e109ed65-49db-41e3-b7f2-dda10003d88c" width="700" height="400"></br>
2) Pipeline Build screenshot indicating Installation of Tools/itrust clone in Virtual machine.(Not done completely).</br>
<img src="https://media.github.ncsu.edu/user/22767/files/0a1d03f2-76b5-445c-93a1-5e700e862970" width="700" height="400"></br>
3) Screenshot showing versions of software</br>
<img src="https://media.github.ncsu.edu/user/22767/files/ebd938da-a062-458b-994f-854f5580c16e" width="700" height="400"></br>

M1 processor</br>
1)Successfully ran init and configuration is being saved into config.json and vm is created.</br>
<img src="/Pictures/Success/init.png" width="700" height="400"></br>

2)Able to run the set up and install the iTrust inside the vm. Jobs are need to be fully defined to finish the project.</br>
<img src="/Pictures/Success/iTrustInstalled.png" width="700" height="400"></br>










