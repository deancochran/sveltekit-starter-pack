FROM node:alpine AS base
WORKDIR /app
COPY package*.json ./
COPY migrate.sh ./
RUN chmod +x migrate.sh
RUN npm install


FROM base AS build
COPY . .
RUN npm run build && npm prune --production
RUN npm ci --omit dev && npm cache clean --force

FROM node:alpine AS production
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/migrate.sh .
EXPOSE 3000
CMD node -r dotenv/config build
