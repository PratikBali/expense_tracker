#!/usr/bin/env node

/**
 * Output Firebase service account as Base64 (for Cloud Run env vars)
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const keyFilePath = join(process.cwd(), 'firebase-key.json');

try {
  const serviceAccountText = readFileSync(keyFilePath, 'utf8');
  JSON.parse(serviceAccountText); // Validate JSON
  const base64String = Buffer.from(serviceAccountText).toString('base64');
  console.log(base64String);
} catch (error) {
  console.error('ERROR: Could not read firebase-key.json');
  process.exit(1);
}

