#!/bin/bash

# $1 - URL for cloning repo
# $2 - Path of shared folder between base Machine and VM
# $3 - No of mutations to be run
# $4 - User (Ubuntu/Vagrant)

sudo cp -rp $2/mutation/mutate.sh .
sudo cp -rp $2/mutation/rewrite.js .
sudo cp -rp $2/mutation/screenshot.js .
sudo cp -rp $2/mutation/randomSelector.js .
sudo cp -rp $2/mutation/snapshots.json .