/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

const forceFix = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        // 1. Drop the index if it exists
        try {
            await collection.dropIndex('username_1');
            console.log('Dropped username_1 index (if it existed).');
        } catch (e) {
            console.log('Index drop error (ignored):', e.message);
        }

        // 2. Find ALL users without valid username
        // Matches null, undefined, or missing
        const badUsers = await collection.find({
            $or: [
                { username: null },
                { username: { $exists: false } },
                { username: "" }
            ]
        }).toArray();

        console.log(`Found ${badUsers.length} users with invalid/missing username.`);

        // 3. Fix them
        for (const u of badUsers) {
            // Generate robust username
            const base = (u.name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
            const suffix = u._id.toString().slice(-4);
            const newUsername = `${base}${suffix}`;

            await collection.updateOne(
                { _id: u._id },
                { $set: { username: newUsername } }
            );
            console.log(`Fixed user ${u._id} -> ${newUsername}`);
        }

        console.log('Database cleanup complete. You can now register users safely.');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit();
    }
};

forceFix();
