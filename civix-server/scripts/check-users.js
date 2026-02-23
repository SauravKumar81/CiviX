/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User');

// Correctly load environment variables
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

const checkUsers = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is undefined. Check .env file path.');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        const users = await User.find();

        console.log('\n--- Users in Database ---');
        if (users.length === 0) {
            console.log('No users found.');
        } else {
            users.forEach(user => {
                console.log(`\nID: ${user._id}`);
                console.log(`Name: ${user.name}`);
                console.log(`Username: ${user.username}`);
                console.log(`Email: ${user.email}`);
                console.log(`Avatar: ${user.avatar}`);
            });
        }
        console.log('\n-------------------------\n');

    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        process.exit();
    }
};

checkUsers();
