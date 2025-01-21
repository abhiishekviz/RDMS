
const dotenv= require('dotenv')
const express = require('express')
const cors = require('cors');
const verifyToken = require('../middleware/auth.js')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const authRoutes = require('../routes/auth.js')
const documentRoutes = require('../routes/Document.js');

dotenv.config();

const app = express();

// Middleware
const corsOptions = {
  origin: 'http://localhost:5175',  // Allow your frontend URL
  credentials: true,                // Allow cookies to be sent with the request
};

app.use(cors(corsOptions));  
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Protected route example
app.get('/api/dashboard', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to dashboard', user: req.user });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});