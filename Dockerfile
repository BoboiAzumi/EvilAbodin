FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN npx prisma migrate deploy
RUN npx prisma generate

CMD ["npm", "run", "start"]
