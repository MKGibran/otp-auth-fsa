import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { generateSecret, generateOTP, verifyOTP } from '../utils/totp.js';

// helper log
async function logAuth(userId, action, status) {
  await prisma.authLog.create({
    data: {
      userId,
      action,
      status,
    },
  });
}

// REGISTER
export async function register(req, res) {
  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
  const secret = generateSecret(username);

  const user = await prisma.user.create({
    data: {
      username,
      password: hash,
      otpSecret: secret.base32,
    },
  });

  res.json({
    message: 'Register berhasil',
    otp_secret: secret.base32,
  });
}

// LOGIN PASSWORD
export async function login(req, res) {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res.status(401).json({ message: 'Login gagal' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    await logAuth(user.id, 'LOGIN_PASSWORD', 'FAILED');
    return res.status(401).json({ message: 'Login gagal' });
  }

  const otp = generateOTP(user.otpSecret);
  await logAuth(user.id, 'LOGIN_PASSWORD', 'SUCCESS');

  res.json({
    message: 'Password valid, OTP dikirim (simulasi)',
    otp,
  });
}

// VERIFY OTP
export async function verifyOtp(req, res) {
  const { username, otp } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res.status(401).json({ message: 'OTP salah' });
  }

  const valid = verifyOTP(user.otpSecret, otp);
  if (!valid) {
    await logAuth(user.id, 'VERIFY_OTP', 'FAILED');
    return res.status(401).json({ message: 'OTP tidak valid' });
  }

  await logAuth(user.id, 'VERIFY_OTP', 'SUCCESS');

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Login berhasil',
    token,
  });
}
