import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // const conn = await mongoose.connect("mongodb+srv://expenseUser:sZ6k9iFXnb9V3kry@expensetracker01.3vhosdw.mongodb.net/?appName=ExpenseTracker01", {
    // const conn = await mongoose.connect("mongodb+srv://expenseUser:qigHwfWxoaOEsvPx@expensetracker01.3vhosdw.mongodb.net/", {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

