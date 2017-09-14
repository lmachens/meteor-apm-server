#/bin/bash

MONGO_APP_URL=$MONGODB_URLS_APP \
MAIL_URL=$API_MAIL_URL \
JWT_SECRET="secret" \
JWT_LIFETIME="1d" \
AUTH_SECRET="secret" \
PORT=7007 \
NODE_ENV=production \
  node_modules/.bin/nodemon server.js
