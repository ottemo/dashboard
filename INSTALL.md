## Developer Installation Instructions

### Install NPM Gulp and Bower

#### OSX
    brew install npm
    brew install git-flow
    brew install hub
    alias hub=git
    npm install -g gulp bower
    npm install gulp --save-dev

#### Debian based Linux
    sudo apt-get update
    sudo apt-get install -y python-software-properties python g++ make
    sudo add-apt-repository -y ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs
   
    sudo apt-get install git-flow
    
    curl http://hub.github.com/standalone -sLo ~/bin/hub
    chmod +x ~/bin/hub
    alias git=hub  # add to your .bashrc or .bash_profile/.profile

    npm install -g bower gulp 
    npm install gulp --save-dev

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
    gulp serve
    
### Issue Pull Request on Github
    git push -u origin <feature-branch>
    git pull-request -b develop
