import { initializeApp, cert, getApps, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
let db;

export const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (getApps().length > 0) {
      console.log('✅ Firebase already initialized');
      db = getFirestore();
      return db;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || 'expense-tracker-demo';

    console.log('🔥 Initializing Firebase...');
    console.log('📦 Project ID:', projectId);

    let app;

    // Priority 1: Use service account if provided (production/secure)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        console.log('🔐 Using service account credentials');
        app = initializeApp({
          credential: cert(serviceAccount),
          projectId: projectId,
        });
      } catch (error) {
        console.error('❌ Failed to parse service account:', error.message);
        throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT JSON');
      }
    }
    // Priority 2: Use emulator for local development (no credentials needed)
    else if (process.env.FIRESTORE_EMULATOR_HOST) {
      console.log('🧪 Using Firestore Emulator:', process.env.FIRESTORE_EMULATOR_HOST);
      app = initializeApp({
        projectId: projectId,
      });
    }
    // Priority 3: Try application default credentials (requires gcloud SDK)
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.log('🔐 Using Application Default Credentials');
      app = initializeApp({
        credential: applicationDefault(),
        projectId: projectId,
      });
    }
    // Priority 4: Development mode with warning
    else {
      console.warn('⚠️  WARNING: No Firebase credentials found!');
      console.warn('⚠️  For production, you MUST provide credentials.');
      console.warn('⚠️  For development, use one of these options:');
      console.warn('   1. Set FIREBASE_SERVICE_ACCOUNT in .env');
      console.warn('   2. Use Firebase Emulator: npm install -g firebase-tools && firebase emulators:start');
      console.warn('   3. Set GOOGLE_APPLICATION_CREDENTIALS path');
      console.warn('');
      console.log('🧪 Attempting to initialize in development mode...');

      // Try to initialize without credentials (will work with emulator)
      try {
        app = initializeApp({
          projectId: projectId,
        });
      } catch (error) {
        throw new Error(
          'Firebase initialization failed. Please set up credentials. See FIREBASE_SETUP.md for instructions.'
        );
      }
    }

    db = getFirestore(app);

    // Configure Firestore settings
    db.settings({
      ignoreUndefinedProperties: true,
    });

    console.log('✅ Firebase Firestore connected successfully');

    return db;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.error('💡 See FIREBASE_SETUP.md for setup instructions');
    throw error;
  }
};

export const getDB = () => {
  if (!db) {
    return initializeFirebase();
  }
  return db;
};

export default { initializeFirebase, getDB };

