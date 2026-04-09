import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail, sendSMS } from '../utils/notify.js';
import { getIO } from '../config/socket.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET not set in environment variables');
}

function signToken(payload, expiresIn) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  };
}

function toSafeUser(user) {
    return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    address: user.address,
    verified: user.verified,
    isActive: user.isActive
  };
}

export async function registerUser(req, res) {
  try {
    const { name, email: emailIn, phone: phoneIn, password, role, address, city, state, pincode } = req.body;
    
    // Sanitize empty strings to ensure sparse unique indices work correctly
    const email = emailIn?.trim() || undefined;
    const phone = phoneIn?.trim() || undefined;

    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({ message: 'Name, email/phone, and password required' });
    }

    const permittedRoles = ['customer', 'doctor', 'pharmacist', 'delivery'];
    const finalRole = permittedRoles.includes(role) ? role : 'customer';

    const query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone });
    let user = query.length > 0 ? await User.findOne({ $or: query }) : null;

    const otpCode = process.env.NODE_ENV === 'development' ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    if (user) {
      if (user.verified) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      // Re-send OTP for unverified user
      user.otpCode = otpCode;
      user.otpExpiry = otpExpiry;
      // Update info if provided
      if (name) user.name = name;
      if (password) user.password = await bcrypt.hash(password, 10);
      if (address || city || state || pincode) {
        user.address = {
          street: address || user.address?.street,
          city: city || user.address?.city,
          state: state || user.address?.state,
          pincode: pincode || user.address?.pincode
        };
      }
      await user.save();
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({ 
        name, 
        email: email || undefined, 
        phone: phone || undefined, 
        role: finalRole, 
        password: hashedPassword, 
        otpCode, 
        otpExpiry,
        address: {
          street: address,
          city: city,
          state: state,
          pincode: pincode
        }
      });
    }

    if (email) await sendEmail(email, 'Verify OTP', `Your OTP is ${otpCode}`);
    if (phone) await sendSMS(phone, `Your OTP is ${otpCode}`);

    const payload = { id: user._id, name: user.name, email: user.email, role: user.role };
    const accessToken = signToken(payload, '7d'); // Requested 7d expiry
    const refreshToken = signToken(payload, '7d');
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('accessToken', accessToken, cookieOptions());
    res.cookie('refreshToken', refreshToken, cookieOptions());

    try {
      getIO().emit('activity:new', {
         type: 'user_joined',
         message: `New district node '${name}' synchronized with the enclave.`,
         location: 'District Registration Node',
         timestamp: new Date()
      });
    } catch (e) {}

    res.json({ user: toSafeUser(user) });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
}

export async function verifyOTP(req, res) {
  try {
    const { email, phone, code } = req.body;
    if (!code || (!email && !phone)) return res.status(400).json({ message: 'Invalid request' });
    const queryArr = [];
    if (email) queryArr.push({ email });
    if (phone) queryArr.push({ phone });
    const user = queryArr.length > 0 ? await User.findOne({ $or: queryArr }) : null;
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.otpCode || user.otpCode !== code) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpiry && user.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP expired' });

    user.verified = true;
    user.otpCode = null;
    user.otpExpiry = null;
    user.isActive = true; // Ensure active on verification
    await user.save();

    try {
      getIO().emit('user:update', { id: user._id, verified: true, isActive: true });
    } catch (e) {}

    res.json({ ok: true, user: toSafeUser(user) });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
}

export async function resendOTP(req, res) {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) return res.status(400).json({ message: 'Email/phone required' });

    const queryArr = [];
    if (email) queryArr.push({ email });
    if (phone) queryArr.push({ phone });
    const user = queryArr.length > 0 ? await User.findOne({ $or: queryArr }) : null;
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otpCode = process.env.NODE_ENV === 'development' ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
    user.otpCode = otpCode;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    if (user.email) await sendEmail(user.email, 'Verify OTP', `Your OTP is ${otpCode}`);
    if (user.phone) await sendSMS(user.phone, `Your OTP is ${otpCode}`);

    res.json({ ok: true });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
}

export async function loginUser(req, res) {
  const { email: emailIn, phone: phoneIn, password, role } = req.body;
  const email = emailIn?.trim() || undefined;
  const phone = phoneIn?.trim() || undefined;
  const identifier = email || phone;
  if (!identifier || !password) return res.status(400).json({ message: 'Credentials required' });

  const queryArr = [];
  if (email) queryArr.push({ email });
  if (phone) queryArr.push({ phone });
  const user = queryArr.length > 0 ? await User.findOne({ $or: queryArr }) : null;
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (role && user.role !== role) return res.status(403).json({ error: 'Role mismatch' });

  const ok = await bcrypt.compare(password, user.password || '');
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const payload = { id: user._id, name: user.name, email: user.email, role: user.role };
  const accessToken = signToken(payload, '7d');
  const refreshToken = signToken(payload, '7d');
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('accessToken', accessToken, cookieOptions());
  res.cookie('refreshToken', refreshToken, cookieOptions());

  try {
    getIO().emit('activity:new', {
       type: 'user_login',
       message: `Node '${user.name}' authorized and online. Pulse sync active.`,
       location: 'Security Terminal',
       timestamp: new Date()
    });
  } catch (e) {}

  res.json({ user: toSafeUser(user) });
}

