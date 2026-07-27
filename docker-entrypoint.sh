#!/bin/sh
set -e
echo "Syncing with prisma"
npx prisma db push
echo "Starting app"
node app.js