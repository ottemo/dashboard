#!/bin/bash

# build and push dashdashboard image to registry

MYDIR=$(cd `dirname ${BASH_SOURCE[0]}` && pwd)
DASHREPO="$MYDIR/.."
cd $DASHREPO

date=$(date +%Y%m%d-%H%M%S)
branch=$(git branch| awk '{print $2}')
IMAGE="gcr.io/ottemo-kube/dashboard:${branch}-${date}"

echo "build alpine based dashboard container"
docker build -t $IMAGE .
if [ $? -ne 0 ]; then
  echo "error in build dashboard alpine based container"
  exit 2
fi

gcloud docker -- push $IMAGE
if [ $? -ne 0 ]; then
  echo "error in push image"
  exit 2
fi
