#!/bin/bash
folder=$(pwd)
cd $folder
if [ -d "$folder/node_modules" ]
then
    echo "node_modules found"
	node bin/www
else
    echo "node_modules not found"
	npm install
	node bin/www
fi