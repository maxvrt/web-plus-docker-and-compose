FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm i
# копируем исходный код
COPY . .
RUN npm run build

FROM node:16-alpine as production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm i --omit=dev
COPY --from=builder /app/dist ./dist/
EXPOSE 3000
CMD ["node", "dist/src/main.js"]

# Команды локального запуска
# docker run --name postgres-db --network my-network --network-alias db -e POSTGRES_PASSWORD=secretpassword -e POSTGRES_DB=kupipodariday -d postgres
# docker build . -t backend
# docker run --name backend --network my-network backend
