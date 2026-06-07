import mongoose from 'mongoose';
import Medicine from '../models/Medicine.js';
import Pharmacy from '../models/Pharmacy.js';
import User from '../models/User.js';
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

const ADDITIONAL_MEDICINES = [
  { name: 'Aspirin 75mg', brand: 'Ecosprin', category: 'Heart', price: 28, mrp: 35, unit: '14 tablets', requiresPrescription: true, stock: 320, soldCount: 980, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?q=80&w=800' }], description: 'Antiplatelet tablet for cardiac care.' },
  { name: 'Clopidogrel 75mg', brand: 'Clopilet', category: 'Heart', price: 92, mrp: 118, unit: '10 tablets', requiresPrescription: true, stock: 180, soldCount: 430, rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=800' }], description: 'Antiplatelet medicine used under prescription.' },
  { name: 'Losartan 50mg', brand: 'Losar', category: 'Heart', price: 72, mrp: 90, unit: '15 tablets', requiresPrescription: true, stock: 240, soldCount: 620, rating: 4.5, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' }], description: 'Blood pressure control tablet.' },
  { name: 'Dolo 650mg', brand: 'Dolo', category: 'Fever & Pain', price: 38, mrp: 45, unit: '15 tablets', requiresPrescription: false, stock: 520, soldCount: 2400, rating: 4.9, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800' }], description: 'Fever and body pain relief tablet.' },
  { name: 'Naproxen 250mg', brand: 'Naprosyn', category: 'Fever & Pain', price: 64, mrp: 78, unit: '10 tablets', requiresPrescription: true, stock: 160, soldCount: 360, rating: 4.4, images: [{ url: 'https://images.unsplash.com/photo-1471864190281-ad5f9f81ce4c?q=80&w=800' }], description: 'Anti-inflammatory pain relief tablet.' },
  { name: 'ORS Sachet', brand: 'Electral', category: 'Digestive Care', price: 22, mrp: 25, unit: '21.8g sachet', requiresPrescription: false, stock: 700, soldCount: 1800, rating: 4.8, images: [{ url: 'https://images.unsplash.com/photo-1584017442709-df8775f53e07?q=80&w=800' }], description: 'Oral rehydration salts for fluid balance.' },
  { name: 'Loperamide 2mg', brand: 'Imodium', category: 'Digestive Care', price: 48, mrp: 60, unit: '4 capsules', requiresPrescription: false, stock: 220, soldCount: 520, rating: 4.5, images: [{ url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800' }], description: 'Relief from acute diarrhea symptoms.' },
  { name: 'Ondansetron 4mg', brand: 'Emeset', category: 'Digestive Care', price: 52, mrp: 66, unit: '10 tablets', requiresPrescription: true, stock: 190, soldCount: 430, rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?q=80&w=800' }], description: 'Anti-nausea medicine used under prescription.' },
  { name: 'Cough Syrup 100ml', brand: 'Benadryl', category: 'Cough & Cold', price: 128, mrp: 150, unit: '100ml bottle', requiresPrescription: false, stock: 260, soldCount: 780, rating: 4.4, images: [{ url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800' }], description: 'Cough relief syrup.' },
  { name: 'Ambroxol Syrup 100ml', brand: 'Mucolite', category: 'Cough & Cold', price: 96, mrp: 115, unit: '100ml bottle', requiresPrescription: false, stock: 210, soldCount: 690, rating: 4.5, images: [{ url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800' }], description: 'Mucus relief syrup.' },
  { name: 'Salbutamol Inhaler', brand: 'Asthalin', category: 'Respiratory', price: 168, mrp: 190, unit: '200 metered doses', requiresPrescription: true, stock: 95, soldCount: 310, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800' }], description: 'Bronchodilator inhaler for breathing relief.' },
  { name: 'Budesonide Nebules', brand: 'Budecort', category: 'Respiratory', price: 142, mrp: 170, unit: '5 nebules', requiresPrescription: true, stock: 120, soldCount: 260, rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800' }], description: 'Nebulization medicine used under prescription.' },
  { name: 'Insulin Penfill', brand: 'Human Mixtard', category: 'Diabetes', price: 410, mrp: 455, unit: '3ml cartridge', requiresPrescription: true, stock: 80, soldCount: 300, rating: 4.8, images: [{ url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800' }], description: 'Insulin cartridge for diabetes management.' },
  { name: 'Insulin Syringe 1ml', brand: 'Dispovan', category: 'Devices', price: 12, mrp: 15, unit: '1 syringe', requiresPrescription: false, stock: 1000, soldCount: 4200, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800' }], description: 'Sterile disposable insulin syringe.' },
  { name: 'Glucometer Strips', brand: 'Accu-Chek', category: 'Devices', price: 620, mrp: 700, unit: '50 strips', requiresPrescription: false, stock: 140, soldCount: 520, rating: 4.8, images: [{ url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800' }], description: 'Blood glucose test strips.' },
  { name: 'Digital Thermometer', brand: 'Dr Trust', category: 'Devices', price: 180, mrp: 240, unit: '1 unit', requiresPrescription: false, stock: 90, soldCount: 840, rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800' }], description: 'Digital thermometer for temperature checks.' },
  { name: 'BP Monitor', brand: 'Omron', category: 'Devices', price: 1850, mrp: 2200, unit: '1 unit', requiresPrescription: false, stock: 45, soldCount: 210, rating: 4.8, images: [{ url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800' }], description: 'Digital blood pressure monitor.' },
  { name: 'Pulse Oximeter', brand: 'BPL', category: 'Devices', price: 860, mrp: 1100, unit: '1 unit', requiresPrescription: false, stock: 65, soldCount: 340, rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800' }], description: 'Finger pulse oximeter.' },
  { name: 'Betadine Ointment', brand: 'Betadine', category: 'First Aid', price: 88, mrp: 105, unit: '20g tube', requiresPrescription: false, stock: 260, soldCount: 720, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1556229167-731388839088?q=80&w=800' }], description: 'Antiseptic ointment for minor wounds.' },
  { name: 'Bandage Roll', brand: 'Hansaplast', category: 'First Aid', price: 55, mrp: 70, unit: '1 roll', requiresPrescription: false, stock: 420, soldCount: 1100, rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=800' }], description: 'Cotton bandage roll for first aid.' },
  { name: 'Antiseptic Liquid 100ml', brand: 'Dettol', category: 'First Aid', price: 62, mrp: 75, unit: '100ml bottle', requiresPrescription: false, stock: 360, soldCount: 1400, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1556229167-731388839088?q=80&w=800' }], description: 'Antiseptic liquid for hygiene and first aid.' },
  { name: 'Clotrimazole Cream', brand: 'Candid', category: 'Skin Care', price: 78, mrp: 95, unit: '30g tube', requiresPrescription: false, stock: 210, soldCount: 620, rating: 4.5, images: [{ url: 'https://images.unsplash.com/photo-1556229167-731388839088?q=80&w=800' }], description: 'Antifungal cream.' },
  { name: 'Mupirocin Ointment', brand: 'T-Bact', category: 'Skin Care', price: 132, mrp: 155, unit: '5g tube', requiresPrescription: true, stock: 100, soldCount: 240, rating: 4.5, images: [{ url: 'https://images.unsplash.com/photo-1556229167-731388839088?q=80&w=800' }], description: 'Topical antibiotic ointment.' },
  { name: 'Sunscreen SPF 50', brand: 'UV Doux', category: 'Skin Care', price: 640, mrp: 720, unit: '50g tube', requiresPrescription: false, stock: 70, soldCount: 300, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1556229167-731388839088?q=80&w=800' }], description: 'Broad-spectrum sunscreen.' },
  { name: 'Eye Drops 10ml', brand: 'Refresh Tears', category: 'Eye Care', price: 150, mrp: 175, unit: '10ml bottle', requiresPrescription: false, stock: 160, soldCount: 560, rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800' }], description: 'Lubricating eye drops.' },
  { name: 'Ear Drops 10ml', brand: 'Soliwax', category: 'Ear Care', price: 95, mrp: 120, unit: '10ml bottle', requiresPrescription: false, stock: 130, soldCount: 280, rating: 4.4, images: [{ url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800' }], description: 'Ear wax softening drops.' },
  { name: 'Multivitamin Tablets', brand: 'Supradyn', category: 'Wellness', price: 165, mrp: 190, unit: '15 tablets', requiresPrescription: false, stock: 380, soldCount: 2200, rating: 4.8, images: [{ url: 'https://images.unsplash.com/photo-1584017442709-df8775f53e07?q=80&w=800' }], description: 'Daily multivitamin supplement.' },
  { name: 'Protein Powder 400g', brand: 'Protinex', category: 'Nutrition', price: 520, mrp: 590, unit: '400g jar', requiresPrescription: false, stock: 85, soldCount: 360, rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1584017442709-df8775f53e07?q=80&w=800' }], description: 'Protein nutrition supplement.' },
  { name: 'Baby Oral Drops', brand: 'A to Z Drops', category: 'Baby Care', price: 118, mrp: 140, unit: '15ml bottle', requiresPrescription: false, stock: 120, soldCount: 460, rating: 4.5, images: [{ url: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=800' }], description: 'Pediatric multivitamin drops.' },
  { name: 'Sanitary Pads', brand: 'Stayfree', category: 'Women Care', price: 98, mrp: 120, unit: 'Pack of 7', requiresPrescription: false, stock: 300, soldCount: 1600, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1584017442709-df8775f53e07?q=80&w=800' }], description: 'Women hygiene care product.' },
  { name: 'Pregnancy Test Kit', brand: 'Prega News', category: 'Women Care', price: 55, mrp: 65, unit: '1 kit', requiresPrescription: false, stock: 180, soldCount: 740, rating: 4.7, images: [{ url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800' }], description: 'Home pregnancy test kit.' },
  { name: 'Hand Sanitizer 500ml', brand: 'Lifebuoy', category: 'Hygiene', price: 145, mrp: 180, unit: '500ml bottle', requiresPrescription: false, stock: 500, soldCount: 2100, rating: 4.6, images: [{ url: 'https://images.unsplash.com/photo-1556229167-731388839088?q=80&w=800' }], description: 'Alcohol-based hand sanitizer.' },
  { name: 'Face Mask N95', brand: '3M', category: 'Hygiene', price: 85, mrp: 110, unit: '1 mask', requiresPrescription: false, stock: 600, soldCount: 2600, rating: 4.5, images: [{ url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800' }], description: 'Protective N95 face mask.' },
  { name: 'Ayurvedic Digestive Tablet', brand: 'Hajmola', category: 'Ayurvedic', price: 45, mrp: 55, unit: '120 tablets', requiresPrescription: false, stock: 420, soldCount: 1800, rating: 4.4, images: [{ url: 'https://images.unsplash.com/photo-1551001734-d4f1e1279d2d?q=80&w=800' }], description: 'Ayurvedic digestive tablets.' },
  { name: 'Herbal Cough Syrup', brand: 'Koflet', category: 'Ayurvedic', price: 110, mrp: 135, unit: '100ml bottle', requiresPrescription: false, stock: 180, soldCount: 520, rating: 4.5, images: [{ url: 'https://images.unsplash.com/photo-1551001734-d4f1e1279d2d?q=80&w=800' }], description: 'Herbal cough relief syrup.' }
];

const PHARMACIES = [
  {
    name: 'Apollo Pharmacy',
    slug: 'apollo-pharmacy',
    licenseNumber: 'KA-2024-001',
    address: '42 Gandhi Nagar',
    city: 'Karaikal',
    pincode: '609602',
    phone: ['04368-222288'],
    rating: 4.8,
    status: 'active',
    location: { type: 'Point', coordinates: [79.8333, 10.9252] },
    hours: [{ day: 'Monday', open: '9:00 AM', close: '10:00 PM', closed: false }]
  },
  {
    name: 'Sri Dhanvantri Medicals',
    slug: 'sri-dhanvantri-medicals',
    licenseNumber: 'KA-2024-002',
    address: 'Nagore Road',
    city: 'Karaikal',
    pincode: '609602',
    phone: ['04368-223344'],
    rating: 4.7,
    status: 'active',
    location: { type: 'Point', coordinates: [79.8358, 10.9205] },
    hours: [{ day: 'Monday', open: '8:00 AM', close: '11:00 PM', closed: false }]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Pharmacy.deleteMany({});
    console.log('Cleared Pharmacies');

    const pharmacist = await User.findOne({ role: 'pharmacist', isActive: { $ne: false } }).sort({ createdAt: 1 });
    const pharmacyPayload = PHARMACIES.map((pharmacy, index) => ({
      ...pharmacy,
      owner: index === 0 ? pharmacist?._id : pharmacy.owner
    }));

    const pharmacies = await Pharmacy.insertMany(pharmacyPayload);
    console.log(`Inserted ${pharmacies.length} Pharmacies`);

    if (pharmacist && pharmacies[0]) {
      await User.updateOne({ _id: pharmacist._id }, { pharmacyId: pharmacies[0]._id });
      console.log(`Linked pharmacist ${pharmacist.email || pharmacist._id} to ${pharmacies[0].name}`);
    }

    await Medicine.deleteMany({});
    console.log('Cleared Medicines');

    const catalog = [...MEDICINES, ...ADDITIONAL_MEDICINES].map((medicine, index) => ({
      ...medicine,
      pharmacyId: pharmacies[index % pharmacies.length]._id
    }));
    const meds = await Medicine.insertMany(catalog);
    console.log(`Inserted ${meds.length} Medicines`);

    console.log('Seed Success!');
    process.exit(0);
  } catch (err) {
    console.error('Seed Failed:', err);
    process.exit(1);
  }
}

seed();
