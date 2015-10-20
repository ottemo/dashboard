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
        HOST=rk-dev
    elif [ "$REMOTE_HOST" == 'kg.staging.ottemo.io' ]; then
        HOST=kg-dev
    elif [ "$REMOTE_HOST" == 'ub.staging.ottemo.io' ]; then
        HOST=ub-staging
    fi
    # gulp build on remote host
    ssh ottemo@$REMOTE_HOST "cd $SRCDIR && npm install && HOST=${HOST} gulp build"

    echo ""
    echo RESTORING DIST DIRECTORY.
    ssh ottemo@$REMOTE_HOST "rm -rf $HOME/dash/* && cp -R $SRCDIR/dist/* $HOME/dash && ln -s $MEDIADIR $HOME/dash/media"

    echo ""
    echo DEPLOY FINISHED
fi
