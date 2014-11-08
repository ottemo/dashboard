Dashboard
=========

[![wercker status](https://app.wercker.com/status/0d1dbce7b17a8fc14016760e30709afc/m "wercker status")](https://app.wercker.com/project/bykey/0d1dbce7b17a8fc14016760e30709afc)


## Workflow with gulp

### Build
Builds project and moves files on the destination folder. Makes concat and minify css and JS. Compiling SASS to css. Checks JS on errors using JSHint

    gulp build
    
### Run Client in Development Mode
Moves images, bower-files into destination folder. Compiling sass. Adds watcher on a changes in css, scss, js, html and images. After a change these files browser automatically will be update  content

    gulp build && gulp dev
    or
    gulp build && gulp serve
    
### Run Unit Tests
Not configured yet. Will be realized in the near future
    
    gulp test
        
### Also useful are the following commands
    gulp jshint // check js on errors
    gulp sass   // Makes compilation sass to css
    gulp clean  // Removes the _dist_ folder

### How start with Vagrantfile
Clone ottemo/dashboard github repo. The vagrant instance will start with nginx available at http://localhost:9999 - You can use gulp serve as well and will be available at http://localhost:9000

    vagrant up
    vagrant ssh
    sudo su -
    cd /vagrant
    gulp serve (this will take a few minutes to start)
    
### How to run ottemo/dashboard docker container
Pull latest image from docker hub

    docker pull ottemo/dashboard

Start the container and access locally access at http://localhost:9999

    docker run -d -p 9999:80 -t ottemo/dashboard
      
