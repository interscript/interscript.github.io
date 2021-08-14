#/bin/bash

#Note to ensure to run yarn install prior to run this script
#yarn install
rm ./public/maps/*.js
rm ./public/maps/*.json
cp ./node_modules/interscript/src/maps/* ./public/maps