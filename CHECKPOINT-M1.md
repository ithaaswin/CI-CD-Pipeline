# Link to the google doc - https://docs.google.com/document/d/1bllr1XzT1ITnWrJLnlQhKb7howaiI0E-bwBZg5gBw6s/edit

-- Aswin
For MAC - M1

Error -- Basicvm was not detected when init file was run
Fix -- changed the binary name from basicvm to vm in the init file

Error -- .env file missing
Fix -- Created .env file in the main repo

Error -- When the vm with a name is already existing, new vm is not created and process is stopped
Fix -- Introduced new lines to stop and delete the old vm with same name

Enhancement -- When the vm with the default name is not available, it is spitting vm no available in to the console
Fix -- Used 'pipe' to avoid pushing the default lines.




