FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN npx prisma generate

COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 5873

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "app.js"]