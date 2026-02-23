/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User');

const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // 1. Delete user with email 'test@gmail.com'
        const res = await User.deleteOne({ email: 'test@gmail.com' });
        console.log(`Deleted 'test@gmail.com': ${res.deletedCount} found.`);

        // 2. Scan for others with missing username
        const others = await User.deleteMany({
            $or: [
                { username: { $exists: false } },
                { username: null }
            ]
        });
        console.log(`Deleted others with missing username: ${others.deletedCount}`);

    } catch (e) {
        console.error(e);
    } finally {
        if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
        process.exit();
    }
};

cleanup();
