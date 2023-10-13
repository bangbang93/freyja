ARG BASE_IMAGE=node:18.18.0-alpine
FROM $BASE_IMAGE AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY client ./client
RUN npm run build:client
COPY src ./src
COPY tsconfig.* nest-cli.json ./
RUN npm run build:server


FROM $BASE_IMAGE AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM $BASE_IMAGE AS release

RUN apk add --no-cache tini

WORKDIR /app

COPY public public
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/dist ./dist

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "--enable-source-maps", "dist/main.js"]
