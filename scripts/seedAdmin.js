require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user.model');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists. Skipping seeding.');
      return process.exit(0);
    }

    const { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = process.env;
    if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
      console.error('❌ Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD in .env');
      return process.exit(1);
    }

    const admin = new User({
      name: 'Super Admin',
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASSWORD,
      role: 'admin'
    });

    await admin.save();
    console.log(`✅ Admin created: ${SEED_ADMIN_EMAIL}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
