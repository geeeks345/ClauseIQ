const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clauseiq', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[ClauseIQ Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[ClauseIQ Database Error] MongoDB Connection Failed: ${error.message}`);
    // Do not crash server in dev so health check routes can communicate state
  }
};

module.exports = connectDB;
