import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { onRequest } from 'firebase-functions/v2/https';

import passport from './config/passport.js';
import { initializeFirebase } from './config/firebase.js';
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Behind Firebase Hosting/Cloud Run proxies
app.set('trust proxy', true);

// Initialize Firebase Admin SDK (uses default credentials in Functions)
try {
  initializeFirebase();
  console.log('✅ Firebase Firestore connected successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  console.error('⚠️  Server will continue but database operations will fail');
}

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

// CORS (optional; same-origin via Hosting rewrite does not require this)
const enableCors = Boolean(process.env.CLIENT_URL);
if (enableCors) {
  app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }));
}

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

export const api = onRequest(app);

