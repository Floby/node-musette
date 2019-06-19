FROM node:12-alpine
RUN mkdir -p /opt/musette
WORKDIR /opt/musette
COPY *.js *.json /opt/musette/
COPY bin /opt/musette/bin
RUN ls /opt/musette
RUN npm ci --production

EXPOSE 8080
ENV PORT=8080
EXPOSE 9090
ENV AMDIN_PORT=9090

CMD ["npm", "start"]
