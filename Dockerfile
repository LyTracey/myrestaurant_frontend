# syntax=docker/dockerfile:1

# Pull official base image
FROM node:19.3.0-alpine


RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/frontend

# Set working directory
WORKDIR /usr/src/app/frontend

# Install dependencies
COPY package.json ./
COPY package-lock.json ./

# Install app dependencies
RUN npm install
RUN npm install react-scripts@3.4.1 -g 

# Copy app files
COPY . .

# Expose the port on which the app will be running
EXPOSE 3000

# Start app
CMD ["npm", "start"]

# # Set env to production
# ENV NODE_ENV production


# # Start the app
# CMD [ "npx", "serve", "build" ]