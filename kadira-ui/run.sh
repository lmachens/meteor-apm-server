#!/bin/bash

MONGO_URL=$APP_MONGO_URL \
MONGO_OPLOG_URL=$APP_MONGO_OPLOG_URL \
MAIL_URL=$MAIL_URL \
ROOT_URL=$UI_ROOT_URL \
meteor --port $UI_PORT --settings ./settings.json $@
