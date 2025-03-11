const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'your-mongodb-connection-string-here';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');

        // Initialize GridFSBucket only when the connection is open
        return new GridFSBucket(conn.connection.db, { bucketName: 'videos' });
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Stop the server if the database connection fails
    }
};

module.exports = connectDB;
