## Developer Installation Instructions

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

### Initialize Git Flow
    git checkout master
    git checkout develop
    git flow init -d

### Start a Feature Branch
    git flow feature start <feature-name>

### Build
    gulp build
    
### Run Unit Tests
    Not configured yet

### Run Client in Development Mode
    gulp build && gulp dev
    
### Issue Pull Request on Github
    git push -u origin <feature-branch>
