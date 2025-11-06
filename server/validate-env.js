#!/usr/bin/env node

/**
 * Validate .env Firebase configuration
 */

import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Validating Firebase Configuration...\n');

// Load .env
const envPath = join(__dirname, '.env');
if (!existsSync(envPath)) {
  console.error('❌ .env file not found');
  process.exit(1);
}

dotenv.config({ path: envPath });

// Check FIREBASE_PROJECT_ID
console.log('📦 FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || '❌ MISSING');

// Check FIREBASE_SERVICE_ACCOUNT
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.log('🔐 FIREBASE_SERVICE_ACCOUNT: ❌ MISSING\n');
  console.log('⚠️  You need to add Firebase credentials to .env');
  console.log('\nOptions:');
  console.log('1. Add service account: node setup-firebase-credentials.js <key-file.json>');
  console.log('2. Use emulator: Set FIRESTORE_EMULATOR_HOST=localhost:8080');
  console.log('3. See FIREBASE_CREDENTIALS_GUIDE.md for help\n');
  process.exit(1);
}

// Try to parse service account
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  console.log('🔐 FIREBASE_SERVICE_ACCOUNT: ✅ Valid JSON');
  console.log('   Type:', serviceAccount.type);
  console.log('   Project ID:', serviceAccount.project_id);
  console.log('   Client Email:', serviceAccount.client_email);

  // Check if project IDs match
  if (process.env.FIREBASE_PROJECT_ID !== serviceAccount.project_id) {
    console.log('\n⚠️  WARNING: Project ID mismatch!');
    console.log('   FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
    console.log('   Service Account Project:', serviceAccount.project_id);
    console.log('\n   These should match. Update .env to use:', serviceAccount.project_id);
  }

  // Validate required fields
  const required = ['type', 'project_id', 'private_key', 'client_email'];
  const missing = required.filter(field => !serviceAccount[field]);

  if (missing.length > 0) {
    console.log('\n❌ Service account missing fields:', missing.join(', '));
    process.exit(1);
  }

  console.log('\n✅ All Firebase credentials are valid!');
  console.log('🚀 You can start your server: npm run dev\n');

} catch (error) {
  console.log('🔐 FIREBASE_SERVICE_ACCOUNT: ❌ Invalid JSON');
  console.log('   Error:', error.message);
  console.log('\n💡 Common issues:');
  console.log('   - JSON must be on a single line');
  console.log('   - No line breaks inside the JSON');
  console.log('   - No extra quotes around the JSON');
  console.log('\n🔧 Try running: node fix-env-json.js\n');
  process.exit(1);
}

