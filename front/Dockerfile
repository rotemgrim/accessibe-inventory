FROM node:12.19.0-alpine3.12

WORKDIR "/front"

COPY package.json package.json

RUN npm install

COPY . .
