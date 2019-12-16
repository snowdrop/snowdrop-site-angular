FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json /usr/src/app

# Development mode
RUN npm install

# Bundle app source and the generated dist folder
COPY . /usr/src/app
COPY dist /usr/src/app

EXPOSE 8080

CMD [ "npm", "run", "start:prod" ]