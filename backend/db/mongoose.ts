import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ override: true }); // Load environment variables

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/banditbreakout';

export async function connectToDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`Connected to MongoDB database ${MONGODB_URI}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export async function disconnectFromDatabase() {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB database');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        throw error;
    }
}
