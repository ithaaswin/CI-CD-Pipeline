#!/bin/bash
echo $1
siege $1 >> out.txt 2>&1 &
sleep 10
