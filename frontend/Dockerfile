FROM node:18-alpine

RUN apk add --no-cache build-base g++ cairo-dev pango-dev jpeg-dev giflib-dev

WORKDIR /src

COPY . .

RUN npm i

CMD ["npm", "run", "dev"]
