FROM alpine:3.6

RUN \
 apk upgrade --update && \
 apk add --no-cache ca-certificates mongodb nodejs nodejs-npm && \
 npm install npm@latest -g

WORKDIR /app

ADD ./package.json /app/
RUN npm install
ADD . /app

ENV MONGO_URL mongodb://dbserver/apm

CMD [ "npm", "run", "start" ]
