// payload-totp-ийн тохиргоо — payload.config.ts болон өөрийн admin хуудсууд (payload/admin/TwoFactorViews.tsx)
// ИЖИЛ утгыг хэрэглэнэ: QR кодыг дахин харуулахад Google Authenticator-т яг ижил бичлэг үүсэх ёстой.
export const TOTP_OPTIONS = {
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  // Authenticator апп дээр харагдах нэр: «Travel Hub Mongolia (имэйл)»
  issuer: 'Travel Hub Mongolia',
} as const;