export async function logoutUser(req, res) {
  if (req.user?.id) {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
  }
  res.clearCookie('accessToken', cookieOptions());
  res.clearCookie('refreshToken', cookieOptions());
  res.json({ message: 'Logged out' });
}

export async function refreshAccessToken(req, res) {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) return res.status(401).json({ message: 'Invalid refresh token' });
    const accessToken = signToken({ id: user._id, name: user.name, email: user.email, role: user.role }, '15m');
    res.cookie('accessToken', accessToken, cookieOptions());
    res.json({ ok: true });
  } catch (e) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}

export async function googleOAuth(req, res) {
  const { email, name, role } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  let user = await User.findOne({ email });
  if (user && role && user.role !== role) return res.status(403).json({ message: 'Role mismatch' });

  if (!user) {
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      role: role || 'customer',
      verified: true
    });
  }

  const payload = { id: user._id, name: user.name, email: user.email, role: user.role };
  const accessToken = signToken(payload, '15m');
  const refreshToken = signToken(payload, '7d');
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('accessToken', accessToken, cookieOptions());
  res.cookie('refreshToken', refreshToken, cookieOptions());
  res.json({ user: toSafeUser(user) });
}

export async function requestLoginOtp(req, res) {
  const { email, phone, role } = req.body;
  if (!email && !phone) return res.status(400).json({ message: 'Email or phone required' });
  const queryArr = [];
  if (email) queryArr.push({ email });
  if (phone) queryArr.push({ phone });
  const user = queryArr.length > 0 ? await User.findOne({ $or: queryArr }) : null;
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (role && user.role !== role) return res.status(403).json({ message: 'Role mismatch' });

  const otpCode = process.env.NODE_ENV === 'development' ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
  user.otpCode = otpCode;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  if (email) await sendEmail(email, 'Login OTP', `Your OTP is ${otpCode}`);
  if (phone) await sendSMS(phone, `Your OTP is ${otpCode}`);

  res.json({ ok: true });
}

export async function verifyLoginOtp(req, res) {
  const { email, phone, code, role } = req.body;
  if (!code || (!email && !phone)) return res.status(400).json({ message: 'Invalid request' });
  const queryArr = [];
  if (email) queryArr.push({ email });
  if (phone) queryArr.push({ phone });
  const user = queryArr.length > 0 ? await User.findOne({ $or: queryArr }) : null;
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (role && user.role !== role) return res.status(403).json({ message: 'Role mismatch' });
  if (!user.otpCode || user.otpCode !== code) return res.status(400).json({ message: 'Invalid OTP' });
  if (user.otpExpiry && user.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP expired' });

  user.otpCode = null;
  user.otpExpiry = null;
  await user.save();

  const payload = { id: user._id, name: user.name, email: user.email, role: user.role };
  const accessToken = signToken(payload, '15m');
  const refreshToken = signToken(payload, '7d');
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('accessToken', accessToken, cookieOptions());
  res.cookie('refreshToken', refreshToken, cookieOptions());
  res.json({ user: toSafeUser(user) });
}

export async function requestPasswordReset(req, res) {
  const { email, phone } = req.body;
  if (!email && !phone) return res.status(400).json({ message: 'Email or phone required' });
  const queryArr = [];
  if (email) queryArr.push({ email });
  if (phone) queryArr.push({ phone });
  const user = queryArr.length > 0 ? await User.findOne({ $or: queryArr }) : null;
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = crypto.randomBytes(16).toString('hex');
  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const message = `Your password reset code is ${resetToken}. It expires in 15 minutes.`;
  if (user.email) await sendEmail(user.email, 'Reset your MediReach password', message);
  if (user.phone) await sendSMS(user.phone, message);

  res.json({ ok: true });
}

export async function resetPassword(req, res) {
  const { email, phone, token, password } = req.body;
  if (!token || !password || (!email && !phone)) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const queryArr = [];
  if (email) queryArr.push({ email });
  if (phone) queryArr.push({ phone });
  const user = queryArr.length > 0 ? await User.findOne({ $or: queryArr }) : null;
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!user.resetToken || user.resetToken !== token) return res.status(400).json({ message: 'Invalid reset token' });
  if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
    return res.status(400).json({ message: 'Reset token expired' });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  res.json({ ok: true });
}

export async function uploadAvatar(req, res) {
  try {
    const { email, phone } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const queryArr = [];
    if (email) queryArr.push({ email });
    if (phone) queryArr.push({ phone });
    const user = queryArr.length > 0 ? await User.findOne({ $or: queryArr }) : null;
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Support both Cloudinary (path/filename) and memory storage (buffer only)
    const avatarUrl = req.file.path || null;
    const avatarPublicId = req.file.filename || req.file.originalname || null;

    user.avatar = {
      url: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=028090&color=fff`,
      publicId: avatarPublicId
    };
    await user.save();

    res.json({ ok: true, avatar: user.avatar });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Avatar upload failed' });
  }
}
