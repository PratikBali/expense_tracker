#!/usr/bin/env node

/**
 * Encode Firebase service account JSON to Base64 for use in environment variables
 * This is the most reliable way to store JSON credentials in .env files on Windows
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const keyFilePath = join(process.cwd(), 'firebase-key.json');
const envPath = join(process.cwd(), '.env');

console.log('🔧 Encoding Firebase credentials to Base64...\n');

try {
  // Read the service account JSON
  const serviceAccountText = readFileSync(keyFilePath, 'utf8');
  const serviceAccount = JSON.parse(serviceAccountText); // Validate it's valid JSON

  console.log('✅ Successfully read firebase-key.json');
  console.log('   Project:', serviceAccount.project_id);
  console.log('');

  // Encode to Base64
  const base64String = Buffer.from(serviceAccountText).toString('base64');

  console.log('✅ Encoded to Base64');
  console.log('📏 Length:', base64String.length, 'characters');
  console.log('');

  // Read existing .env
  let envContent = '';
  try {
    envContent = readFileSync(envPath, 'utf8');
  } catch (e) {
    console.log('⚠️  No existing .env found, creating new one');
  }

  const lines = envContent.split('\n');
  const newLines = [];
  let foundBase64 = false;

  for (const line of lines) {
    // Comment out old auth methods
    if (line.startsWith('GOOGLE_APPLICATION_CREDENTIALS=')) {
      newLines.push('# ' + line + ' # Switched to Base64');
    } else if (line.startsWith('FIREBASE_SERVICE_ACCOUNT=')) {
      newLines.push('# ' + line + ' # Switched to Base64');
    } else if (line.startsWith('FIREBASE_SERVICE_ACCOUNT_BASE64=') ||
               line.startsWith('# FIREBASE_SERVICE_ACCOUNT_BASE64=')) {
      if (!foundBase64) {
        newLines.push(`FIREBASE_SERVICE_ACCOUNT_BASE64=${base64String}`);
        foundBase64 = true;
      }
    } else {
      newLines.push(line);
    }
  }

  // Add if not found
  if (!foundBase64) {
    newLines.push('');
    newLines.push('# Firebase Service Account (Base64 encoded)');
    newLines.push(`FIREBASE_SERVICE_ACCOUNT_BASE64=${base64String}`);
  }

  // Write back
  writeFileSync(envPath, newLines.join('\n'));

  console.log('✅ Updated .env file successfully!');
  console.log('   Added: FIREBASE_SERVICE_ACCOUNT_BASE64');
  console.log('   Commented out: Other auth methods');
  console.log('');
  console.log('🧪 Test connection: npm run test-firebase');
  console.log('🚀 Start servers: npm run dev');
  console.log('');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('');
  console.error('💡 Make sure:');
  console.error('   - firebase-key.json exists in server/ directory');
  console.error('   - The JSON file is valid');
  process.exit(1);
}

