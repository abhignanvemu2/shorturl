const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', true);

const db = async () => {
    const uri = process.env.CONNECTION_STRING;
    if (!uri) {
        console.error('MongoDB connection string is missing');
        return;
    }
    try {
        // Connect to the MongoDB server with Mongoose
        await mongoose.connect(uri);
        console.log("Database Connected");
    } catch (error) {
        console.error("Connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = db;
