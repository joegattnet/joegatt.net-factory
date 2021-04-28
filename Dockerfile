FROM node:8-alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY googledocs.*.json ./
COPY .env ./
COPY auth.js ./
COPY tsconfig.json ./
RUN npm install
COPY ./src ./src
RUN npm run build

FROM node:8-alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY /usr/src/app/googledocs.*.json ./
COPY /usr/src/app/.env ./
COPY /usr/src/app/auth.js ./
RUN npm install --only=production
COPY --from=0 /usr/src/app/dist ./dist
EXPOSE 80
CMD npm start
