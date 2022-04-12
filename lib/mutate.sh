#!/bin/bash

# cp "$1" "mutate.sh"

git clone --recursive https://github.com/chrisparnin/checkbox.io-micro-preview.git
# git clone --recursive https://github.com/CSC-DevOps/ASTRewrite.git
git clone --recursive https://github.com/ruttabega/screenshot.git

sudo apt-get update
sudo apt-get install -y jq npm imagemagick chromium-browser

npm install escodegen

cd checkbox.io-micro-preview
npm i

cd ~/ASTRewrite
npm i
cd~

# Change rewrite and add ~

cd ~/screenshot
npm i && sudo npm link

sudo mkdir -m 777 -p ~/images/original
sudo mkdir -m 777 -p ~/images/mutated

cd checkbox.io-micro-preview
node index.js > /dev/null 2>&1 &

cd ~/screenshot
screenshot  http://localhost:3000/survey/upload.md ~/images/original/upload
screenshot  http://localhost:3000/survey/long.md ~/images/original/long
screenshot  http://localhost:3000/survey/survey.md ~/images/original/survey
screenshot  http://localhost:3000/survey/variations.md ~/images/original/variations

kill -9 $! > /dev/null


rm -rf result.json temp1.json temp2.json
touch result.json temp1.json temp2.json

for i in {1..1000}
do
        ranNum=$(( 1+$RANDOM % $1 ))
        operator=$( jq -r --arg num "$ranNum" '.[$num]' operations.json )

        sourceLine=$( node rewrite.js "$operator" )
        
        cd ~/checkbox.io-micro-preview

        node index.js > /dev/null 2>&1 &
        sudo mkdir -m 777 -p ~/images/mutated/$i
        cd ~/screenshot
        screenshot  http://localhost:3000/survey/upload.md ~/images/mutated/$i/upload
        screenshot  http://localhost:3000/survey/long.md ~/images/mutated/$i/long
        screenshot  http://localhost:3000/survey/survey.md ~/images/mutated/$i/survey
        screenshot  http://localhost:3000/survey/variations.md ~/images/mutated/$i/variations

        kill -9 $! 
        wait 2>/dev/null
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
        fi

        json_data=$(cat <<EOF 
{"$i":{"operator": "$operator","sourceLine": "$sourceLine","result": "$endResult"}}
EOF
)
echo $json_data > temp1.json
cat result.json > temp2.json
jq -s add temp1.json temp2.json > result.json
echo "Mutation-$i Completed"
done

# for i in {1..1000}
# do
#         operator=$(( 1+$RANDOM % $1 ))
#         sourceLine=$(( 1+$RANDOM % $1 ))
#         endResult=$(( 1+$RANDOM % $1 ))
# json_data=$(cat <<EOF 
# {$i:{"operator": "$operator","sourceLine": "$sourceLine","result": "$endResult"}}
# EOF
# )

# echo $json_data
# done

# jq json_data ~/result.json
# done

# JSON_STRING=$( jq -n \ --arg bn "$BUCKET_NAME" \ --arg on "$OBJECT_NAME" \ --arg tl "$TARGET_LOCATION" \
# '{result: {bucketname: $bn, objectname: $on, targetlocation: $tl}}' )

# #json_data=$( jq -n --arg loo "$i" --arg bn "$operator" --arg on "$sourceLine" --arg tl "$endResult" \
# #'{$looper:{operator: $bn, sourceLine: $on, endResult: $tl}}')