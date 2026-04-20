
import '../config/env.js';
import mongoose from 'mongoose';
import Medicine from '../models/Medicine.js';
import Pharmacy from '../models/Pharmacy.js';
import User from '../models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medireach';

const MEDICINES = [
  {
    name: 'Paracetamol 500mg',
    genericName: 'Paracetamol',
    brand: 'Dolo-500',
    category: 'Analgesics',
    images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800', publicId: 'dolo500' }],
    price: 15,
    mrp: 20,
    discount: 25,
    qty: 100,
    unit: 'Strip',
    dosage: '500mg',
    requiresPrescription: false
  },
  {
    name: 'Amoxicillin 250mg',
    genericName: 'Amoxicillin',
    brand: 'Novamox',
    category: 'Antibiotics',
    images: [{ url: 'https://images.unsplash.com/photo-1471864190281-ad5f9f81ce4c?q=80&w=800', publicId: 'novamox' }],
    price: 45,
    mrp: 50,
    discount: 10,
    qty: 50,
    unit: 'Capsule',
    dosage: '250mg',
    requiresPrescription: true
  },
  {
    name: 'Cetirizine 10mg',
    genericName: 'Cetirizine',
    brand: 'Zyrtec',
    category: 'Antihistamines',
    images: [{ url: 'https://images.unsplash.com/photo-1550572017-edb724584620?q=80&w=800', publicId: 'zyrtec' }],
    price: 10,
    mrp: 12,
    discount: 16,
    qty: 200,
    unit: 'Strip',
    dosage: '10mg'
  },
  {
    name: 'Metformin 500mg',
    genericName: 'Metformin',
    brand: 'Glycomet',
    category: 'Diabetes',
    images: [{ url: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=800', publicId: 'glycomet' }],
    price: 30,
    mrp: 35,
    discount: 14,
    qty: 150,
    unit: 'Strip',
    dosage: '500mg',
    requiresPrescription: true
  },
  {
    name: 'Atorvastatin 10mg',
    genericName: 'Atorvastatin',
    brand: 'Lipitor',
    category: 'Cardiovascular',
    images: [{ url: 'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?q=80&w=800', publicId: 'lipitor' }],
    price: 80,
    mrp: 100,
    discount: 20,
    qty: 80,
    unit: 'Strip',
    dosage: '10mg',
    requiresPrescription: true
  }
];

const PHARMACIES = [
  {
    name: 'Karaikal Medical Center',
    ownerName: 'Dr. Ramesh Kumar',
    licenseNumber: 'KKL-PH-1001',
    images: [{ url: 'https://images.unsplash.com/photo-1586015555751-63bb77f4323a?q=80&w=800', publicId: 'kkl-med' }],
    address: { street: 'Church Street', city: 'Karaikal', pincode: '609602', coordinates: { lat: 10.9254, lng: 79.8386 } },
    phone: '04368-222333',
    rating: 4.8,
    totalReviews: 120,
    isVerified: true
  },
  {
    name: 'City Pharmacy Nagore',
    ownerName: 'M. Abdul',
    licenseNumber: 'KKL-PH-1002',
    images: [{ url: 'https://images.unsplash.com/photo-1628771065518-0d82f1598377?q=80&w=800', publicId: 'city-ph' }],
    address: { street: 'Main Road', city: 'Nagore', pincode: '611002', coordinates: { lat: 10.8250, lng: 79.8450 } },
    phone: '04365-251111',
    rating: 4.5,
    totalReviews: 85,
    isVerified: true
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Medicine.deleteMany({});
    console.log('Cleared Medicines');
    const meds = await Medicine.insertMany(MEDICINES);
    console.log(`Inserted ${meds.length} Medicines`);

    await Pharmacy.deleteMany({});
    console.log('Cleared Pharmacies');
    const pharmas = await Pharmacy.insertMany(PHARMACIES);
    console.log(`Inserted ${pharmas.length} Pharmacies`);

    // Assign medicines to pharmacies
    for (const p of pharmas) {
      p.medicines = meds.map(m => m._id);
      await p.save();
    }

    console.log('Seed Success!');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
