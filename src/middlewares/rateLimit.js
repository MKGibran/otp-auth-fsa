import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: 'Terlalu banyak percobaan login, coba lagi nanti'
});

export const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: 'Terlalu banyak percobaan OTP, coba lagi nanti'
});
