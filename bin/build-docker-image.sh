#!/bin/bash

# build and push dashdashboard image to registry

for i in "$@"
do
case $i in
    version=*)
    version="${i#*=}"
    shift
    ;;
    *)
            # unknown option
    ;;
esac
done

MYDIR=$(cd `dirname ${BASH_SOURCE[0]}` && pwd)
DASHREPO="$MYDIR/.."
cd $DASHREPO

if ! [ -n "$version" ] ; then
  date=$(date +%Y%m%d-%H%M%S)
  IMAGE="gcr.io/ottemo-kube/dashboard:${date}"
else
  IMAGE="gcr.io/ottemo-kube/dashboard:$version"
fi
echo "use $IMAGE as image name"

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
