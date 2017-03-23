FROM node:4.8.0-alpine

RUN apk add --no-cache python
RUN apk add --no-cache make
RUN apk add --no-cache g++

RUN mkdir -pv /home/ottemo/media
RUN mkdir -pv /home/ottemo/dash

COPY . /home/ottemo/dash
RUN rm -rf /home/ottemo/dash/.git
WORKDIR /home/ottemo/dash
RUN npm install -g gulp
RUN npm install

COPY bin/docker-entrypoint.sh /home/ottemo/dash

EXPOSE 9000
CMD ./docker-entrypoint.sh
