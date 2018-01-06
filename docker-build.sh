#!/bin/bash
echo "---";
echo "- Build all docker images with the correct context at once"
echo "---";

# build the node_modules image with context set to the project root
docker build --no-cache -t lakka-node-modules:latest -f ./docker/node-modules/Dockerfile .

# build the shell
docker build --no-cache -t lakka-node-shell:latest -f ./docker/node-shell/Dockerfile .


