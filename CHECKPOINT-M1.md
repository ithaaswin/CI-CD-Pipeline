markdownLinkTest
================

# Contents

- [Status](#status)
- [Contributions](#Contributions)
- [Issues faced](#Issues-faced ) 
- [Work to be done](#Work-to-be-done)
- [Screenshots](#Screenshots) 

# Status
We have implemented the below details for both M1 process and Inel processor.</br>
 We have currenty finished the stage 1 of the project, but have to optimise and stucture the code based on requirements.</br>
 For the rest of the Project, we created build.yaml file and done with the setup part of the code, we currently parsed the set up part of build.yml file as json object and installing the tools/softwares like java , maven, mysql, wget and also cloned itrust into the virtual machine.</br>
We are fetching the name of the Virtual Machine from .env file(we can simply edit it and import it from .env file).</br>
We are storing the network configuration details like host, ip address, ssh info in config.JSON file.</br>

 
# Contributions



#Issues faced





# Work to be done
 we have parsed the build.yaml file as json object and executed as script file similar to CLI, we are planning to optimise the code using Ansible</br>
 We are planning to write opunit to verify whether the installation and version checks of all the softwares required for running itrust</br>
 We have to implement the build jobs using Ansible(currently working on this>).
 We have to configure .env file with appropriate details.

# Screenshots



