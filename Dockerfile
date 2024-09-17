# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm cache clean --force && node --max-old-space-size=4096 $(which npm) install --verbose

# Copy the rest of the application code to the container
COPY . .

# Copy the .env.development file to the working directory
COPY .env.development .env

# Build the NestJS application
RUN npm run build

# Expose the port on which the app will run
EXPOSE 5000

# Define the command to run the app
CMD ["npm", "run", "start:prod"]
