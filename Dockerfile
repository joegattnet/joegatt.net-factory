FROM node:8-alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY ./src ./src
RUN npm run build

FROM node:8-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN ls -al
RUN npm install --only=production
COPY --from=0 /usr/src/app/dist ./dist
EXPOSE 80
CMD npm start
