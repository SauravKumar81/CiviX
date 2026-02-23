/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User');

const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

const debugCreateUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Force create a user with a unique name
        const name = 'DebugUser' + Math.floor(Math.random() * 1000);
        const username = 'debuguser' + Math.floor(Math.random() * 1000);
        const email = 'debug' + Math.floor(Math.random() * 1000) + '@example.com';

        console.log(`Attempting to create: Name=${name}, Username=${username}, Email=${email}`);

        const user = await User.create({
            name,
            username,
            email,
            password: 'password123',
            role: 'user'
        });

        console.log('User created successfully:', user);
        console.log('Does user have username?', user.username ? 'YES' : 'NO');

        if (!user.username) {
            console.error('CRITICAL: Username field missing in created document!');
            console.log('Raw doc:', user._doc);
        }

    } catch (err) {
        console.error('Creation failed:', err);
    } finally {
        if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
        process.exit();
    }
};

debugCreateUser();
