FROM node:12-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./
COPY googledocs.*.json ./
COPY .env ./
COPY tsconfig.json ./
RUN npm install
COPY ./src ./src
RUN npm run build
EXPOSE 80
EXPOSE 443

FROM node:12-alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY googledocs.*.json ./
COPY .env ./
RUN npm install --only=production
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 80
EXPOSE 443
CMD ["npm", "start"]
