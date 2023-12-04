# Use an official Node runtime as a parent image
FROM node:18 as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies and TypeScript compiler
RUN npm install

# Copy the rest of your application's code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Use a smaller base image for the production build
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy compiled JavaScript from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Define the command to run your app
CMD [ "node", "dist/app.js" ]
