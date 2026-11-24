import { createPrivateKey, createSign } from 'crypto';

// GA4 Data API (runReport): footer-ийн дээрх зочдын тоо (lib/siteStats.ts). Service account-ийн JWT-г
// Node-ийн crypto-оор гарын үсэг зурж OAuth token авна (нэмэлт npm сангүй).
// Тохиргоо (.env.local, Vercel Production + Preview; Vercel-д env нэмсэн/өөрчилсний дараа дахин deploy хэрэгтэй):
//   GA4_PROPERTY_ID           GA4 property-ийн ID (тоо, жишээ нь 123456789; G-XXXX measurement ID биш)
//   GA4_CLIENT_EMAIL          service account-ийн имэйл (...@<project>.iam.gserviceaccount.com)
//   GA4_PRIVATE_KEY           service account JSON-ийн private_key. Хашилттай, "\n" (2 тэмдэгт) эсвэл бодит мөр
//                             шилжилттэй, бүтэн JSON эсвэл base64 хэлбэрээр хуулсан ч normalizeKey() засна.
// Аль нэг нь байхгүй эсвэл алдаа гарвал Ga4Error: зочдын мөр харагдахгүй (тоо зохиохгүй). Алдааны шалтгааныг
// server log-д бичнэ (нууц утгыг хэзээ ч хэвлэхгүй).

export interface Ga4Visitors {
  total: number;
  yesterday: number;
  week: number;
  month: number;
}

// Log болон preview-ийн /api/stats-д харагдах шалтгааны код (нууц мэдээлэлгүй)
export type Ga4ErrorCode =
  | 'missing_env' // env хувьсагч байхгүй
  | 'key_format' // private key уншигдсангүй (PEM биш, хашилт/мөр шилжилт эвдэрсэн)
  | 'auth' // Google OAuth token өгсөнгүй (имэйл/key таарахгүй, key устгагдсан, цаг буруу)
  | 'permission_denied' // service account-д GA4 property-д эрх алга
  | 'property_not_found' // GA4_PROPERTY_ID буруу
  | 'api_error'; // бусад (сүлжээ, 5xx, квот)

export class Ga4Error extends Error {
  code: Ga4ErrorCode;
  constructor(code: Ga4ErrorCode, detail: string) {
    super(`GA4 ${code}: ${detail}`);
    this.code = code;
    this.name = 'Ga4Error';
  }
}

const b64url = (s: string) => Buffer.from(s).toString('base64url');

// Эхэн/төгсгөлийн зай болон хашилтыг (", ') хасна. Vercel-ийн UI-д утгыг хашилттай нь хуулах нь түгээмэл.
const unquote = (v: string) => {
  let s = v.trim();
  while (s.length >= 2 && ((s[0] === '"' && s.endsWith('"')) || (s[0] === "'" && s.endsWith("'")))) s = s.slice(1, -1).trim();
  return s;
};

// Private key-г PEM болгоно: хашилт хасах, "\\n" → мөр шилжилт, \r хасах, бүтэн service account JSON бол
// private_key-г нь авах, base64-өөр кодлосон PEM бол задлах.
export function normalizeKey(raw: string): string {
  let key = unquote(raw);
  if (key.startsWith('{')) {
    try {
      key = String(JSON.parse(key).private_key || '');
    } catch {
      // JSON биш: доорх алхмууд үргэлжилнэ
    }
  }
  key = unquote(key.replace(/\\r/g, '').replace(/\\n/g, '\n').replace(/\r/g, ''));
  if (!key.includes('-----BEGIN') && /^[A-Za-z0-9+/=\s]+$/.test(key)) {
    const decoded = Buffer.from(key, 'base64').toString('utf8');
    if (decoded.includes('-----BEGIN')) key = decoded.replace(/\r/g, '');
  }
  return key.trim() + '\n';
}

