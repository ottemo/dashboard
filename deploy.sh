#!/bin/bash

# SRCDIR
HOME=/home/ottemo
SRCDIR=$HOME/code/dash
MEDIADIR=$HOME/media

if [ "$BRANCH" == 'develop'  ]; then
    echo ""
    echo UPDATING REMOTE GIT REPOSITORY WITH DEVELOP BRANCH.
    ssh ottemo@$REMOTE_HOST "cd $SRCDIR && git stash && git checkout develop && git fetch --prune && git pull"

    echo ""
    echo REMOVING DIST DIRECTORY.
    ssh ottemo@$REMOTE_HOST "cd $SRCDIR && rm -rf dist"

    echo ""
    echo RUNNING PRODUCTION GULP BUILD 
    if [ "$REMOTE_HOST" == 'rk.staging.ottemo.io' ]; then
        HOST=rk-staging
    elif [ "$REMOTE_HOST" == 'kg.staging.ottemo.io' ]; then
        HOST=kg-staging
    elif [ "$REMOTE_HOST" == 'demo.staging.ottemo.io' ]; then
        HOST=demo-staging
    elif [ "$REMOTE_HOST" == 'mp.staging.ottemo.io' ]; then
        HOST=mp-staging
    elif [ "$REMOTE_HOST" == 'sb.staging.ottemo.io' ]; then
        HOST=sb-staging
    elif [ "$REMOTE_HOST" == 'scs.staging.ottemo.io' ]; then
        HOST=scs-staging
    elif [ "$REMOTE_HOST" == 'gk.staging.ottemo.io' ]; then
        HOST=gk-staging
    elif [ "$REMOTE_HOST" == 'sg.staging.ottemo.io' ]; then
        HOST=sg-staging       
    fi
    # gulp build on remote host
    ssh ottemo@$REMOTE_HOST "cd $SRCDIR && npm install && gulp build --env=staging --config=${HOST}"

    echo ""
    echo RESTORING DIST DIRECTORY.
    ssh ottemo@$REMOTE_HOST "rm -rf $HOME/dash/* && cp -R $SRCDIR/dist/* $HOME/dash && ln -s $MEDIADIR $HOME/dash/media"

    echo ""
    echo DEPLOY FINISHED
fi
