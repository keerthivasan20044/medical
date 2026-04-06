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
import upload from '../middleware/upload.js';

const router = Router();

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
router.post('/upload-avatar', upload.single('photo'), uploadAvatar);

export default router;
