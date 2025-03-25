const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./src/routes/index');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const socket = require('./src/utils/socket');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Verify environment variables
console.log('Environment Variables:', {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/SDN')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if DB connection fails
  });

// Create HTTP server
const server = http.createServer(app);
socket.init(server);

// CORS configuration
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:3000'],
  credentials: true
}));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Start server
const port = process.env.PORT || 3333;
const host = '127.0.0.1'; // You can keep this hardcoded or use from env if needed

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});