import { registerAs } from "@nestjs/config";

export default registerAs('mongodb', () => ({
  // uri: `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}?authSource=${process.env.MONGODB_AUTH_SOURCE}`,
  uri: process.env.MONGODB_URI || 'localhost',
  host: process.env.MONGODB_HOST || 'localhost',  // Default to localhost if not specified
  port: parseInt(process.env.MONGODB_PORT, 10) || 27017,  // Default MongoDB port
  username: process.env.MONGODB_USERNAME || 'admin',
  password: process.env.MONGODB_PASSWORD || 'secret',
  database: process.env.MONGODB_DATABASE || 'mydatabase',  // Specify the database you want to use
  authSource: process.env.MONGODB_AUTH_SOURCE || 'admin',  // The authentication database
}));