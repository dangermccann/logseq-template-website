#!/bin/bash
cd /home/ec2-user/logseq-template-website
NODE_ENV=production nohup node server.js > /dev/null 2> /dev/null < /dev/null &