#!/usr/bin/env node

/**
 * Firebase Service Account Setup Helper
 *
 * This script helps you set up Firebase credentials for your expense tracker.
 *
 * QUICK SETUP (5 minutes):
 *
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Select your project (or create one)
 * 3. Click the gear icon ⚙️ → Project Settings
 * 4. Go to "Service Accounts" tab
 * 5. Click "Generate New Private Key"
 * 6. Download the JSON file
 * 7. Run this script: node setup-firebase-credentials.js path/to/your-key.json
 *
 * OR manually add to .env:
 * FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project",...}
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '.env');

function setupFirebaseCredentials(serviceAccountPath) {
  try {
    console.log('🔥 Firebase Credentials Setup\n');

    // Check if service account file exists
    if (!existsSync(serviceAccountPath)) {
      console.error('❌ Error: Service account file not found:', serviceAccountPath);
      console.log('\n📝 Steps to get your service account key:');
      console.log('1. Go to https://console.firebase.google.com/');
      console.log('2. Select your project');
      console.log('3. Click ⚙️  → Project Settings → Service Accounts');
      console.log('4. Click "Generate New Private Key"');
      console.log('5. Download the JSON file');
      console.log('6. Run: node setup-firebase-credentials.js path/to/key.json\n');
      process.exit(1);
    }

    // Read service account JSON
    console.log('📖 Reading service account file...');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

    // Validate required fields
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      console.error('❌ Error: Invalid service account file. Missing required fields.');
      process.exit(1);
    }

    console.log('✅ Service account validated');
    console.log('   Project ID:', serviceAccount.project_id);
    console.log('   Client Email:', serviceAccount.client_email);

    // Read existing .env or create new one
    let envContent = '';
    if (existsSync(envPath)) {
      console.log('\n📝 Reading existing .env file...');
      envContent = readFileSync(envPath, 'utf8');
    } else {
      console.log('\n📝 Creating new .env file...');
    }

    // Prepare service account as single line JSON
    const serviceAccountString = JSON.stringify(serviceAccount).replace(/\n/g, '');

    // Update or add FIREBASE_SERVICE_ACCOUNT
    const lines = envContent.split('\n');
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('FIREBASE_SERVICE_ACCOUNT=') ||
          lines[i].startsWith('#FIREBASE_SERVICE_ACCOUNT=')) {
        lines[i] = `FIREBASE_SERVICE_ACCOUNT=${serviceAccountString}`;
        updated = true;
        break;
      }
    }

    if (!updated) {
      lines.push(`FIREBASE_SERVICE_ACCOUNT=${serviceAccountString}`);
    }

    // Also update or add FIREBASE_PROJECT_ID
    updated = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('FIREBASE_PROJECT_ID=') ||
          lines[i].startsWith('#FIREBASE_PROJECT_ID=')) {
        lines[i] = `FIREBASE_PROJECT_ID=${serviceAccount.project_id}`;
        updated = true;
        break;
      }
    }

    if (!updated) {
      lines.push(`FIREBASE_PROJECT_ID=${serviceAccount.project_id}`);
    }

    // Write back to .env
    writeFileSync(envPath, lines.join('\n'));

    console.log('\n✅ Firebase credentials added to .env');
    console.log('✅ FIREBASE_PROJECT_ID set to:', serviceAccount.project_id);
    console.log('\n🚀 You can now start your server:');
    console.log('   npm run dev\n');
    console.log('⚠️  SECURITY WARNING:');
    console.log('   - Never commit .env to Git');
    console.log('   - Keep your service account key secure');
    console.log('   - Use environment variables in production\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Main
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('🔥 Firebase Credentials Setup Helper\n');
  console.log('Usage: node setup-firebase-credentials.js <path-to-service-account.json>\n');
  console.log('📝 Quick Steps:');
  console.log('1. Go to https://console.firebase.google.com/');
  console.log('2. Select your project (or create one)');
  console.log('3. Click ⚙️  → Project Settings → Service Accounts');
  console.log('4. Click "Generate New Private Key"');
  console.log('5. Download the JSON file');
  console.log('6. Run: node setup-firebase-credentials.js path/to/key.json\n');
  console.log('📚 For more detailed setup instructions, see:');
  console.log('   - FIREBASE_SETUP.md');
  console.log('   - QUICK_START_FIREBASE.md\n');
  process.exit(0);
}

setupFirebaseCredentials(args[0]);

