#!/usr/bin/env node

/**
 * Convert Firebase service account JSON file to .env format
 * This properly escapes the private key for use in environment variables
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const keyFilePath = join(process.cwd(), 'firebase-key.json');
const envPath = join(process.cwd(), '.env');

console.log('🔧 Converting Firebase JSON to .env format...\n');

try {
  // Read the service account JSON
  const serviceAccount = JSON.parse(readFileSync(keyFilePath, 'utf8'));

  console.log('📋 Service Account Info:');
  console.log('   Project:', serviceAccount.project_id);
  console.log('   Email:', serviceAccount.client_email);
  console.log('');

  // The KEY is to properly escape the private key
  // Replace actual newlines with the string "\n" (not the newline character)
  const fixedServiceAccount = {
    ...serviceAccount,
    private_key: serviceAccount.private_key.replace(/\n/g, '\\n')
  };

  // Convert to single-line JSON string
  const jsonString = JSON.stringify(fixedServiceAccount);

  console.log('✅ JSON properly formatted for .env');
  console.log('📏 Length:', jsonString.length, 'characters');
  console.log('');

  // Read existing .env
  let envContent = '';
  try {
    envContent = readFileSync(envPath, 'utf8');
  } catch (e) {
    console.log('⚠️  No existing .env found, will create new one');
  }

  const lines = envContent.split('\n');
  const newLines = [];
  let replaced = false;

  // Replace or comment out file-based auth
  for (const line of lines) {
    if (line.startsWith('GOOGLE_APPLICATION_CREDENTIALS=')) {
      newLines.push('# ' + line + ' # Switched to env variable');
      newLines.push(`FIREBASE_SERVICE_ACCOUNT=${jsonString}`);
      replaced = true;
    } else if (line.startsWith('FIREBASE_SERVICE_ACCOUNT=')) {
      newLines.push(`FIREBASE_SERVICE_ACCOUNT=${jsonString}`);
      replaced = true;
    } else if (line.startsWith('# FIREBASE_SERVICE_ACCOUNT=')) {
      newLines.push(`FIREBASE_SERVICE_ACCOUNT=${jsonString}`);
      replaced = true;
    } else {
      newLines.push(line);
    }
  }

  // Add if not found
  if (!replaced) {
    newLines.push(`FIREBASE_SERVICE_ACCOUNT=${jsonString}`);
  }

  // Write back
  writeFileSync(envPath, newLines.join('\n'));

  console.log('✅ Updated .env file');
  console.log('   FIREBASE_SERVICE_ACCOUNT has been set');
  console.log('   GOOGLE_APPLICATION_CREDENTIALS has been commented out');
  console.log('');
  console.log('🧪 Testing connection...');
  console.log('   Run: npm run test-firebase\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('');
  console.log('💡 Make sure:');
  console.log('   - firebase-key.json exists in server/ directory');
  console.log('   - The JSON file is valid');
  process.exit(1);
}

