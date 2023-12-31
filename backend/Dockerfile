FROM node:18-alpine

WORKDIR /src

COPY . .

RUN npm install

RUN script.sh

CMD ["npm", "run", "start:dev"]
