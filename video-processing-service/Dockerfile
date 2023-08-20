# Stage 1: Build Stage
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build


# Stage 2 : Proction Stage
FROM node:18

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /app/dist/ ./dist

EXPOSE 3030

CMD [ "npm", "run", "serve" ]
