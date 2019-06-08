FROM node:12.4.0-alpine

RUN apk update && apk upgrade && apk add bash vim nano

RUN mkdir -p /app
WORKDIR /app

RUN echo -e "#!/usr/bin/env bash\n\nset -e\n\nnpm install;\nexec \"\$@\"" > /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bash"]
