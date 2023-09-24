FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm install -g typescript

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/app.js"]