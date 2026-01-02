import express from 'express';
import { register, login, verifyOtp } from '../controllers/auth.controller.js';
import { loginLimiter, otpLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/verify-otp', otpLimiter, verifyOtp);

export default router;
