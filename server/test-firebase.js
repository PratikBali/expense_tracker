import dotenv from 'dotenv';
dotenv.config();

import { initializeFirebase, getDB } from './config/firebase.js';

async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase Firestore Connection...\n');

  try {
    // Initialize Firebase
    const db = initializeFirebase();
    console.log('✅ Firebase initialized\n');

    // Test write operation
    console.log('📝 Testing write operation...');
    const testRef = db.collection('_test').doc('connection-test');
    await testRef.set({
      message: 'Firebase connection test',
      timestamp: new Date().toISOString(),
      success: true,
    });
    console.log('✅ Write successful\n');

    // Test read operation
    console.log('📖 Testing read operation...');
    const doc = await testRef.get();
    if (doc.exists) {
      console.log('✅ Read successful');
      console.log('📄 Data:', doc.data());
    }
    console.log('');

    // Test delete operation
    console.log('🗑️  Testing delete operation...');
    await testRef.delete();
    console.log('✅ Delete successful\n');

    // Verify deletion
    const deletedDoc = await testRef.get();
    if (!deletedDoc.exists) {
      console.log('✅ Verification successful - document deleted\n');
    }

    console.log('✨ All Firebase tests passed!');
    console.log('🎉 Firestore is ready to use!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
    console.error('\n📋 Error details:', error);
    console.error('\n💡 Tip: Make sure your Firebase project is set up correctly');
    console.error('   - Set FIREBASE_PROJECT_ID in .env');
    console.error('   - Or provide FIREBASE_SERVICE_ACCOUNT JSON\n');
    process.exit(1);
  }
}

testFirebaseConnection();

