import { initializeApp, cert, getApps } from 'firebase-admin/app';
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

    // For development, we'll use application default credentials or service account
    // You can use Firebase without a service account file in some cases
    const firebaseConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID || 'expense-tracker-demo',
    };

    // If service account key is provided
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        initializeApp({
          credential: cert(serviceAccount),
          ...firebaseConfig,
        });
      } catch (error) {
        console.log('⚠️  No service account found, using application default credentials');
        initializeApp(firebaseConfig);
      }
    } else {
      // Initialize without service account (for local emulator or default credentials)
      initializeApp(firebaseConfig);
    }

    db = getFirestore();

    // Configure Firestore settings
    db.settings({
      ignoreUndefinedProperties: true,
    });

    console.log('✅ Firebase initialized successfully');
    console.log('📦 Project ID:', firebaseConfig.projectId);

    return db;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
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

