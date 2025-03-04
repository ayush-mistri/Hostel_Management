const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/hostel";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log('MongoDB connection SUCCESS');
        console.log("MongoDB Atlas Connected ✅");
    } catch (error) {
        console.error('MongoDB connection FAIL');
        process.exit(1);
    }
    };

module.exports = connectDB;