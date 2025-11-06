#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

console.log('🔧 Updating .env to use file-based authentication...\n');

const envPath = '.env';
let content = readFileSync(envPath, 'utf8');
const lines = content.split('\n');
const newLines = [];

let foundServiceAccount = false;
let foundGoogleCreds = false;

for (const line of lines) {
  // Comment out FIREBASE_SERVICE_ACCOUNT if it exists
  if (line.startsWith('FIREBASE_SERVICE_ACCOUNT=')) {
    newLines.push('# ' + line + ' # Using file-based auth instead');
    foundServiceAccount = true;
  }
  // Update or keep GOOGLE_APPLICATION_CREDENTIALS
  else if (line.startsWith('GOOGLE_APPLICATION_CREDENTIALS=')) {
    newLines.push('GOOGLE_APPLICATION_CREDENTIALS=./firebase-key.json');
    foundGoogleCreds = true;
  }
  else if (line.startsWith('#GOOGLE_APPLICATION_CREDENTIALS=')) {
    newLines.push('GOOGLE_APPLICATION_CREDENTIALS=./firebase-key.json');
    foundGoogleCreds = true;
  }
  else {
    newLines.push(line);
  }
}

// Add GOOGLE_APPLICATION_CREDENTIALS if not found
if (!foundGoogleCreds) {
  newLines.push('GOOGLE_APPLICATION_CREDENTIALS=./firebase-key.json');
}

writeFileSync(envPath, newLines.join('\n'));

console.log('✅ Updated .env:');
if (foundServiceAccount) {
  console.log('   - Commented out FIREBASE_SERVICE_ACCOUNT');
}
console.log('   - Set GOOGLE_APPLICATION_CREDENTIALS=./firebase-key.json');
console.log('\n🧪 Testing connection...\n');

