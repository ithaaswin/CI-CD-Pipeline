#!/bin/bash

# $1 - URL for cloning repo
# $2 - Path of shared folder between base Machine and VM
# $3 - No of mutations to be run

repoName=$(basename $1 .git)
rm -rf $repoName
git clone --recursive $1

sudo cp -rp $2/mutation .

cd ~/mutation
sudo rm -rf result.json temp1.json temp2.json log.txt Images
touch result.json temp1.json temp2.json
sudo apt-get update
sudo apt-get install -y jq npm imagemagick chromium-browser
npm install puppeteer escodegen
sudo mkdir -m 777 -p ~/mutation/Images/original
sudo mkdir -m 777 -p ~/mutation/Images/mutated
sudo mkdir -m 777 -p ~/mutation/Images/difference

cd ~/$repoName
npm i
node index.js > /dev/null 2>&1 &
process=$!
readarray -t my_array < <(jq . /bakerx/snapshot.JSON)

cd ~/mutation
for ((i=0; i<${#my_array[@]}; i++));
do
ssname=$(basename ${my_array[$i]} .md)
node screenshot.js ${my_array[$i]}  ~/mutation/Images/original/$ssname
done
kill -9 $process > /dev/null
wait $process 2>/dev/null

exceptionCounter=0
exceptionFlag=false
changeCounter=0

for (( i=1; i<=$3; i++ ))
do
        cd ~/mutation
        sudo rm -rf rewriteLog.txt
        node rewrite.js >> rewriteLog.txt
        operator=$( cat rewriteLog.txt | head -n 1 )
        sourceLine=$( cat rewriteLog.txt | tail -n 1 )

        {
                cd ~/$repoName
                node index.js > serviceLog.txt 2>&1 &
                process=$!
                sudo mkdir -m 777 -p ~/mutation/Images/mutated/$i
                sudo mkdir -m 777 -p ~/mutation/Images/difference/$i

                cd ~/mutation
                { 
                        node screenshot.js  http://localhost:3000/survey/upload.md ~/mutation/Images/mutated/$i/upload
                } || { 
                        exceptionFlag=true
                }
                {
                        node screenshot.js  http://localhost:3000/survey/long.md ~/mutation/Images/mutated/$i/long
                } || {
                        exceptionFlag=true
                }
                {
                        node screenshot.js  http://localhost:3000/survey/survey.md ~/mutation/Images/mutated/$i/survey
                } || {
                        exceptionFlag=true
                }
                {
                        node screenshot.js  http://localhost:3000/survey/variations.md ~/mutation/Images/mutated/$i/variations
                } || {
                        exceptionFlag=true
                }
                
                if [ $exceptionFlag = false ]
                then
                kill -9 $process > /dev/null
                wait $process 2>/dev/null
                
                cd ~/mutation
                compare -metric AE -fuzz 5% ~/mutation/Images/original/upload.png ~/mutation/Images/mutated/$i/upload.png ~/mutation/Images/difference/$i/upload.png  2>pixelDiff1
                compare -metric AE -fuzz 5% ~/mutation/Images/original/long.png ~/mutation/Images/mutated/$i/long.png ~/mutation/Images/difference/$i/long.png 2>pixelDiff2
                compare -metric AE -fuzz 5% ~/mutation/Images/original/survey.png ~/mutation/Images/mutated/$i/survey.png ~/mutation/Images/difference/$i/survey.png 2>pixelDiff3
                compare -metric AE -fuzz 5% ~/mutation/Images/original/variations.png ~/mutation/Images/mutated/$i/variations.png ~/mutation/Images/difference/$i/variations.png 2>pixelDiff4

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
jq -s add temp1.json temp2.json > result.json

cd ~/$repoName
git reset --hard > /dev/null 2>&1 &

echo "Mutation-$i Completed"
done

cp -r ~/mutation/Images $2/mutation/Images
cp ~/mutation/result.json $2/mutation/result.json

passedCounter=$(($3-$changeCounter-$exceptionCounter))
denom=$(( $3-$exceptionCounter ))

echo "Failed Mutants: $changeCounter"
echo "Passed Mutants: $passedCounter"
echo "Exception Mutants: $exceptionCounter"
echo "Mutation Coverage: $passedCounter/$denom"
