FROM node:18-alpine

# Install GCC and other build dependencies
RUN apk add --no-cache build-base python3-dev

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
#COPY package*.json ./

# Bundle app source
COPY . /usr/src/app/


RUN yarn install
RUN yarn build

# Expose port
EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]
