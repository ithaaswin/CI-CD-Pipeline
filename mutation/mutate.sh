#!/bin/bash

# $1 - URL for cloning repo
# $2 - Path of shared folder between base Machine and VM
# $3 - No of mutations to be run

repoName=$(basename $1 .git)
rm -rf $repoName
git clone --recursive $1

cd ~
sudo apt-get update
sudo apt-get install -y jq npm imagemagick chromium-browser
npm install puppeteer escodegen
sudo mkdir -m 777 -p $2/mutation/Images/original
sudo mkdir -m 777 -p $2/mutation/Images/mutated
sudo mkdir -m 777 -p $2/mutation/Images/difference

cd ~/$repoName
npm i
node index.js > /dev/null 2>&1 &
process=$!

cd ~
node $2/mutation/screenshot.js  http://localhost:3000/survey/upload.md $2/mutation/Images/original/upload
node $2/mutation/screenshot.js  http://localhost:3000/survey/long.md $2/mutation/Images/original/long
node $2/mutation/screenshot.js  http://localhost:3000/survey/survey.md $2/mutation/Images/original/survey
node $2/mutation/screenshot.js  http://localhost:3000/survey/variations.md $2/mutation/Images/original/variations

{
        kill -9 $process > /dev/null 2>&1 &
} || {
        echo ""
}

wait $process 2>/dev/null

rm -rf $2/mutation/result.json temp1.json temp2.json log.txt
touch $2/mutation/result.json temp1.json temp2.json
exceptionCounter=0
exceptionFlag=false
changeCounter=0

for (( i=1; i<=$3; i++ ))
do
        cd ~
        sudo rm -rf consoleLog.txt
        node $2/mutation/rewrite.js >> consoleLog.txt
        operator=$( cat consoleLog.txt | head -n 1 )
        sourceLine=$( cat consoleLog.txt | tail -n 1 )

        {
                cd $repoName
                node index.js > /dev/null 2>&1 &
                process=$!
                sudo mkdir -m 777 -p $2/mutation/Images/mutated/$i
                sudo mkdir -m 777 -p $2/mutation/Images/difference/$i

                cd ~
                { 
                        node $2/mutation/screenshot.js  http://localhost:3000/survey/upload.md $2/mutation/Images/mutated/$i/upload
                } || { 
                        exceptionFlag=true
                }
                {
                        node $2/mutation/screenshot.js  http://localhost:3000/survey/long.md $2/mutation/Images/mutated/$i/long
                } || {
                        exceptionFlag=true
                }
                {
                        node $2/mutation/screenshot.js  http://localhost:3000/survey/survey.md $2/mutation/Images/mutated/$i/survey
                } || {
                        exceptionFlag=true
                }
                {
                        node $2/mutation/screenshot.js  http://localhost:3000/survey/variations.md $2/mutation/Images/mutated/$i/variations
                } || {
                        exceptionFlag=true
                }
                
                if [ $exceptionFlag = false ]
                then
                kill -9 $process > /dev/null 2>&1 &
                wait $process 2>/dev/null 2>&1 &
                cd ~
                compare -metric AE -fuzz 5% $2/mutation/Images/original/upload.png $2/mutation/Images/mutated/$i/upload.png $2/mutation/Images/difference/$i/upload.png  2>pixelDiff1
                compare -metric AE -fuzz 5% $2/mutation/Images/original/long.png $2/mutation/Images/mutated/$i/long.png $2/mutation/Images/difference/$i/long.png 2>pixelDiff2
                compare -metric AE -fuzz 5% $2/mutation/Images/original/survey.png $2/mutation/Images/mutated/$i/survey.png $2/mutation/Images/difference/$i/survey.png 2>pixelDiff3
                compare -metric AE -fuzz 5% $2/mutation/Images/original/variations.png $2/mutation/Images/mutated/$i/variations.png $2/mutation/Images/difference/$i/variations.png 2>pixelDiff4

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
cat $2/mutation/result.json > temp2.json
jq -s add temp1.json temp2.json > $2/mutation/result.json

cd ~/$repoName
git reset --hard > /dev/null 2>&1 &

echo "Mutation-$i Completed"
done

echo "$changeCounter"
echo "$exceptionCounter"

passedCounter=$(($3-$changeCounter-$exceptionCounter))
denom=$(( $3-$exceptionCounter ))

echo "Failed Mutants: $changeCounter"
echo "Passed Mutants: $passedCounter"
echo "Exception Mutants: $exceptionCounter"
echo "Mutation Coverage: $passedCounter/$denom"
