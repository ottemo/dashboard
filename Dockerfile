FROM ottemo/node:7.8.0

RUN mkdir -pv /home/ottemo/dash

COPY . /home/ottemo/dash
RUN rm -rf /home/ottemo/dash/.git
WORKDIR /home/ottemo/dash
RUN npm install

COPY bin/docker-entrypoint.sh /home/ottemo/dash

EXPOSE 9000
CMD ./docker-entrypoint.sh
