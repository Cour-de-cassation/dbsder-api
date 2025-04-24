# Source : https://github.com/nestjs/awesome-nestjs#resources boilerplates
# --- Builder --- #
FROM node:24-alpine as builder

ENV NODE_ENV=build

USER node
WORKDIR /home/node

RUN npm config set proxy $http_proxy
RUN npm config set https-proxy $https_proxy

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .


# --- Dev dependencies for testing --- #
# Mongo-memory-server require to use an older image 
# https://github.com/nodkz/mongodb-memory-server/issues/732 
# https://nodkz.github.io/mongodb-memory-server/docs/guides/known-issues/#no-build-available-for-alpine-linux 
FROM node:16 as test

ENV NODE_ENV=build

USER node
WORKDIR /home/node

RUN npm config set proxy $http_proxy
RUN npm config set https-proxy $https_proxy

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .


RUN npm run build


# --- Only prod dependencies --- #
FROM builder as prod

RUN npm run build && npm prune --production


# --- Base final image with only shared dist content --- #
FROM node:24-alpine as shared

ENV NODE_ENV=production

USER node
WORKDIR /home/node

COPY --from=prod --chown=node:node /home/node/package*.json ./
COPY --from=prod --chown=node:node /home/node/node_modules/ ./node_modules/


# --- Base final image with api dist content --- #
FROM shared as api

USER node
COPY --from=prod --chown=node:node /home/node/dist ./dist
COPY --from=prod --chown=node:node /home/node/seeds ./seeds

CMD ["node", "dist/main"]

# --- Base final image with api dist content --- #
FROM node:24-alpine as api-local

ENV NODE_ENV=local

USER node
WORKDIR /home/node

COPY --chown=node:node . .
RUN npm i

CMD ["npm", "run", "start:watch"]
