apt-get update
apt-get install -y nginx git curl python-software-properties python software-properties-common
add-apt-repository ppa:chris-lea/node.js
apt-get update
apt-get install -y nodejs
npm update -g npm
cd /vagrant
npm install
npm install -g bower
bower install --allow-root
npm install -g gulp
gulp build
rm -f /etc/nginx/sites-enabled/default
cp -f ./config/dashboard.conf /etc/nginx/conf.d/
sed -i 's/\/opt\/dashboard/\/vagrant/g' /etc/nginx/conf.d/dashboard.conf
sed -i 's/80/9999/g' /etc/nginx/conf.d/dashboard.conf
service nginx restart
