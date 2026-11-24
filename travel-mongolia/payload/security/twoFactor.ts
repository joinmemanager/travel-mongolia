// Admin-ий 2FA (TOTP): `payload-totp` plugin (payload.config.ts) + энэ файлын нөөц кодууд (recovery codes).
//
// Plugin нь Google Authenticator-ийн 6 оронтой кодыг шаарддаг (forceSetup), гэхдээ нөөц кодгүй. Энд:
//   POST /api/users/recovery-codes        — 10 шинэ нөөц код үүсгэж НЭГ удаа буцаана (хуучин нь хүчингүй)
//   POST /api/users/use-recovery-code     — утасгүй үед: нөөц кодоор 2FA-г баталгаажуулна (код нэг удаа)
//   POST /api/users/reset-totp            — 2FA-г шинээр тохируулах (бүх утас шинэ QR уншуулна)
//
// Кодын зөвхөн HMAC-SHA256 (PAYLOAD_SECRET-ээр) хадгалагдана; plaintext DB-д байхгүй.
// Нөөц кодоор баталгаажих нь plugin-ий `<cookiePrefix>-totp` cookie-г яг plugin-тэй ижил хэлбэрээр
// (HS256 JWT { userId, originalStrategy }, payload.secret-ээр) бичнэ — payload-totp 3.0.7, dist/setCookie.js.
// Plugin-ийг шинэчлэхэд энэ форматыг шалгах (docs/admin/ЗААВАР.md-ийн «Техникийн тэмдэглэл»).
import crypto from 'node:crypto';

import type { Endpoint, PayloadRequest } from 'payload';

export const USERS_SLUG = 'users';
export const RECOVERY_CODE_COUNT = 10;
const TOTP_STRATEGY = 'totp';

// Андуурагдах тэмдэгтгүй (0/O, 1/I/L) 31 үсэг-тоо; 10 тэмдэгт ≈ 49 бит
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateRecoveryCode(): string {
  let out = '';
  for (let i = 0; i < 10; i++) out += ALPHABET[crypto.randomInt(ALPHABET.length)];
  return `${out.slice(0, 5)}-${out.slice(5)}`;
}

export const normalizeRecoveryCode = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, '');

export function hashRecoveryCode(secret: string, code: string): string {
  return crypto.createHmac('sha256', secret).update(`recovery:${normalizeRecoveryCode(code)}`).digest('hex');
}

/** Сесс 2FA-гаар баталгаажсан эсэх (plugin-ий totp strategy-ээр нэвтэрсэн). */
export const isTotpVerified = (user: any) => user?._strategy === TOTP_STRATEGY;

async function readSecurityFields(req: PayloadRequest, id: string | number) {
  const doc: any = await req.payload.findByID({
    collection: USERS_SLUG as any,
    id,
    overrideAccess: true,
    showHiddenFields: true,
    depth: 0,
    req,
  });
  return {
    recoveryCodes: Array.isArray(doc?.recoveryCodes) ? (doc.recoveryCodes as string[]) : [],
    hasTotp: Boolean(doc?.totpSecret),
    totpSecret: (doc?.totpSecret as string | null | undefined) || undefined,
    loginAttempts: Number(doc?.loginAttempts || 0),
    lockUntil: doc?.lockUntil ? new Date(doc.lockUntil).getTime() : 0,
  };
}

export async function recoveryCodesLeft(req: PayloadRequest, id: string | number) {
  return (await readSecurityFields(req, id)).recoveryCodes.length;
}

export async function readTotpSecret(req: PayloadRequest, id: string | number) {
  return (await readSecurityFields(req, id)).totpSecret;
}

