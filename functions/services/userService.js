import { getDB } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION_NAME = 'users';

class UserService {
  constructor() {
    this.db = null;
  }

  getCollection() {
    if (!this.db) {
      this.db = getDB();
    }
    return this.db.collection(COLLECTION_NAME);
  }

  // Find user by Google ID
  async findByGoogleId(googleId) {
    const snapshot = await this.getCollection()
      .where('googleId', '==', googleId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      _id: doc.id,
      id: doc.id,
      ...doc.data(),
    };
  }

  // Find user by ID
  async findById(userId) {
    const doc = await this.getCollection().doc(userId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      _id: doc.id,
      id: doc.id,
      ...doc.data(),
    };
  }

  // Create new user
  async create(userData) {
    const userRef = this.getCollection().doc();
    const newUser = {
      ...userData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await userRef.set(newUser);

    // Fetch the created document to get the server timestamp
    const doc = await userRef.get();
    return {
      _id: doc.id,
      id: doc.id,
      ...doc.data(),
    };
  }

  // Update user
  async update(userId, updateData) {
    const userRef = this.getCollection().doc(userId);
    const updates = {
      ...updateData,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await userRef.update(updates);

    // Fetch the updated document
    const doc = await userRef.get();
    return {
      _id: doc.id,
      id: doc.id,
      ...doc.data(),
    };
  }
}

export default new UserService();

