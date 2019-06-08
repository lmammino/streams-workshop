FROM node:12.4.0-alpine

RUN apk update && apk upgrade && apk add bash vim nano

RUN mkdir -p /app
WORKDIR /app

CMD ["bash"]
