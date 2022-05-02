#!/bin/bash
echo $1
siege $1 >> out.txt 2>&1 &
sleep 10
# kill -9 $! > /dev/null
# wait $! 2> /dev/null