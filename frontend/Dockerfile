# Dockerfile
FROM node:18.13.0-alpine

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

# update and install dependency
RUN apk update && apk upgrade && apk add git

# create destination directory
WORKDIR /app

# copy the app, note .dockerignore
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .

RUN npm install

COPY . .

CMD [ "npm", "run", "build" ]