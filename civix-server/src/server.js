const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Route files
const auth = require('./routes/auth');
const reports = require('./routes/reports');
const users = require('./routes/users');

const app = express();

// Body Parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://civi-x.vercel.app',
    'https://civi-p1vszfsxy-sauravs-projects-ce59e099.vercel.app',
    'https://civix-w7p1.onrender.com',
    process.env.CLIENT_URL // This is where it's used!
  ].filter(Boolean), // This removes undefined/null values
  credentials: true,
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/reports', reports);
app.use('/api/users', users);

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Civix API' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
