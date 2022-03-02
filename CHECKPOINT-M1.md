Issues faced by windows users
.env file not detected and package json error
git issues for push and commit 
getting vm status
Arranging network data from bakerx to dictionary and exporting it to config.Json
And also for basicvm
//detecting os and call the specific createVM machine



For MAC - M1

Error -- Basicvm was not detected when init file was run
Fix -- changed the binary name from basicvm to vm in the init file

Error -- .env file missing
Fix -- Created .env file in the main repo

Error -- When the vm with a name is already existing, new vm is not created and process is stopped
Fix -- Introduced new lines to stop and delete the old vm with same name

Enhancement -- When the vm with the default name is not available, it is spitting vm no available in to the console
Fix -- Used 'pipe' to avoid pushing the default lines.

Code Optimization -- Implementing mac and windows versions code in provision file

json -- Parsed the required data and saved the details into a dictionary. Eventually this will be saved into the config.json file

Error -- There was a TimeZone difference error when trying to download or even update the apt package as shown below.
<img src="/Pictures/Errors/TimeZone.png" width="400" >

Fix -- Resolved this using the command:
vm exec pj 'sudo apt-get -o Acquire::Check-Valid-Until=false -o Acquire::Check-Date=false update'

But this error is repeating each time a new vm is created.

Error -- Process Captured Error happening when build is re executed. Not happening for a new vm. Yet to find the root cause for this issue.

<img src="/Pictures/Errors/Process%20Captured%20Error.png" width="400">

-- Successfully ran init and configuration is being saved into config.json and vm is created.
<img src="/Pictures/Success/init.png" width="400">

-- Able to run the set up and install the iTrust inside the vm. Jobs are need to be fully defined to finish the project.
<img src="/Pictures/Success/iTrustInstalled.png" width="400">
