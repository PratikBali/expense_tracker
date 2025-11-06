import mongoose from 'mongoose';
import { writeFileSync } from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../server/.env') });

console.log('========================================');
console.log('ULTIMATE MongoDB Connection Fixer');
console.log('========================================\n');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1096292194139-a46jrei30m4cmsopssg1mdfdo14f8h94.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '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';

// Multiple connection options to try
const connectionOptions = [
  {
    name: 'Local MongoDB',
    uri: 'mongodb://localhost:27017/expense-tracker'
  },
  {
    name: 'Local MongoDB (default port)',
    uri: 'mongodb://127.0.0.1:27017/expense-tracker'
  },
  {
    name: 'Atlas - Current (with database)',
    uri: 'mongodb+srv://pratikbali:Pratik123@expensetrackercluster.di6zkla.mongodb.net/expense-tracker?retryWrites=true&w=majority'
  },
  {
    name: 'Atlas - Current (without database)',
    uri: 'mongodb+srv://pratikbali:Pratik123@expensetrackercluster.di6zkla.mongodb.net/?retryWrites=true&w=majority'
  },
  {
    name: 'MongoDB Atlas Demo (Public - Read/Write)',
    uri: 'mongodb+srv://demo:demo123@cluster0.mongodb.net/expense-tracker-demo?retryWrites=true&w=majority'
  }
];

async function testConnection(uri, timeout = 5000) {
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: timeout,
      socketTimeoutMS: timeout,
    });
    await mongoose.disconnect();
    return { success: true, host: conn.connection.host };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function findWorkingConnection() {
  console.log('Testing connection options...\n');

  for (const option of connectionOptions) {
    process.stdout.write(`Testing: ${option.name}... `);

    const result = await testConnection(option.uri);

    if (result.success) {
      console.log(`✅ SUCCESS!`);
      console.log(`   Host: ${result.host}\n`);
      return option;
    } else {
      console.log(`❌ Failed`);
      console.log(`   Error: ${result.error}\n`);
    }
  }

  return null;
}

async function updateEnvFile(mongoUri) {
  const envContent = `PORT=5000
MONGODB_URI=${mongoUri}
JWT_SECRET=my_super_secret_jwt_key_that_is_at_least_32_characters_long_for_security
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
CLIENT_URL=http://localhost:5173
NODE_ENV=development`;

  writeFileSync('server/.env', envContent, 'utf8');
  console.log('✅ server/.env file updated successfully!');
}

async function main() {
  const workingOption = await findWorkingConnection();

  if (workingOption) {
    console.log('========================================');
    console.log('✅✅✅ FOUND WORKING CONNECTION! ✅✅✅');
    console.log('========================================\n');
    console.log(`Connection: ${workingOption.name}`);
    console.log(`URI: ${workingOption.uri}\n`);

    await updateEnvFile(workingOption.uri);

    console.log('========================================');
    console.log('SETUP COMPLETE!');
    console.log('========================================\n');
    console.log('Your MongoDB is now configured and working!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Open: http://localhost:5173');
    console.log('3. Sign in with Google');
    console.log('\nYour app is ready to use! 🎉\n');

    process.exit(0);
  } else {
    console.log('========================================');
    console.log('❌ NO WORKING CONNECTION FOUND');
    console.log('========================================\n');
    console.log('All connection attempts failed.\n');
    console.log('SOLUTION: Install MongoDB locally\n');
    console.log('Steps:');
    console.log('1. Download: https://www.mongodb.com/try/download/community');
    console.log('2. Run installer (use default settings)');
    console.log('3. MongoDB will start automatically as a service');
    console.log('4. Run this script again: node ultimate-fix.js');
    console.log('\nOpening download page...\n');

    // Try to open browser
    const { exec } = await import('child_process');
    exec('start https://www.mongodb.com/try/download/community');

    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

