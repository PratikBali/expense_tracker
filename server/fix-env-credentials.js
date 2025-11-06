#!/usr/bin/env node

/**
 * Fix Firebase credentials in .env file
 * Properly formats the JSON for environment variable use
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const keyFilePath = join(process.cwd(), 'firebase-key.json');
const envPath = join(process.cwd(), '.env');

console.log('🔧 Fixing Firebase credentials in .env...\n');

try {
  // Read the service account JSON
  const serviceAccountText = readFileSync(keyFilePath, 'utf8');
  const serviceAccount = JSON.parse(serviceAccountText);

  console.log('✅ Successfully parsed firebase-key.json');
  console.log('   Project:', serviceAccount.project_id);
  console.log('');

  // Properly escape the private key - this is critical!
  // We need to replace actual newlines with the literal string "\\n"
  const escapedPrivateKey = serviceAccount.private_key
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/\n/g, '\\n')   // Replace newlines with \n
    .replace(/"/g, '\\"');   // Escape quotes

  // Create the service account object with escaped key
  const escapedServiceAccount = {
    ...serviceAccount,
    private_key: escapedPrivateKey
  };

  // Convert to JSON string - but we need to re-escape it for .env
  const jsonString = JSON.stringify(escapedServiceAccount)
    .replace(/\\\\/g, '\\\\\\\\');  // Double escape backslashes for .env

  console.log('✅ Credentials properly formatted');
  console.log('📏 Length:', jsonString.length, 'characters');
  console.log('');

  // Read existing .env
  let envContent = '';
  try {
    envContent = readFileSync(envPath, 'utf8');
  } catch (e) {
    console.log('⚠️  Creating new .env file');
  }

  const lines = envContent.split('\n');
  const newLines = [];
  let foundServiceAccount = false;
  let foundGoogleCreds = false;

  for (const line of lines) {
    if (line.startsWith('FIREBASE_SERVICE_ACCOUNT=') || line.startsWith('# FIREBASE_SERVICE_ACCOUNT=')) {
      if (!foundServiceAccount) {
        newLines.push(`FIREBASE_SERVICE_ACCOUNT=${jsonString}`);
        foundServiceAccount = true;
      }
    } else if (line.startsWith('GOOGLE_APPLICATION_CREDENTIALS=')) {
      newLines.push('# ' + line + ' # Using FIREBASE_SERVICE_ACCOUNT instead');
      foundGoogleCreds = true;
    } else if (!line.startsWith('FIREBASE_SERVICE_ACCOUNT=')) {
      newLines.push(line);
    }
  }

  // Add if not found
  if (!foundServiceAccount) {
    newLines.push('');
    newLines.push('# Firebase Service Account (JSON format)');
    newLines.push(`FIREBASE_SERVICE_ACCOUNT=${jsonString}`);
  }

  // Write back
  writeFileSync(envPath, newLines.join('\n'));

  console.log('✅ Updated .env file successfully!');
  console.log('');
  console.log('🧪 Now test with: npm run test-firebase');
  console.log('');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}

