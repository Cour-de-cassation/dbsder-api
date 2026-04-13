# Source : https://github.com/nestjs/awesome-nestjs#resources boilerplates
# --- Builder --- #
FROM node:24-alpine AS builder

ENV NODE_ENV=build

USER node
WORKDIR /home/node

RUN npm config set proxy $http_proxy
RUN npm config set https-proxy $https_proxy

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build && npm prune --production


# --- Final api image --- #
FROM node:24-alpine AS api

ENV NODE_ENV=production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist ./dist

CMD ["node", "dist/server"]

# --- Base final image with api dist content --- #
FROM node:24-alpine AS api-local

ENV NODE_ENV=local

USER node
WORKDIR /home/node

COPY --chown=node:node . .

CMD ["npm", "run", "start:watch"]
