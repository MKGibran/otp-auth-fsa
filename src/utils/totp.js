import speakeasy from 'speakeasy';

export function generateSecret(username) {
  return speakeasy.generateSecret({
    name: `OTP-AUTH:${username}`
  });
}

export function generateOTP(secret) {
  return speakeasy.totp({
    secret,
    encoding: 'base32',
    step: 30 // ⬅️ OTP berlaku 30 detik
  });
}

export function verifyOTP(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    step: 30,
    window: 0
  });
}