// payload-totp-ийн setCookie-тэй ижил: HS256 JWT, хугацаа = auth.tokenExpiration
function totpCookie(req: PayloadRequest, user: any, originalStrategy: string): string {
  const auth: any = req.payload.collections[USERS_SLUG as any].config.auth;
  const ttl: number = auth.tokenExpiration || 7200;
  const now = Math.floor(Date.now() / 1000);
  const b64 = (v: object) => Buffer.from(JSON.stringify(v)).toString('base64url');
  const body = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ originalStrategy, userId: user.id, iat: now, exp: now + ttl })}`;
  const sig = crypto.createHmac('sha256', req.payload.secret).update(body).digest('base64url');
  const c = auth.cookies || {};
  const sameSite = typeof c.sameSite === 'string' ? c.sameSite : c.sameSite ? 'Strict' : undefined;
  return [
    `${req.payload.config.cookiePrefix}-totp=${body}.${sig}`,
    'Path=/',
    'HttpOnly',
    `Expires=${new Date((now + ttl) * 1000).toUTCString()}`,
    c.domain ? `Domain=${c.domain}` : '',
    sameSite ? `SameSite=${sameSite}` : '',
    c.secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
}

const json = (body: object, status = 200, headers?: HeadersInit) => Response.json(body, { status, headers });

async function readBody(req: PayloadRequest): Promise<Record<string, unknown>> {
  try {
    const data = req.json ? await req.json() : req.data;
    return data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

const fromOwnCollection = (req: PayloadRequest) => Boolean(req.user) && (req.user as any).collection === USERS_SLUG;

/** 10 шинэ нөөц код. Зөвхөн 2FA-гаар баталгаажсан сесс; хуучин кодууд хүчингүй болно. */
const generateEndpoint: Endpoint = {
  path: '/recovery-codes',
  method: 'post',
  handler: async (req) => {
    if (!fromOwnCollection(req) || !isTotpVerified(req.user)) {
      return json({ ok: false, message: 'Эхлээд 2FA кодоор баталгаажуулна уу.' }, 401);
    }
    const codes = Array.from({ length: RECOVERY_CODE_COUNT }, generateRecoveryCode);
    await req.payload.update({
      collection: USERS_SLUG as any,
      id: req.user!.id,
      data: { recoveryCodes: codes.map((c) => hashRecoveryCode(req.payload.secret, c)) } as any,
      overrideAccess: true,
      req,
    });
    req.payload.logger.info({ user: req.user!.id }, '2FA: шинэ нөөц кодууд үүсгэв');
    return json({ ok: true, codes }, 200, { 'Cache-Control': 'no-store' });
  },
};

/**
 * Утас байхгүй үед: нууц үгээр нэвтэрсэн (2FA хүлээгдэж буй) сесс нөөц код оруулна. Зөв бол кодыг устгаж
 * 2FA cookie тавина. Буруу код нь нууц үгийн lockout-той ижил тоолуурыг (loginAttempts/lockUntil) нэмэгдүүлнэ.
 */
const useEndpoint: Endpoint = {
  path: '/use-recovery-code',
  method: 'post',
  handler: async (req) => {
    if (!fromOwnCollection(req)) return json({ ok: false, message: 'Эхлээд нууц үгээрээ нэвтэрнэ үү.' }, 401);
    const user: any = req.user;
    if (isTotpVerified(user)) return json({ ok: true });
    const strategy = typeof user._strategy === 'string' ? user._strategy : '';
    if (!strategy || strategy === 'api-key') return json({ ok: false, message: 'Энэ төрлийн нэвтрэлтэд хамаарахгүй.' }, 400);

    const auth: any = req.payload.collections[USERS_SLUG as any].config.auth;
    const max: number = auth.maxLoginAttempts || 0;
    const lockTime: number = auth.lockTime || 15 * 60 * 1000;
    const state = await readSecurityFields(req, user.id);
    if (state.lockUntil > Date.now()) {
      return json({ ok: false, message: 'Хэт олон буруу оролдлого. 15 минутын дараа дахин оролдоно уу.' }, 429);
    }

    const body = await readBody(req);
    const code = typeof body.code === 'string' ? body.code : '';
    const hash = code ? hashRecoveryCode(req.payload.secret, code) : '';
    const idx = hash
      ? state.recoveryCodes.findIndex((h) => h.length === hash.length && crypto.timingSafeEqual(Buffer.from(h), Buffer.from(hash)))
      : -1;

    if (idx < 0) {
      const attempts = state.loginAttempts + 1;
      const lock = max > 0 && attempts >= max;
      await req.payload.db.updateOne({
        collection: USERS_SLUG,
        where: { id: { equals: user.id } },
        data: { loginAttempts: lock ? 0 : attempts, lockUntil: lock ? new Date(Date.now() + lockTime).toISOString() : null },
        req,
      });
      req.payload.logger.warn({ user: user.id }, '2FA: буруу нөөц код');
      return json({ ok: false, message: lock ? 'Хэт олон буруу оролдлого — хаяг 15 минут түгжигдлээ.' : 'Нөөц код буруу эсвэл аль хэдийн ашиглагдсан.' }, 400);
    }

    const rest = state.recoveryCodes.filter((_, i) => i !== idx);
    await req.payload.update({
      collection: USERS_SLUG as any,
      id: user.id,
      data: { recoveryCodes: rest } as any,
      overrideAccess: true,
      req,
    });
    await req.payload.db.updateOne({
      collection: USERS_SLUG,
      where: { id: { equals: user.id } },
      data: { loginAttempts: 0, lockUntil: null },
      req,
    });
    req.payload.logger.warn({ user: user.id, left: rest.length }, '2FA: нөөц кодоор нэвтэрлээ');
    return json({ ok: true, left: rest.length }, 200, { 'Set-Cookie': totpCookie(req, user, strategy), 'Cache-Control': 'no-store' });
  },
};

/**
 * 2FA-г шинээр тохируулах: нууц түлхүүр ба нөөц кодыг устгана → дараагийн хуудас шинэ QR харуулна.
 * Өөрийнхөө хаягийг, эсвэл (админ) бусдын хаягийг `{ id }`-аар. Сесс 2FA-гаар баталгаажсан байх ёстой.
 */
const resetEndpoint: Endpoint = {
  path: '/reset-totp',
  method: 'post',
  handler: async (req) => {
    if (!fromOwnCollection(req) || !isTotpVerified(req.user)) {
      return json({ ok: false, message: 'Эхлээд 2FA кодоор баталгаажуулна уу.' }, 401);
    }
    const body = await readBody(req);
    const self = req.user!.id;
    const target = body.id === undefined || body.id === null || body.id === '' ? self : (body.id as string | number);
    if (String(target) !== String(self) && (req.user as any).role !== 'admin') {
      return json({ ok: false, message: 'Зөвхөн админ бусдын 2FA-г шинэчилнэ.' }, 403);
    }
    await req.payload.update({
      collection: USERS_SLUG as any,
      id: target,
      data: { totpSecret: null, recoveryCodes: [] } as any,
      overrideAccess: true,
      req,
    });
    req.payload.logger.warn({ by: self, user: target }, '2FA: шинээр тохируулахаар цэвэрлэв');
    return json({ ok: true, self: String(target) === String(self) });
  },
};

export const twoFactorEndpoints: Endpoint[] = [generateEndpoint, useEndpoint, resetEndpoint];
