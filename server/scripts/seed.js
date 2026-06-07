/**
 * MediReach Demo Seed Script
 * Run: node scripts/seed.js
 * Creates demo users for all roles with password: 123456.
 */

import '../config/env.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Pharmacy from '../models/Pharmacy.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medireach';

const DEMO_USERS = [
  {
    name: 'Demo Customer',
    email: 'kkl@demo.in',
    phone: '9000000001',
    role: 'customer',
    isVerified: true,
    isActive: true,
    address: [{ street: '42 Gandhi Nagar', city: 'Karaikal', state: 'Puducherry', pincode: '609602' }]
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
    name: 'Dr. Ramesh Kumar',
    email: 'ramesh@demo.in',
    phone: '9000000006',
    role: 'doctor',
    isVerified: true,
    isActive: true,
    doctorProfile: {
      specialization: 'Cardiologist',
      qualification: 'MD, DM',
      hospital: 'Karaikal Heart Center',
      experience: 15,
      fee: 500,
      status: 'online',
      rating: 4.9,
      tags: ['Heart Specialist', 'Emergency']
    },
    address: [{ street: 'Church Street', city: 'Karaikal', state: 'Puducherry', pincode: '609602' }]
  },
  {
    name: 'Dr. Priya Mani',
    email: 'priya@demo.in',
    phone: '9000000007',
    role: 'doctor',
    isVerified: true,
    isActive: true,
    doctorProfile: {
      specialization: 'Pediatrician',
      qualification: 'MBBS, DCH',
      hospital: 'Kids Care Clinic Karaikal',
      experience: 10,
      fee: 300,
      status: 'online',
      rating: 4.8,
      tags: ['Child Care', 'Vaccination']
    },
    address: [{ street: 'Nagore Road', city: 'Karaikal', state: 'Puducherry', pincode: '609605' }]
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
    console.log('Connected to MongoDB:', MONGO_URI);

    const passwordHash = await bcrypt.hash('123456', 10);

    for (const userData of DEMO_USERS) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        Object.assign(existing, userData, { password: passwordHash, isVerified: true, isActive: true });
        await existing.save();
        console.log(`Updated: ${userData.email} [${userData.role}]`);
      } else {
        await User.create({ ...userData, password: passwordHash });
        console.log(`Created: ${userData.email} [${userData.role}]`);
      }
    }

    const demoPharmacist = await User.findOne({ email: 'shop@demo.in' });
    if (demoPharmacist) {
      const demoPharmacies = await Pharmacy.find({
        slug: { $in: ['apollo-pharmacy', 'sri-dhanvantri-medicals'] }
      }).sort({ name: 1 });

      if (demoPharmacies.length) {
        await Pharmacy.updateMany(
          { _id: { $in: demoPharmacies.map((pharmacy) => pharmacy._id) } },
          { owner: demoPharmacist._id }
        );
        demoPharmacist.pharmacyId = demoPharmacies[0]._id;
        await demoPharmacist.save();
        console.log(`Linked shop@demo.in to ${demoPharmacies.map((pharmacy) => pharmacy.name).join(', ')}`);
      }
    }

    console.log('\nSeed complete. Demo credentials:');
    console.log('Customer  : kkl@demo.in   / 123456');
    console.log('Doctor    : doc@demo.in   / 123456');
    console.log('Pharmacist: shop@demo.in  / 123456');
    console.log('Delivery  : ride@demo.in  / 123456');
    console.log('Admin     : admin@demo.in / 123456');
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
