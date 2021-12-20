FROM node:14.17.6
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]