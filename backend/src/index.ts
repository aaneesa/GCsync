import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import sessionRoutes from './routes/sessionRoutes';
import telemetryRoutes from './routes/telemetryRoutes';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/telemetry', telemetryRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('GCsync Backend API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
