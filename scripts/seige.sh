#!/bin/bash
siege $1 >> out.txt 2>&1 &
sleep 20
kill -9 $! > /dev/null
wait $! 2>/dev/null