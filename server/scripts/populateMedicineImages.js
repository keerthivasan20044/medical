import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import Medicine from '../models/Medicine.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const PIXABAY_KEY = process.env.PIXABAY_KEY;

const getImageUrl = async (medicineName) => {
  if (!PIXABAY_KEY || PIXABAY_KEY === 'your_pixabay_key_here') {
    console.error('❌ PIXABAY_KEY is missing or placeholder');
    return null;
  }
  const query = encodeURIComponent(`${medicineName} medicine tablet capsule`);
  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${query}&image_type=photo&category=health&per_page=3&safesearch=true`
    );
    const data = await res.json();
    return data.hits?.[0]?.largeImageURL || null;
  } catch (err) {
    console.error(`❌ Pixabay fetch failed for ${medicineName}:`, err.message);
    return null;
  }
};

const uploadToCloudinary = async (imageUrl, medicineName) => {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: 'medireach/medicines',
    public_id: medicineName.toLowerCase().replace(/\s+/g, '_'),
    overwrite: true,
    transformation: [
      { width: 600, height: 600, crop: 'fill', gravity: 'center' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  });
  return { url: result.secure_url, publicId: result.public_id };
};

const populateImages = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is missing');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find medicines with no images or generic ones
    const genericPillsId = 'photo-1584308666744-24d5c474f2ae';
    const medicines = await Medicine.find({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } },
        { 'images.0.url': { $regex: genericPillsId } }
      ]
    });
    
    console.log(`🔍 Found ${medicines.length} medicines needing images`);

    for (const medicine of medicines) {
      try {
        console.log(`🚀 Processing: ${medicine.name}`);
        const pixabayUrl = await getImageUrl(medicine.name);

        if (pixabayUrl) {
          const cloudData = await uploadToCloudinary(pixabayUrl, medicine.name);
          medicine.images = [cloudData];
          await medicine.save();
          console.log(`✅ Updated in DB: ${medicine.name}`);
        } else {
          console.log(`⚠️ No image found on Pixabay for: ${medicine.name}`);
        }

        // Rate limit to be safe
        await new Promise(r => setTimeout(r, 1000));
      } catch (err) {
        console.error(`❌ Failed processing ${medicine.name}:`, err.message);
      }
    }

    console.log('🏁 Population script finished!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Fatal error in population script:', err);
    process.exit(1);
  }
};

populateImages();