function readConfig() {
  const propertyId = unquote(process.env.GA4_PROPERTY_ID || '').replace(/^properties\//, '');
  const email = unquote(process.env.GA4_CLIENT_EMAIL || '');
  const rawKey = process.env.GA4_PRIVATE_KEY || '';
  const missing = [
    !propertyId && 'GA4_PROPERTY_ID',
    !email && 'GA4_CLIENT_EMAIL',
    !unquote(rawKey) && 'GA4_PRIVATE_KEY',
  ].filter(Boolean) as string[];
  return { propertyId, email, rawKey, missing };
}

export function ga4Configured(): boolean {
  return readConfig().missing.length === 0;
}

// Google-ийн алдааны хариунаас зөвхөн код/тайлбарыг авна (нууц утга агуулдаггүй)
async function googleError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body.error === 'string') return `${res.status} ${body.error}${body.error_description ? ` (${body.error_description})` : ''}`;
    if (body.error?.status) return `${res.status} ${body.error.status}: ${String(body.error.message || '').slice(0, 200)}`;
  } catch {
    // JSON биш хариу
  }
  return String(res.status);
}

async function accessToken(email: string, rawKey: string): Promise<string> {
  let key;
  try {
    key = createPrivateKey(normalizeKey(rawKey));
  } catch (err) {
    const k = normalizeKey(rawKey);
    // Key-ийн агуулгыг биш, зөвхөн хэлбэрийн шинж тэмдгийг бичнэ
    throw new Ga4Error(
      'key_format',
      `GA4_PRIVATE_KEY уншигдсангүй (BEGIN мөр: ${k.includes('-----BEGIN PRIVATE KEY-----') ? 'байна' : 'алга'}, ` +
        `мөрийн тоо: ${k.split('\n').length - 1}, урт: ${k.length}; ${(err as Error).message})`
    );
  }
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(
    JSON.stringify({
      iss: email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    })
  )}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key).toString('base64url');
  let res: Response;
  try {
    res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: `${unsigned}.${signature}`,
      }),
      cache: 'no-store',
    });
  } catch (err) {
    throw new Ga4Error('api_error', `OAuth token хүсэлт явсангүй: ${(err as Error).message}`);
  }
  if (!res.ok) throw new Ga4Error('auth', `OAuth token татгалзсан: ${await googleError(res)}`);
  return (await res.json()).access_token;
}

// Нэг хүсэлтэд 4 хугацаа (runReport-ийн дээд хязгаар 4). activeUsers = тухайн хугацааны давхардаагүй зочин.
// «Нийт» = GA4-ийн зөвшөөрдөг хамгийн эртний огнооноос (2015-08-14) өнөөдрийг хүртэл, өөрөөр хэлбэл
// property-д бүртгэгдсэн бүх хугацаа. «Өнгөрсөн сард» = өчигдрөөс өмнөх 30 хоног.
export async function fetchGa4Visitors(): Promise<Ga4Visitors> {
  const { propertyId, email, rawKey, missing } = readConfig();
  if (missing.length) throw new Ga4Error('missing_env', `${missing.join(', ')} байхгүй`);
  const token = await accessToken(email, rawKey);
  let res: Response;
  try {
    res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: [
          { startDate: '2015-08-14', endDate: 'today', name: 'total' },
          { startDate: 'yesterday', endDate: 'yesterday', name: 'yesterday' },
          { startDate: '7daysAgo', endDate: 'yesterday', name: 'week' },
          { startDate: '30daysAgo', endDate: 'yesterday', name: 'month' },
        ],
        metrics: [{ name: 'activeUsers' }],
      }),
      cache: 'no-store',
    });
  } catch (err) {
    throw new Ga4Error('api_error', `runReport хүсэлт явсангүй: ${(err as Error).message}`);
  }
  if (!res.ok) {
    const detail = await googleError(res);
    if (res.status === 404 || res.status === 400) throw new Ga4Error('property_not_found', `GA4_PROPERTY_ID шалга: ${detail}`);
    if (res.status === 403) throw new Ga4Error('permission_denied', `service account-ийг GA4 property-д Viewer-ээр нэм: ${detail}`);
    if (res.status === 401) throw new Ga4Error('auth', detail);
    throw new Ga4Error('api_error', detail);
  }
  const data = await res.json();
  // Олон dateRange үед мөр бүрийн эхний dimension нь хугацааны нэр. Мөргүй хугацаа = 0 зочин.
  const value = (name: string) => {
    const row = (data.rows || []).find((r: any) => r.dimensionValues?.[0]?.value === name);
    return Number(row?.metricValues?.[0]?.value || 0);
  };
  return { total: value('total'), yesterday: value('yesterday'), week: value('week'), month: value('month') };
}
