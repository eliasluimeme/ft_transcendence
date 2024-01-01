#!/bin/bash

npx prisma generate
npx prisma migrate dev
npm install argon2

# sleep 30

npm run start:dev