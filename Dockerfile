FROM ottemo/nodejs:0.1.0


ENV HOME /root
WORKDIR /root
RUN git clone https://ottemo-dev:freshbox111222333@github.com/ottemo/dashboard.git -b develop /root/dashboard/
WORKDIR  /root/dashboard
RUN npm install
RUN bower install --allow-root
RUN gulp build
