FROM oven/bun:1-alpine AS base
WORKDIR /app

# deps สำหรับ migrate (รวม devDependencies เพราะต้องการ drizzle-kit)
FROM base AS deps-dev
COPY package.json ./
RUN bun install

# deps สำหรับ production runtime เท่านั้น
FROM base AS deps-prod
COPY package.json ./
RUN bun install --production

FROM base
COPY --from=deps-dev /app/node_modules node_modules
COPY . .
EXPOSE 1001
CMD ["bun", "src/index.ts"]
