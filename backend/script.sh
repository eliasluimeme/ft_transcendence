#!/bin/bash

npx prisma generate
npx prisma migrate dev
npm install argon2

sleep 10

npm run start:dev