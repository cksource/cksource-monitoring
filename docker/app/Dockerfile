FROM node:18.19.1-alpine3.19 as builder

RUN npm install -g pnpm@8

WORKDIR /tmp
COPY package.json tsconfig.base.json tsconfig.json ./
RUN pnpm install
COPY src/ ./src/
RUN pnpm build

###############################################

FROM node:18.19.1-alpine3.19

ENV NODE_ENV=production

RUN npm install -g pnpm@8
RUN apk add --no-cache curl

WORKDIR /app
COPY --from=builder /tmp/dist ./dist
COPY --from=builder /tmp/package.json ./


RUN pnpm install

CMD ["node", "./dist/server.js"]

