#!/bin/bash

npx prisma generate
npx prisma migrate dev
npm install argon2

sleep 20

npm run start:dev