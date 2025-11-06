import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../server/.env') });

console.log('Testing MongoDB connection...\n');
console.log('Connection String:', process.env.MONGODB_URI);
console.log('\nAttempting to connect...\n');

const testConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ SUCCESS! MongoDB Connected:', conn.connection.host);
    console.log('✅ Database:', conn.connection.name);
    console.log('✅ Ready State:', conn.connection.readyState);

    await mongoose.disconnect();
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed!');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
};

testConnection();

