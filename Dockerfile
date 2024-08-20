FROM node:alpine AS base
WORKDIR /app
COPY package*.json ./
COPY migrate.sh ./
RUN chmod +x migrate.sh
COPY prisma ./prisma/
RUN npm install


FROM base AS build
COPY . .
RUN npx prisma generate
RUN npm run build && npm prune --production
RUN npm ci --omit dev && npm cache clean --force

FROM node:alpine AS production
WORKDIR /app
ENV NODE_ENV production
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/migrate.sh .
EXPOSE 3000
CMD node -r dotenv/config build