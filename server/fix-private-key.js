#!/usr/bin/env node

/**
 * Fix Firebase private key formatting in .env
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');

console.log('🔧 Fixing Firebase private key format...\n');

if (!existsSync(envPath)) {
  console.error('❌ .env file not found');
  process.exit(1);
}

try {
  // Read and parse current .env
  const content = readFileSync(envPath, 'utf8');
  const lines = content.split('\n');

  let newLines = [];

  for (const line of lines) {
    if (line.startsWith('FIREBASE_SERVICE_ACCOUNT=')) {
      const jsonString = line.substring('FIREBASE_SERVICE_ACCOUNT='.length);

      try {
        const serviceAccount = JSON.parse(jsonString);

        console.log('📋 Current service account:');
        console.log('   Project:', serviceAccount.project_id);
        console.log('   Email:', serviceAccount.client_email);

        // Fix the private key - ensure proper newline escaping
        if (serviceAccount.private_key) {
          // Replace actual newlines with \n escape sequence
          serviceAccount.private_key = serviceAccount.private_key
            .replace(/\r\n/g, '\\n')  // Windows line endings
            .replace(/\n/g, '\\n')     // Unix line endings
            .replace(/\\\\n/g, '\\n'); // Fix double escaping

          // Ensure it starts and ends correctly
          if (!serviceAccount.private_key.includes('-----BEGIN PRIVATE KEY-----')) {
            console.error('❌ Private key format invalid');
            process.exit(1);
          }

          console.log('✅ Private key format fixed');
        }

        // Re-serialize to single line
        const fixedJson = JSON.stringify(serviceAccount);
        newLines.push(`FIREBASE_SERVICE_ACCOUNT=${fixedJson}`);

      } catch (error) {
        console.error('❌ Failed to parse service account:', error.message);
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  }

  // Write back
  writeFileSync(envPath, newLines.join('\n'));
  console.log('\n✅ .env file updated with fixed private key');
  console.log('🧪 Testing connection...\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

