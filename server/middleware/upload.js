import multer from 'multer';
import pkg from 'multer-storage-cloudinary';
const { CloudinaryStorage } = pkg;
import cloudinary from '../config/cloudinary.js';

// Only use Cloudinary if all 3 credentials are provided
const cloudinaryReady =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

const storage = cloudinaryReady
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'medireach/prescriptions',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
      }
    })
  : multer.memoryStorage(); // Fallback: keep file in memory (no Cloudinary)

if (!cloudinaryReady) {
  console.warn('⚠️  Cloudinary not configured — uploads will use memory storage only (files not persisted).');
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export default upload;

