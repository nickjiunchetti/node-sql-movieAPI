FROM node:12-alpine
RUN apk add --no-cache python g++ make
WORKDIR /nickjiunchetti-node-rest-api
COPY . .
RUN yarn install --production
CMD ["node", "src/app.js"]