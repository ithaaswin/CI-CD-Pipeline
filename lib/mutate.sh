#!/bin/bash

git clone --recursive https://github.com/chrisparnin/checkbox.io-micro-preview.git
git clone --recursive https://github.com/ruttabega/node screenshot.js.git

sudo apt-get update
sudo apt-get install -y jq npm imagemagick chromium-browser

npm install puppeteer escodegen

cd ~/checkbox.io-micro-preview
npm i
# awk '{sub("./marqdown","./marqdown-mod")}1' index.js > temp.js
# mv temp.js index.js

sudo mkdir -m 777 -p ~/images/original
sudo mkdir -m 777 -p ~/images/mutated

cd ~/checkbox.io-micro-preview
node index.js > /dev/null 2>&1 &

cd ~
node screenshot.js  http://localhost:3000/survey/upload.md ~/images/original/upload
node screenshot.js  http://localhost:3000/survey/long.md ~/images/original/long
node screenshot.js  http://localhost:3000/survey/survey.md ~/images/original/survey
node screenshot.js  http://localhost:3000/survey/variations.md ~/images/original/variations
kill -9 $! > /dev/null
wait 2>>log.txt
wait 2>>log.txt


rm -rf result.json temp1.json temp2.json log.txt
touch result.json temp1.json temp2.json
exceptionCounter=0
exceptionFlag=false
changeCounter=0

for i in {1..1}
do
        sudo rm -rf consoleLog.txt
        # ranNum=$(( 1+$RANDOM % $1 ))
        # operator=$( jq -r --arg num "$ranNum" '.[$num]' operations.json )
        node rewrite.js >> consoleLog.txt
        operator=$( cat consoleLog.txt | head -n 1 )
        sourceLine=$( cat consoleLog.txt | tail -n 1 )

        {
                cd checkbox.io-micro-preview
                node index.js > /dev/null 2>&1 &
                sudo mkdir -m 777 -p ~/images/mutated/$i

                cd ~
                { 
                        node screenshot.js  http://localhost:3000/survey/upload.md ~/images/mutated/$i/upload
                } || { 
                        exceptionFlag=true
                }
                {
                        node screenshot.js  http://localhost:3000/survey/long.md ~/images/mutated/$i/long
                } || {
                        exceptionFlag=true
                }
                {
                        node screenshot.js  http://localhost:3000/survey/survey.md ~/images/mutated/$i/survey
                } || {
                        exceptionFlag=true
                }
                {
                        node screenshot.js  http://localhost:3000/survey/variations.md ~/images/mutated/$i/variations
                } || {
                        exceptionFlag=true
                }
                
                if [ $exceptionFlag = false ]
                then
                kill -9 $! 
                wait 2>>log.txt
                wait 2>>log.txt
                cd ~
                compare -metric AE -fuzz 5% ~/images/original/upload.png ~/images/mutated/$i/upload.png null: 2>pixelDiff1
                compare -metric AE -fuzz 5% ~/images/original/long.png ~/images/mutated/$i/long.png null: 2>pixelDiff2
                compare -metric AE -fuzz 5% ~/images/original/survey.png ~/images/mutated/$i/survey.png null: 2>pixelDiff3
                compare -metric AE -fuzz 5% ~/images/original/variations.png ~/images/mutated/$i/variations.png null: 2>pixelDiff4

                pixelDiff=$(( $(head -n 1 pixelDiff1)+$(head -n 1 pixelDiff2)+$(head -n 1 pixelDiff3)+$(head -n 1 pixelDiff4) ))

                        if [ $pixelDiff -eq 0 ]
                        then
                        endResult='Not Changed'
                        else
                        endResult='Changed'
                        changeCounter=$(($changeCounter+1))
                        fi
                fi
        } || {
                exceptionFlag=true
        }

        if $exceptionFlag
        then
        endResult='Exception'
        exceptionCounter=$(($exceptionCounter+1))
        exceptionFlag=false
        fi

        json_data=$(cat <<EOF 
{"$i":{"operator": "$operator","sourceLine": "$sourceLine","result": "$endResult"}}
EOF
)
echo $json_data > temp1.json
cat result.json > temp2.json
jq -R -s add temp1.json temp2.json > result.json
echo "Mutation-$i Completed"
done

passedCounter=$((1000-$changeCounter-$exceptionCounter))
denom=$(( 1000-$exceptionCounter ))

echo "Failed Mutants: $changeCounter"
echo "Passed Mutants: $passedCounter"
echo "Exception Mutants: $exceptionCounter"
echo "Mutation Coverage: $passedCounter/$denom"
