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

const app = express();

// Body Parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/reports', reports);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Civix API' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
