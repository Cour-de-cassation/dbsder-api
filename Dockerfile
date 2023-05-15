# Source : https://github.com/nestjs/awesome-nestjs#resources boilerplates
# --- Builder --- #
FROM node:18-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

RUN npm config set proxy $http_proxy
RUN npm config set https-proxy $https_proxy

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .


# --- Dev dependencies for testing --- #
FROM builder as test

RUN npm run build


# --- Only prod dependencies --- #
FROM builder as prod

RUN npm run build && npm prune --production


# --- Base final image with only shared dist content --- #
FROM node:18-alpine as shared

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=prod --chown=node:node /home/node/package*.json ./
COPY --from=prod --chown=node:node /home/node/node_modules/ ./node_modules/


# --- Base final image with api dist content --- #
FROM shared as api

USER node
COPY --from=prod --chown=node:node /home/node/dist ./dist

CMD ["node", "dist/main"]
