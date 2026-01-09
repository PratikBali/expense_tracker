import 'dotenv/config';

import { initializeApp, cert, getApps, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
let db;

const getProjectId = () => {
  const envProjectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT ||
    process.env.GCP_PROJECT;

  if (envProjectId) return envProjectId;

  try {
    if (process.env.FIREBASE_CONFIG) {
      const parsed = JSON.parse(process.env.FIREBASE_CONFIG);
      if (parsed?.projectId) return parsed.projectId;
    }
  } catch {
    // ignore
  }

  return 'expense-tracker-demo';
};

const isFirebaseRuntime = () =>
  Boolean(process.env.FUNCTION_TARGET || process.env.K_SERVICE || process.env.FIREBASE_CONFIG);

export const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (getApps().length > 0) {
      db = getFirestore();
      return db;
    }

    const projectId = getProjectId();
    let app;

    // Firebase Functions / Cloud Run: use application default credentials
    if (isFirebaseRuntime()) {
      app = initializeApp({
        credential: applicationDefault(),
        projectId,
      });
    }
    // Priority 1: Use Base64 encoded service account
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      const base64Credentials = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
      const jsonString = Buffer.from(base64Credentials, 'base64').toString('utf8');
      const serviceAccount = JSON.parse(jsonString);
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId,
      });
    }
    // Priority 2: Use JSON service account
    else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId,
      });
    }
    // Priority 3: File-based credentials (GOOGLE_APPLICATION_CREDENTIALS)
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      app = initializeApp({
        credential: applicationDefault(),
        projectId,
      });
    }
    // Priority 4: Emulator / local dev (no credentials needed)
    else if (process.env.FIRESTORE_EMULATOR_HOST) {
      app = initializeApp({ projectId });
    }
    // Priority 5: Try ADC (works on many environments) or fail with guidance
    else {
      app = initializeApp({ projectId });
    }

    db = getFirestore(app);
    db.settings({ ignoreUndefinedProperties: true });

    return db;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    throw error;
  }
};

export const getDB = () => {
  if (!db) return initializeFirebase();
  return db;
};

export default { initializeFirebase, getDB };

