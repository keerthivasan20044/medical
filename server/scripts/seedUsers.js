import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import '../config/env.js';
import User from '../models/User.js';
import Pharmacy from '../models/Pharmacy.js';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing test data
    const testEmails = ['customer@test.com', 'pharmacist@test.com', 'delivery@test.com', 'admin@medipharm.com'];
    const testPhones = ['9876543210', '9876543211', '9876543212', '9876543213'];
    await User.deleteMany({ $or: [{ email: { $in: testEmails } }, { phone: { $in: testPhones } }] });
    await Pharmacy.deleteMany({ email: 'pharmacy@test.com' });
    console.log('Cleared existing test data');

    const passwordHash = await bcrypt.hash('test1234', 10);
    const adminPasswordHash = await bcrypt.hash('admin1234', 10);

    const users = [
      {
        name: 'Test Customer',
        email: 'customer@test.com',
        phone: '9876543210',
        password: passwordHash,
        role: 'customer',
        isVerified: true,
        isActive: true
      },
      {
        name: 'Test Pharmacist',
        email: 'pharmacist@test.com',
        phone: '9876543211',
        password: passwordHash,
        role: 'pharmacist',
        isVerified: true,
        isActive: true
      },
      {
        name: 'Test Delivery',
        email: 'delivery@test.com',
        phone: '9876543212',
        password: passwordHash,
        role: 'delivery',
        isVerified: true,
        isActive: true
      },
      {
        name: 'Admin User',
        email: 'admin@medipharm.com',
        phone: '9876543213',
        password: adminPasswordHash,
        role: 'admin',
        isVerified: true,
        isActive: true
      }
    ];

    for (const u of users) {
      await User.create(u);
      console.log(`User ${u.email} seeded`);
    }

    // Seed a pharmacy for the pharmacist
    const pharmacist = await User.findOne({ email: 'pharmacist@test.com' });
    const pharmacy = await Pharmacy.findOneAndUpdate(
      { name: 'Test Pharmacy' },
      {
        name: 'Test Pharmacy',
        owner: pharmacist._id,
        email: 'pharmacy@test.com',
        phone: ['9876543211'],
        address: '123 Main St',
        city: 'Karaikal',
        state: 'Puducherry',
        pincode: '609602',
        location: {
          type: 'Point',
          coordinates: [79.8333, 10.9252]
        },
        status: 'active'
      },
      { upsert: true, new: true }
    );
    console.log('Pharmacy seeded');

    // Link pharmacist to pharmacy
    pharmacist.pharmacyId = pharmacy._id;
    await pharmacist.save();
    console.log('Pharmacist linked to pharmacy');

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
