/**
 * MediReach Demo Seed Script
 * Run: node scripts/seed.js
 * Creates demo users for all roles with password: 123456
 */

import '../config/env.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medireach';

const DEMO_USERS = [
  {
    name: 'Demo Customer',
    email: 'kkl@demo.in',
    phone: '9000000001',
    role: 'customer',
    isVerified: true,
    isActive: true,
    address: { street: '42 Gandhi Nagar', city: 'Karaikal', state: 'Puducherry', pincode: '609602' }
  },
  {
    name: 'Dr. Demo Doctor',
    email: 'doc@demo.in',
    phone: '9000000002',
    role: 'doctor',
    isVerified: true,
    isActive: true,
    doctorProfile: {
      specialization: 'General Physician',
      qualification: 'MBBS',
      hospital: 'Govt. General Hospital, Karaikal',
      experience: 8,
      fee: 200,
      status: 'online',
      rating: 4.7,
      tags: ['Consultation', 'General']
    }
  },
  {
    name: 'Demo Pharmacist',
    email: 'shop@demo.in',
    phone: '9000000003',
    role: 'pharmacist',
    isVerified: true,
    isActive: true
  },
  {
    name: 'Demo Delivery',
    email: 'ride@demo.in',
    phone: '9000000004',
    role: 'delivery',
    isVerified: true,
    isActive: true
  },
  {
    name: 'Admin User',
    email: 'admin@demo.in',
    phone: '9000000005',
    role: 'admin',
    isVerified: true,
    isActive: true
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB:', MONGO_URI);

    const passwordHash = await bcrypt.hash('123456', 10);

    for (const userData of DEMO_USERS) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        // Update password and ensure verified
        existing.password = passwordHash;
        existing.isVerified = true;
        await existing.save();
        console.log(`🔄 Updated: ${userData.email} [${userData.role}]`);
      } else {
        await User.create({ ...userData, password: passwordHash });
        console.log(`✨ Created: ${userData.email} [${userData.role}]`);
      }
    }

    console.log('\n✅ Seed complete! Demo credentials:');
    console.log('─────────────────────────────────────');
    console.log('Customer  : kkl@demo.in     / 123456');
    console.log('Doctor    : doc@demo.in     / 123456');
    console.log('Pharmacist: shop@demo.in    / 123456');
    console.log('Delivery  : ride@demo.in    / 123456');
    console.log('Admin     : admin@demo.in   / 123456');
    console.log('─────────────────────────────────────');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
