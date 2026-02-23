/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

const fixIndexes = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is undefined. Check .env file path.');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        // Drop the username index
        try {
            await mongoose.connection.collection('users').dropIndex('username_1');
            console.log('Dropped username_1 index.');
        } catch (err) {
            console.log('Index username_1 might not exist or already dropped:', err.message);
        }

        // Find users with null username and update them
        const users = await mongoose.connection.collection('users').find({ username: null }).toArray();
        console.log(`Found ${users.length} users with null username.`);

        for (const user of users) {
            const newUsername = (user.name || 'user').toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 10000);
            await mongoose.connection.collection('users').updateOne(
                { _id: user._id },
                { $set: { username: newUsername } }
            );
            console.log(`Updated user ${user._id} with username: ${newUsername}`);
        }

        // Indices will be recreated by Mongoose on app start if autoIndex is true (default in dev)
        // But we can ensure uniqueness is respected for future writes.

        console.log('Fix complete.');

    } catch (error) {
        console.error('Error fixing indexes:', error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        process.exit();
    }
};

fixIndexes();
