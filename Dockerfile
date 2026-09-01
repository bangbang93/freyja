ARG BASE_IMAGE=node:22.19.0
FROM $BASE_IMAGE AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/server/package.json packages/server ./packages/server/
COPY packages/home/package.json packages/home ./packages/home/
COPY packages/admin/package.json packages/admin ./packages/admin/
RUN --mount=type=cache,dst=/root/.local/share/pnpm/store corepack enable && pnpm install --frozen-lockfile

ENV NODE_ENV=production

COPY packages packages
RUN pnpm -r run build


FROM $BASE_IMAGE AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/server/package.json packages/server ./packages/server/
COPY packages/home/package.json packages/home ./packages/home/
COPY packages/admin/package.json packages/admin ./packages/admin/
RUN --mount=type=cache,dst=/root/.local/share/pnpm/store corepack enable && pnpm install --prod --frozen-lockfile

FROM $BASE_IMAGE AS release

RUN apt-get update &&  \
    apt-get install -y \
    tini && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY public public
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages/server/node_modules ./packages/server/node_modules
COPY --from=dependencies /app/packages/home/node_modules ./packages/home/node_modules
COPY --from=dependencies /app/packages/admin/node_modules ./packages/admin/node_modules
COPY --from=build /app/packages/server/dist ./packages/server/dist
COPY --from=build /app/packages/home/dist ./packages/home/dist
COPY --from=build /app/packages/admin/dist ./packages/admin/dist

CMD ["tini", "--", "node", "--enable-source-maps", "packages/server/dist/main.js"]
