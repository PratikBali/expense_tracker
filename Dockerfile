# Build client
FROM node:18-slim AS client-build

WORKDIR /app/client

COPY client/package.json ./
RUN npm install

COPY client/ ./
RUN npm run build


# Runtime (server + built client)
FROM node:18-slim AS runtime

WORKDIR /app/server

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

COPY server/ ./
COPY --from=client-build /app/client/dist /app/client/dist

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]

