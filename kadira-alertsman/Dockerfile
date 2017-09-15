FROM alpine:3.2

RUN \
 apk upgrade --update && \
 apk add --no-cache ca-certificates python g++ make nodejs

WORKDIR /app

ADD ./package.json /app/
RUN npm install
ADD . /app

ENV APP_DB_URL mongodb://dbserver/apm
ENV APP_DB_OPLOG_URL mongodb://dbserver/local
ENV KADIRA_API_URL=http://root:secret@localhost:7007/core
ENV MAIL_URL smtp://user:pass@smtp.mailgun.org:587

CMD [ "npm", "run", "start" ]
