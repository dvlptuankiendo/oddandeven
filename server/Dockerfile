FROM node:14.17.6
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
EXPOSE 8888
CMD [ "node", "index.js" ]