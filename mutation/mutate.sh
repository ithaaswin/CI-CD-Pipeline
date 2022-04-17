#!/bin/bash

# $1 - URL for cloning repo
# $2 - Path of shared folder between base Machine and VM
# $3 - No of mutations to be run
# $4 - User (ubuntu/vagrant)

HOME=/home/$4
repoName=$(basename $1 .git)
rm -rf $repoName
git clone --recursive $1

cd ~
sudo rm -rf result.json temp1.json temp2.json Images
touch result.json temp1.json temp2.json
sudo apt-get update
sudo apt-get install -y jq npm imagemagick chromium-browser
npm install puppeteer escodegen
sudo mkdir -m 777 -p ~/Images/original
sudo mkdir -m 777 -p ~/Images/mutated
sudo mkdir -m 777 -p ~/Images/difference

cd ~/$repoName
npm i
node index.js > /dev/null 2>&1 &
process=$!

cd ~
totSnaps=$(jq '.snaps | length' snapshots.json)
for (( j=0; j<$totSnaps; j++))
do
snapName=$(jq '.snaps['$j'].name' snapshots.json | tr -d '"')
snapURL=$(jq '.snaps['$j'].url' snapshots.json | tr -d '"')
node screenshot.js $snapURL ~/Images/original/$snapName
done

kill -9 $process > /dev/null
wait $process 2>/dev/null

exceptionCounter=0
exceptionFlag=false
changeCounter=0

for (( i=1; i<=$3; i++ ))
do
        cd ~
        rm -rf 
        mutateFile=$( node randomSelector.js ~/$repoName)
        sudo rm -rf rewriteLog.txt
        node rewrite.js $4 $repoName $mutateFile >> rewriteLog.txt

        operation=$( cat rewriteLog.txt | head -n 1 )
        operator="${mutateFile}"
        operator+=": "
        operator+="${operation}"
        lenSourceLine=$(wc -l < rewriteLog.txt )
        if [[ lenSourceLine -eq 2 ]]
        then
        sourceLine=$( cat rewriteLog.txt | tail -n 1 )
        else
        sourceLine="No Line Changed"
        fi

        pixelDiff=0
        exceptionFlag=false
        cd ~/$repoName
        node index.js > serviceLog.txt 2>&1 &
        process=$!
        sudo mkdir -m 777 -p ~/Images/mutated/$i
        sudo mkdir -m 777 -p ~/Images/difference/$i

        cd ~
        totSnaps=$(jq '.snaps | length' snapshots.json)
        for (( j=0; j<$totSnaps; j++))
        do
        cd ~
        snapFlag=false
        snapName=$(jq '.snaps['$j'].name' snapshots.json | tr -d '"')
        snapURL=$(jq '.snaps['$j'].url' snapshots.json | tr -d '"')
        {
                node screenshot.js $snapURL ~/Images/mutated/$i/$snapName
        } || {
                exceptionFlag=true
                snapFlag=true
        }
        if $snapFlag
        then
        cd ~/$repoName
        echo "Here $(cat serviceLog.txt)"
        cp serviceLog.txt ~/Images/difference/$snapName.txt
        node index.js > serviceLog.txt 2>&1 &
        process=$!
        else
        compare -metric AE -fuzz 5% ~/Images/original/$snapName.png ~/Images/mutated/$i/$snapName.png ~/Images/difference/$i/$snapName.png  2>pixelDiffTemp
        pixelDiff=$(( $(head -n 1 pixelDiffTemp)+$pixelDiff))
        fi
        done
        
        kill -9 $process > /dev/null
        wait $process 2>/dev/null

        if $exceptionFlag
        then
        endResult='Exception'
        exceptionCounter=$(($exceptionCounter+1))
        exceptionFlag=false
        elif [ $pixelDiff -eq 0 ]
        then
        endResult='Not Changed'
        else
        endResult='Changed'
        changeCounter=$(($changeCounter+1))
        fi
                
        json_data=$(cat <<EOF 
{"$i":{"operator": "$operator","sourceLine": "$sourceLine","result": "$endResult"}}
EOF
)

cd ~
echo $json_data > temp1.json
cat result.json > temp2.json
jq -s add temp1.json temp2.json > result.json

cd ~/$repoName
git reset --hard > /dev/null 2>&1 &
git clean -f -d

echo "Mutation-$i Completed"
done

cp -r ~/Images $2/mutation
cp ~/result.json $2/mutation

passedCounter=$(($3-$changeCounter-$exceptionCounter))
denom=$(( $3-$exceptionCounter ))

echo "Failed Mutants: $changeCounter"
echo "Passed Mutants: $passedCounter"
echo "Exception Mutants: $exceptionCounter"
echo "Mutation Coverage: $changeCounter/$denom"
