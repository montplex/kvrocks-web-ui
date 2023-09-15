# docker build -t kvctl-web-server .
FROM node:18-alpine

WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install

# need: cp ../dist ./dist
COPY dist /usr/src/dist
COPY index.js /usr/src/app/

ENV TARGET_API_ADDRESS http://127.0.0.1:9379
EXPOSE 19379

CMD [ "npm", "run", "start" ]