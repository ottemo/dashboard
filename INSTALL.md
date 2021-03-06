## Installation Instructions for Local Development

### Install NPM Gulp and Bower

#### OSX
    brew install nvm
    nvm install v0.10.31
    nvm alias default v0.10.31
    brew install git-flow
    npm install -g gulp bower

#### Debian based Linux
    sudo apt-get update
    sudo apt-get install -y python-software-properties python g++ make
    sudo add-apt-repository -y ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs
   
    sudo apt-get install git-flow
    
    npm install -g bower gulp 

### Install Local Project Dependencies 
    cd <directory of your cloned repository>
    npm install
    bower install

### Build project using Gulp
    gulp build
    
### Run Client in Development Mode with Browser Reload
    gulp build && gulp dev
    or 
    gulp build && gulp serve

Note: The password to login to the dashboard will be whatever was set in the ['gulp build' step](https://github.com/ottemo/store-ng/blob/develop/INSTALL.md#build-ottemo-store-ng) for store-ng. By default this is:
```
username: admin
password: admin
```

## How to set up Git Flow on Mac/Linux

#### OSX
   brew install git-flow

#### Linux
   sudo apt-get install git-flow

### Initialize Git Flow in cloned Repository
    git checkout master
    git checkout develop
    git flow init -d

### Start a Feature Branch
    git flow feature start <feature-name>

### Issue a pull request on github
    $ git push -u origin <FEATURE-BRANCH>
    # if you have git aliased to hub otherwise use the github web interface
    $ git pull-request -b develop

### Delete the local branch
    $ git branch -d <FEATURE-BRANCH>
