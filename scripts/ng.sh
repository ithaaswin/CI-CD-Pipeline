#!/bin/bash
# $1 - To Address
# $2 - From Address
# $3 - Email Token
# $4 - Path of Repo
# $5 - Path of generated Code Coverage File
# $6 - Shared path with VM
# $7 - Threshold
# $8 - JSON File Name

grep "Statements" coverageResult.txt | xargs -n 1 > coverage.txt
statVal=$( head -n 3 coverage.txt | tail -n 1 | cut -d% -f 1 )
grep "Branches" coverageResult.txt | xargs -n 1 > coverage.txt
branchVal=$( head -n 3 coverage.txt | tail -n 1 | cut -d% -f 1 )
grep "Functions" coverageResult.txt | xargs -n 1 > coverage.txt
funcVal=$( head -n 3 coverage.txt | tail -n 1 | cut -d% -f 1 )
grep "Lines" coverageResult.txt | xargs -n 1 > coverage.txt
lineVal=$( head -n 3 coverage.txt | tail -n 1 | cut -d% -f 1 )
thresholdFound=$( echo "$statVal $branchVal $funcVal $lineVal" | awk '{print $1 + $2 + $3 + $4}' | awk '{print $1/4}' )

if (( $(echo "$thresholdFound > $7"|bc -l) ))
then
sudo python3 mail.py $1 $2 $3 $4 $5 "True"
json_data=$(cat <<EOF 
{"$8":"Permitted"}
EOF
)
else
sudo python3 mail.py $1 $2 $3 $4 $5 "False"
json_data=$(cat <<EOF 
{"$8":"Not Permitted"}
EOF
)
fi

touch $8Permission.json
echo $json_data > temp1.json
cat $8Permission.json > temp2.json
jq -s add temp1.json temp2.json > $8Permission.json
cp $8Permission.json $6/

rm -rf temp1.json temp2.json $8Permission.json coverage.txt

shred -u $0