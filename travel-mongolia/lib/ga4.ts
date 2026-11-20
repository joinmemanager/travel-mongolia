import { createSign } from 'crypto';

// GA4 Data API (runReport): footer-ийн дээрх зочдын тоо (lib/siteStats.ts). Service account-ийн JWT-г
// Node-ийн crypto-оор гарын үсэг зурж OAuth token авна (нэмэлт npm сангүй).
// Тохиргоо (.env.local, Vercel Production + Preview):
//   GA4_PROPERTY_ID           GA4 property-ийн ID (тоо, жишээ нь 123456789; G-XXXX measurement ID биш)
//   GA4_CLIENT_EMAIL          service account-ийн имэйл (...@<project>.iam.gserviceaccount.com)
//   GA4_PRIVATE_KEY           service account JSON-ийн private_key (\n-ийг хэвээр нь хуулж болно)
// Аль нэг нь байхгүй эсвэл алдаа гарвал null: зочдын мөр харагдахгүй (тоо зохиохгүй).

export interface Ga4Visitors {
  total: number;
  yesterday: number;
  week: number;
  month: number;
}

const b64url = (s: string) => Buffer.from(s).toString('base64url');

async function accessToken(email: string, key: string): Promise<string> {
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
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`GA4 token: ${res.status}`);
  return (await res.json()).access_token;
}

export function ga4Configured(): boolean {
  return !!(process.env.GA4_PROPERTY_ID && process.env.GA4_CLIENT_EMAIL && process.env.GA4_PRIVATE_KEY);
}

// Нэг хүсэлтэд 4 хугацаа (runReport-ийн дээд хязгаар 4). activeUsers = тухайн хугацааны давхардаагүй зочин.
// «Нийт» = GA4-ийн зөвшөөрдөг хамгийн эртний огнооноос (2015-08-14) өнөөдрийг хүртэл, өөрөөр хэлбэл
// property-д бүртгэгдсэн бүх хугацаа. «Өнгөрсөн сард» = өчигдрөөс өмнөх 30 хоног.
export async function fetchGa4Visitors(): Promise<Ga4Visitors | null> {
  if (!ga4Configured()) return null;
  const key = process.env.GA4_PRIVATE_KEY!.replace(/\\n/g, '\n');
  const token = await accessToken(process.env.GA4_CLIENT_EMAIL!, key);
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:runReport`,
    {
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
    }
  );
  if (!res.ok) throw new Error(`GA4 runReport: ${res.status}`);
  const data = await res.json();
  // Олон dateRange үед мөр бүрийн эхний dimension нь хугацааны нэр. Мөргүй хугацаа = 0 зочин.
  const value = (name: string) => {
    const row = (data.rows || []).find((r: any) => r.dimensionValues?.[0]?.value === name);
    return Number(row?.metricValues?.[0]?.value || 0);
  };
  return { total: value('total'), yesterday: value('yesterday'), week: value('week'), month: value('month') };
}
