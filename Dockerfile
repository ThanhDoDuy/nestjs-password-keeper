# Stage 1: Build the app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file to the working directory
COPY .env.development .env.development

# Build the application
RUN npm run build

# Stage 2: Run the app
FROM node:18

# Set the working directory in the second stage
WORKDIR /app

# Copy the build output and node_modules from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/.env .env

# Expose the application port (change 3000 to your app's port if different)
EXPOSE 4000

# Run the application
CMD ["node", "dist/main"]