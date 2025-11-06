#!/usr/bin/env node

/**
 * Fix .env FIREBASE_SERVICE_ACCOUNT JSON formatting
 *
 * This script reads your .env file and properly formats the
 * FIREBASE_SERVICE_ACCOUNT JSON to be on a single line.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');

console.log('🔧 Fixing .env FIREBASE_SERVICE_ACCOUNT formatting...\n');

if (!existsSync(envPath)) {
  console.error('❌ .env file not found at:', envPath);
  process.exit(1);
}

try {
  // Read .env file
  let content = readFileSync(envPath, 'utf8');
  const lines = content.split('\n');

  let inServiceAccount = false;
  let serviceAccountLines = [];
  let newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Start of service account
    if (line.startsWith('FIREBASE_SERVICE_ACCOUNT=')) {
      inServiceAccount = true;
      serviceAccountLines.push(line.substring('FIREBASE_SERVICE_ACCOUNT='.length));
      continue;
    }

    // Continue collecting service account lines
    if (inServiceAccount) {
      if (line.endsWith('}') || line.endsWith('}"') || line.endsWith("}")) {
        serviceAccountLines.push(line);
        inServiceAccount = false;

        // Join all service account lines
        let jsonString = serviceAccountLines.join('').trim();

        // Remove quotes if present
        if (jsonString.startsWith('"') && jsonString.endsWith('"')) {
          jsonString = jsonString.slice(1, -1);
        }
        if (jsonString.startsWith("'") && jsonString.endsWith("'")) {
          jsonString = jsonString.slice(1, -1);
        }

        // Remove any escaped newlines
        jsonString = jsonString.replace(/\\n/g, '');
        jsonString = jsonString.replace(/\n/g, '');

        // Try to parse and re-stringify to validate
        try {
          const parsed = JSON.parse(jsonString);
          const singleLine = JSON.stringify(parsed);
          newLines.push(`FIREBASE_SERVICE_ACCOUNT=${singleLine}`);
          console.log('✅ Fixed FIREBASE_SERVICE_ACCOUNT');
          console.log('   Project ID:', parsed.project_id);
        } catch (e) {
          console.error('❌ Invalid JSON:', e.message);
          console.log('   Original lines:', serviceAccountLines.length);
          newLines.push(`# FIREBASE_SERVICE_ACCOUNT=${serviceAccountLines.join('')}`);
          console.log('⚠️  Commented out invalid JSON. Please fix manually.');
        }

        serviceAccountLines = [];
        continue;
      } else {
        serviceAccountLines.push(line);
        continue;
      }
    }

    // Regular line
    newLines.push(lines[i]);
  }

  // Write back
  writeFileSync(envPath, newLines.join('\n'));
  console.log('\n✅ .env file updated!');
  console.log('\n🚀 Now restart your server: npm run dev\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

