// Admin-ий 2FA (Google Authenticator-ийн 6 оронтой код + нөөц код) — НЭГ flag.
//
//   ADMIN_2FA_ENABLED = false (2026-11-24-ний шийдвэр): зөвхөн имэйл + нууц үгээр нэвтэрнэ.
//   true болгоход: payload-totp (бүх хэрэглэгчид заавал), /admin/setup-totp, /admin/verify-totp, /admin/security,
//   нөөц кодын endpoint-ууд, хэрэглэгчийн хуудасны 2FA хэсэг бүгд дахин асна. Код, DB-ийн багана (totp_secret,
//   recovery_codes, totp_attempts) хэвээр тул migration хэрэггүй. Асаасны дараа:
//     node scripts/payload/cli.mjs generate:importmap   (admin-ий компонентуудыг importMap-д оруулна)
//   Тохиргоо, урсгал, туршилт: docs/plan/payload-report.md §12.
//
// Унтраалттай үед ч ХЭВЭЭР: 5 буруу оролдлого → 15 мин түгжээ, 4 цагийн session, noindex/iframe хамгаалалт,
// production-д «Create first user» хаалттай, нууц үг ≥ 12 тэмдэгт (payload/collections.ts).
export const ADMIN_2FA_ENABLED = false;

// payload-totp-ийн тохиргоо — payload.config.ts болон өөрийн admin хуудсууд (payload/admin/TwoFactorViews.tsx)
// ИЖИЛ утгыг хэрэглэнэ: QR кодыг дахин харуулахад Google Authenticator-т яг ижил бичлэг үүсэх ёстой.
export const TOTP_OPTIONS = {
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  // Authenticator апп дээр харагдах нэр: «Travel Hub Mongolia (имэйл)»
  issuer: 'Travel Hub Mongolia',
} as const;
