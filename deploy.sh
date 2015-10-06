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
    if [ "$REMOTE_HOST" == 'rk.dev.ottemo.io' ]; then
        ssh ottemo@$REMOTE_HOST "cd $SRCDIR && npm install && HOST=rk-dev gulp build"
    elif [ "$REMOTE_HOST" == 'kg.dev.ottemo.io' ]; then
        ssh ottemo@$REMOTE_HOST "cd $SRCDIR && npm install && HOST=kg-dev gulp build"
    elif [ "$REMOTE_HOST" == 'ub-staging.ottemo.io']; then
        ssh ottemo@$REMOTE_HOST "cd $SRCDIR && npm install && HOST=ub-staging gulp build"
    fi

    echo ""
    echo RESTORING DIST DIRECTORY.
    ssh ottemo@$REMOTE_HOST "rm -rf $HOME/dash/* && cp -R $SRCDIR/dist/* $HOME/dash && ln -s $MEDIADIR $HOME/dash/media"

    echo ""
    echo DEPLOY FINISHED
fi
