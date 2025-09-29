FROM node:18-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y libc6
RUN npm install

COPY . .

RUN npm run build
RUN npx prisma migrate deploy
RUN npx prisma generate

CMD ["npm", "run", "start"]
