FROM node:12.10.0-alpine
RUN mkdir client
WORKDIR /client
COPY package.json /client/
RUN npm install
COPY . /client/
EXPOSE 3000
CMD ["npm", "start"]