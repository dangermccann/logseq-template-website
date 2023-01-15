#!/bin/bash
cd /home/ec2-user/logseq-template-website
export NODE_ENV=production 
export LOG_DIR=/var/log/logseq-template-website
nohup node server.js > $LOG_DIR/stdout.log 2> $LOG_DIR/stdout.log < /dev/null &