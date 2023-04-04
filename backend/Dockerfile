FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
# команда  npm ci ставит зависимости из package-lock.js (clear install)
RUN npm ci
# копируем исходный код
COPY . .
RUN npm run build

FROM node:16-alpine as production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev && npm install -g pm2
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js
EXPOSE 3000
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
# CMD ["node", "dist/src/main.js"]

# Команды локального запуска
# docker run --name postgres-db --network my-network --network-alias db -e POSTGRES_PASSWORD=secretpassword -e POSTGRES_DB=kupipodariday -d postgres
# docker build . -t backend
# docker run --name backend --network my-network backend
# docker build . -t frontend
# делаем фронтед доступным на локалхосте
# docker run --name frontend --network my-network -p 80:80 frontend
