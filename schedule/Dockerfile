FROM node:16-alpine

WORKDIR '/app'

COPY package.json .
RUN npm install

COPY . .

RUN chown -R root:root /app

USER root

EXPOSE 5173

CMD [ "npm", "run", "dev"]