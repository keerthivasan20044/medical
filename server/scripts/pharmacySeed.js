import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pharmacy from '../models/Pharmacy.js';

dotenv.config();

const PHARMACIES = [
  {
    name: 'Apollo Pharmacy Central',
    location: 'Market Road Hub, Karaikal',
    address: 'No. 24, Market Road, Karaikal - 609602',
    phone: '+91 94432 10001',
    coordinates: { lat: 10.9254, lng: 79.8385 },
    rating: 4.8,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80',
    tags: ['24/7', 'Home Delivery', 'Insurance Sync'],
    stats: { orders: 1240, fulfillment: 98 }
  },
  {
    name: 'Sri Murugan Medicals',
    location: 'Nagore Road Enclave',
    address: 'No. 88, Nagore Main Road, Karaikal - 609605',
    phone: '+91 94432 20002',
    coordinates: { lat: 10.9123, lng: 79.8456 },
    rating: 4.9,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80',
    tags: ['Cold Chain', 'Home Delivery'],
    stats: { orders: 856, fulfillment: 99 }
  },
  {
    name: 'MedPlus Pharmacy Node',
    location: 'Poompuhar Street',
    address: 'No. 15, Poompuhar Street, Karaikal - 609602',
    phone: '+91 94432 30003',
    coordinates: { lat: 10.9301, lng: 79.8290 },
    rating: 4.6,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=800&q=80',
    tags: ['24/7', 'Digital Rx Hub'],
    stats: { orders: 2101, fulfillment: 97 }
  },
  {
    name: 'Life Care Medical Center',
    location: 'Colony Street Node',
    address: 'No. 3, New Colony, Karaikal - 609602',
    phone: '+91 94432 40004',
    coordinates: { lat: 10.9350, lng: 79.8350 },
    rating: 4.7,
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80',
    tags: ['Home Delivery', 'Baby Care Sync'],
    stats: { orders: 540, fulfillment: 95 }
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
