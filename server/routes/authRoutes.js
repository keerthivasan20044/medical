import { Router } from 'express';
import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  logoutUser,
  refreshAccessToken,
  googleOAuth,
  requestLoginOtp,
  verifyLoginOtp,
  requestPasswordReset,
  resetPassword,
  uploadAvatar
} from '../controllers/authController.js';
import multer from 'multer';

const router = Router();
const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype?.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginUser);
router.post('/login-otp/request', requestLoginOtp);
router.post('/login-otp/verify', verifyLoginOtp);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);
router.post('/google', googleOAuth);
router.post('/upload-avatar', avatarUpload.single('photo'), uploadAvatar);

export default router;
