# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm i

COPY . ./
RUN npm run build

# Stage 2: Run
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/.output ./

EXPOSE 3000

CMD ["node", "server/index.mjs"]