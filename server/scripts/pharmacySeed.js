import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pharmacy from '../models/Pharmacy.js';

dotenv.config();

const PHARMACIES = [
  {
    name: 'Apollo Pharmacy Central',
    ownerName: 'Apollo Hospitals Group',
    licenseNumber: 'TN-KKL-2024-001',
    address: {
      street: 'No. 24, Market Road',
      city: 'Karaikal',
      pincode: '609602',
      coordinates: { lat: 10.9254, lng: 79.8385 }
    },
    phone: '+91 94432 10001',
    email: 'apollo.kkl@medireach.in',
    timings: '24/7 Open',
    rating: 4.8,
    totalReviews: 1240,
    isVerified: true,
    isOpen: true,
    images: [{ url: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80' }],
    deliveryRadius: 10
  },
  {
    name: 'Sri Murugan Medicals',
    ownerName: 'V. Murugan',
    licenseNumber: 'TN-KKL-2024-002',
    address: {
      street: 'No. 88, Nagore Main Road',
      city: 'Karaikal',
      pincode: '609605',
      coordinates: { lat: 10.9123, lng: 79.8456 }
    },
    phone: '+91 94432 20002',
    email: 'murugan.med@medireach.in',
    timings: '8:00 AM - 11:00 PM',
    rating: 4.9,
    totalReviews: 856,
    isVerified: true,
    isOpen: true,
    images: [{ url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80' }],
    deliveryRadius: 5
  },
  {
    name: 'MedPlus Pharmacy Node',
    ownerName: 'MedPlus Health',
    licenseNumber: 'TN-KKL-2024-003',
    address: {
      street: 'No. 15, Poompuhar Street',
      city: 'Karaikal',
      pincode: '609602',
      coordinates: { lat: 10.9301, lng: 79.8290 }
    },
    phone: '+91 94432 30003',
    email: 'medplus.node@medireach.in',
    timings: '24/7 Open',
    rating: 4.6,
    totalReviews: 2101,
    isVerified: true,
    isOpen: true,
    images: [{ url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=800&q=80' }],
    deliveryRadius: 8
  },
  {
    name: 'Karaikal Govt Hospital Pharmacy',
    ownerName: 'Health Department, Puducherry',
    licenseNumber: 'GOVT-KKL-PHY-001',
    address: {
      street: 'Hospital Road, Bharathiyar Road',
      city: 'Karaikal',
      pincode: '609602',
      coordinates: { lat: 10.9280, lng: 79.8320 }
    },
    phone: '+91 4368 222401',
    email: 'gh.kkl@puducherry.gov.in',
    timings: '24/7 Open',
    rating: 4.5,
    totalReviews: 450,
    isVerified: true,
    isOpen: true,
    images: [{ url: 'https://images.unsplash.com/photo-1519494140681-8917d169efdf?auto=format&fit=crop&w=800&q=80' }],
    deliveryRadius: 15
  },
  {
    name: 'City Medicals Karaikal',
    ownerName: 'S. K. Rajan',
    licenseNumber: 'TN-KKL-2024-005',
    address: {
      street: 'Church Street Enclave',
      city: 'Karaikal',
      pincode: '609602',
      coordinates: { lat: 10.9240, lng: 79.8400 }
    },
    phone: '+91 94432 50005',
    email: 'city.medicals@medireach.in',
    timings: '9:00 AM - 10:00 PM',
    rating: 4.7,
    totalReviews: 320,
    isVerified: true,
    isOpen: true,
    images: [{ url: 'https://images.unsplash.com/photo-1587854236518-7dee1c93a7d7?auto=format&fit=crop&w=800&q=80' }],
    deliveryRadius: 3
  }
];

const seedPharmacies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Database Connected Node established.');

    await Pharmacy.deleteMany();
    console.log('[Seed] Previous District Nodes Purged.');

    await Pharmacy.insertMany(PHARMACIES);
    console.log(`[Seed] ${PHARMACIES.length} High-Fidelity Pharmacies Synchronized.`);

    process.exit();
  } catch (err) {
    console.error('[Seed] Synchronization Hub Failed:', err.message);
    process.exit(1);
  }
};

seedPharmacies();
