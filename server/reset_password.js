import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import './config/env.js';
import User from './models/User.js';

async function reset() {
  await mongoose.connect(process.env.MONGO_URI);
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const result = await User.updateOne(
    { email: 'keerthistrange@gmail.com' },
    { password: hashedPassword }
  );
  
  if (result.matchedCount > 0) {
    console.log('Successfully reset password for keerthistrange@gmail.com to 123456');
  } else {
    console.log('User keerthistrange@gmail.com not found');
  }
  process.exit(0);
}
reset();
