import mongoose from 'mongoose';
import Medicine from '../models/Medicine.js';
import Pharmacy from '../models/Pharmacy.js';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medireach';

const MEDICINES = [
  { name: 'Paracetamol 500mg', brand: 'Dolo-650', category: 'Fever & Pain', price: 35, mrp: 40, unit: 'Strip of 10', requiresPrescription: false, stock: 450, soldCount: 1200, rating: 4.8, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' }], description: 'Pain relief and fever reduction.' },
  { name: 'Amoxicillin 250mg', brand: 'Novamox', category: 'Antibiotics', price: 120, mrp: 150, unit: '10 capsules', requiresPrescription: true, stock: 210, soldCount: 450, rating: 4.5, images: [{ url: 'https://images.unsplash.com/photo-1471864190281-ad5f9f81ce4c?q=80&w=800' }], description: 'Bacterial infection treatment.' },
  { name: 'Cetirizine 10mg', brand: 'Okacet', category: 'Allergy', price: 25, mrp: 30, unit: '10 tablets', requiresPrescription: false, stock: 380, soldCount: 890, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1550572017-edb724584620?q=80&w=800' }], description: 'Antihistamine for allergies.' },
  { name: 'Omeprazole 20mg', brand: 'Omez', category: 'Stomach', price: 65, mrp: 80, unit: '10 capsules', requiresPrescription: false, stock: 150, soldCount: 600, rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' }], description: 'Acidity and heartburn relief.' },
  { name: 'Azithromycin 500mg', brand: 'Azithral', category: 'Antibiotics', price: 95, mrp: 110, unit: '3 tablets', requiresPrescription: true, stock: 300, soldCount: 340, rating: 4.4, images: [{ url: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=800' }], description: 'Broad-spectrum antibiotic.' },
  { name: 'Metformin 500mg', brand: 'Glycomet', category: 'Diabetes', price: 45, mrp: 55, unit: '10 tablets', requiresPrescription: true, stock: 600, soldCount: 1500, rating: 4.9, images: [{ url: 'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?q=80&w=800' }], description: 'Blood sugar control.' },
  { name: 'Amlodipine 5mg', brand: 'Amlokind', category: 'Heart', price: 55, mrp: 70, unit: '10 tablets', requiresPrescription: true, stock: 240, soldCount: 780, rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' }], description: 'Blood pressure medication.' },
  { name: 'Vitamin D3 60K', brand: 'Uprise-D3', category: 'Wellness', price: 140, mrp: 160, unit: '4 capsules', requiresPrescription: false, stock: 420, soldCount: 3000, rating: 4.9, images: [{ url: 'https://images.unsplash.com/photo-1550572017-edb724584620?q=80&w=800' }], description: 'Bone and immune support.' },
  { name: 'Levocetirizine 5mg', brand: 'Levocet', category: 'Allergy', price: 40, mrp: 50, unit: '10 tablets', requiresPrescription: false, stock: 200, soldCount: 450, rating: 4.5, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' }], description: 'Enhanced allergy relief.' },
  { name: 'Pantoprazole 40mg', brand: 'Pantocid', category: 'Stomach', price: 110, mrp: 130, unit: '15 tablets', requiresPrescription: false, stock: 180, soldCount: 1100, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1471864190281-ad5f9f81ce4c?q=80&w=800' }], description: 'GERD treatment.' },
  { name: 'Atorvastatin 10mg', brand: 'Lipvas', category: 'Heart', price: 85, mrp: 100, unit: '10 tablets', requiresPrescription: true, stock: 220, soldCount: 950, rating: 4.8, images: [{ url: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=800' }], description: 'Cholesterol management.' },
  { name: 'Montelukast 10mg', brand: 'Montek', category: 'Respiratory', price: 160, mrp: 190, unit: '10 tablets', requiresPrescription: true, stock: 130, soldCount: 420, rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' }], description: 'Asthma/Allergy control.' },
  { name: 'Diclofenac Gel', brand: 'Voveran', category: 'Muscle', price: 75, mrp: 90, unit: '30g tube', requiresPrescription: false, stock: 280, soldCount: 1300, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1550572017-edb724584620?q=80&w=800' }], description: 'Pain relief gel.' },
  { name: 'Ciprofloxacin 500mg', brand: 'Cipox', category: 'Antibiotics', price: 45, mrp: 60, unit: '10 tablets', requiresPrescription: true, stock: 100, soldCount: 560, rating: 4.3, images: [{ url: 'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?q=80&w=800' }], description: 'Bacterial infection treatment.' },
  { name: 'Rosuvastatin 10mg', brand: 'Rosuvas', category: 'Heart', price: 145, mrp: 170, unit: '15 tablets', requiresPrescription: true, stock: 190, soldCount: 880, rating: 4.8, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' }], description: 'Advanced cholesterol control.' },
  { name: 'Telmisartan 40mg', brand: 'Telma', category: 'Heart', price: 95, mrp: 120, unit: '15 tablets', requiresPrescription: true, stock: 260, soldCount: 1100, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=800' }], description: 'Hypertension control.' },
  { name: 'Ibuprofen 400mg', brand: 'Brufen', category: 'Fever & Pain', price: 42, mrp: 50, unit: '15 tablets', requiresPrescription: false, stock: 310, soldCount: 750, rating: 4.4, images: [{ url: 'https://images.unsplash.com/photo-1471864190281-ad5f9f81ce4c?q=80&w=800' }], description: 'Anti-inflammatory pain relief.' },
  { name: 'Voglibose 0.3mg', brand: 'Vogli', category: 'Diabetes', price: 130, mrp: 160, unit: '10 tablets', requiresPrescription: true, stock: 150, soldCount: 400, rating: 4.5, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' }], description: 'Post-meal blood sugar control.' },
  { name: 'Calcium + Vit D3', brand: 'Shelcal', category: 'Wellness', price: 115, mrp: 140, unit: '15 tablets', requiresPrescription: false, stock: 400, soldCount: 2200, rating: 4.9, images: [{ url: 'https://images.unsplash.com/photo-1550572017-edb724584620?q=80&w=800' }], description: 'Calcium supplement.' },
  { name: 'Erythromycin 250mg', brand: 'Althrocin', category: 'Antibiotics', price: 65, mrp: 80, unit: '10 tablets', requiresPrescription: true, stock: 120, soldCount: 300, rating: 4.2, images: [{ url: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=800' }], description: 'Bacterial infection treatment.' },
  { name: 'Domperidone 10mg', brand: 'Domstal', category: 'Stomach', price: 30, mrp: 40, unit: '10 tablets', requiresPrescription: false, stock: 280, soldCount: 1400, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' }], description: 'Nausea and vomiting relief.' },
  { name: 'Thyroxine 50mcg', brand: 'Thyronorm', category: 'Thyroid', price: 175, mrp: 200, unit: '120 tablets', requiresPrescription: true, stock: 90, soldCount: 500, rating: 4.8, images: [{ url: 'https://images.unsplash.com/photo-1471864190281-ad5f9f81ce4c?q=80&w=800' }], description: 'Thyroid hormone replacement.' },
  { name: 'Gliclazide 80mg', brand: 'Diamicron', category: 'Diabetes', price: 110, mrp: 140, unit: '10 tablets', requiresPrescription: true, stock: 170, soldCount: 650, rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?q=80&w=800' }], description: 'Blood sugar management.' },
  { name: 'Glimepiride 2mg', brand: 'Amaryl', category: 'Diabetes', price: 185, mrp: 220, unit: '30 tablets', requiresPrescription: true, stock: 110, soldCount: 820, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' }], description: 'Blood sugar control.' }
];

const PHARMACIES = [
  { name: 'Apollo Pharmacy', ownerName: 'Ramesh Babu', licenseNumber: 'KA-2024-001', address: { street: '42 Gandhi Nagar', city: 'Karaikal', pincode: '609602' }, phone: '04368-222288', rating: 4.8, isVerified: true, timings: '9:00 AM - 10:00 PM' },
  { name: 'Sri Dhanvantri Medicals', ownerName: 'Selvam R', licenseNumber: 'KA-2024-002', address: { street: 'Nagore Road', city: 'Karaikal', pincode: '609602' }, phone: '04368-223344', rating: 4.7, isVerified: true, timings: '8:00 AM - 11:00 PM' }
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
    
    for (const pharm of PHARMACIES) {
       const p = new Pharmacy(pharm);
       p.medicines = meds.map(m => m._id);
       await p.save();
    }
    console.log(`Inserted ${PHARMACIES.length} Pharmacies`);

    console.log('Seed Success!');
    process.exit(0);
  } catch (err) {
    console.error('Seed Failed:', err);
    process.exit(1);
  }
}

seed();
