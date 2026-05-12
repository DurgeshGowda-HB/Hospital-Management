/**
 * Run this script once to create an admin user:
 * node createAdmin.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, default: 'patient' },
  phone: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: 'admin@hospital.com' });
    if (existing) {
      console.log('Admin user already exists:', existing.email);
      process.exit(0);
    }

    const admin = new User({
      name: 'Hospital Admin',
      email: 'admin@hospital.com',
      password: 'admin123456',
      role: 'admin',
      phone: '+91-0000000000',
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log('   Email:    admin@hospital.com');
    console.log('   Password: admin123456');
    console.log('   ⚠️  Change the password after first login!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
