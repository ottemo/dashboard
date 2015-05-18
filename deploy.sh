#!/bin/bash

if [ "$BRANCH" == 'develop' ]; then
    scp -r dist ottemo@$REMOTE_HOST:~/dashboard/
fi