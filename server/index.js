import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import documentRoutes from './routes/document.js';
import routes from './routes/auth.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true,              
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());



app.use('/routes', routes);

app.use('/api/documents',documentRoutes);

app.get('/api/dashboard', (req, res) => {
  res.json({ message: 'Welcome to the dashboard' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
