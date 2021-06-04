ARG ARCH
FROM ${ARCH}node:12-alpine

ARG SSH_KEY

ENV NODE_ENV=production

WORKDIR /home/node/

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN apk add --update --no-cache openssh

RUN npm install --production --silent && mv node_modules ../

COPY . .

EXPOSE 3000

RUN cat /etc/passwd
RUN mkdir -p /root/.ssh/
RUN echo "$SSH_KEY" > /root/.ssh/id_rsa

RUN echo -e "Host localhost\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

RUN chown node /root/.ssh/id_rsa
RUN touch /root/.ssh/known_hosts

RUN chown node /root/.ssh/known_hosts
RUN chmod 400 /root/.ssh/id_rsa

CMD ["node", "index.js"]
