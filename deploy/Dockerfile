FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Copy everything
COPY . ./

# Development mode
RUN npm install --unsafe-perm

EXPOSE 8080

CMD [ "npm", "run", "start:prod" ]