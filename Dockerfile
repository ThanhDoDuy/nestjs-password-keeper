# Stage 1: Build
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /thanhdd/backend-nest

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
COPY .env.development .env
# Install app dependencies
RUN npm install

# Install Nest CLI globally for building the app
RUN npm i -g @nestjs/cli

# Copy the rest of the application source code
COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Create app directory
WORKDIR /thanhdd/backend-nest

# Copy only the necessary files from the builder stage
COPY --from=builder /thanhdd/backend-nest/dist ./dist
COPY --from=builder /thanhdd/backend-nest/node_modules ./node_modules
COPY --from=builder /thanhdd/backend-nest/.env .env
COPY package*.json ./

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
