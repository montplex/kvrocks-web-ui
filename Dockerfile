# docker build -t kvctl-web-server .
FROM node:18-alpine

WORKDIR /usr/src/app
COPY http-server/package.json /usr/src/app/
RUN npm install

COPY dist /usr/src/dist
COPY http-server/index.js /usr/src/app/

ENV TARGET_API_ADDRESS http://127.0.0.1:9379
EXPOSE 19379

CMD [ "npm", "run", "start" ]