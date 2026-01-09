import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeFirebase } from './config/firebase.js';
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';

async function setupViteDevServer(appInstance) {
  const clientRoot = path.join(__dirname, '..', 'client');
  const indexHtmlPath = path.join(clientRoot, 'index.html');

  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    root: clientRoot,
    server: {
      middlewareMode: true,
    },
    appType: 'spa',
  });

  appInstance.use(vite.middlewares);

  // Serve index.html for all non-API routes
  appInstance.get('*', async (req, res, next) => {
    if (req.path.startsWith('/api')) return next();

    try {
      const url = req.originalUrl;
      let template = fs.readFileSync(indexHtmlPath, 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      next(error);
    }
  });

  return vite;
}

// Initialize Firebase Firestore
try {
  initializeFirebase();
  console.log('✅ Firebase Firestore connected successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  console.error('⚠️  Server will continue but database operations will fail');
}

// Security middleware
app.use(helmet({
  // Vite dev server needs relaxed headers for HMR + module loading
  contentSecurityPolicy: isProduction ? undefined : false,
  crossOriginEmbedderPolicy: isProduction ? undefined : false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const enableCors = !isProduction || Boolean(process.env.CLIENT_URL);

if (enableCors) {
  app.use(cors({
    origin: clientUrl,
    credentials: true
  }));
}

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

async function startServer() {
  let vite = null;

  if (isProduction) {
    // Serve frontend (production only, if built)
    const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
    const clientIndexPath = path.join(clientDistPath, 'index.html');

    if (fs.existsSync(clientIndexPath)) {
      app.use(express.static(clientDistPath));

      // SPA fallback (avoid intercepting API routes)
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        return res.sendFile(clientIndexPath);
      });
    }
  } else {
    // Dev: serve React app via Vite middleware on the SAME port as the API
    vite = await setupViteDevServer(app);
  }

  // Error handler (must be last)
  app.use(errorHandler);

  const httpServer = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  });

  if (vite) {
    vite.ws.listen(httpServer);
  }
}

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

