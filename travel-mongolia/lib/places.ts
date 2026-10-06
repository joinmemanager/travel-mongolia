import { client } from '@/lib/contentful';
import type { SiteImage } from '@/lib/images';

export interface PlaceCardData {
  id: string;
  href: string;
  title: string;
  region?: string;
  image?: SiteImage;
  lat?: number;
  lon?: number;
}

export function assetUrl(field: any): string | undefined {
  const url = field?.fields?.file?.url;
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

// Хоёр цэгийн хоорондох зай (км, haversine)
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

// Contentful-ын түүхэн өвийн бүх газар (координаттай)
export async function getHeritagePlaceCards(): Promise<PlaceCardData[]> {
  try {
    const res = await client.getEntries({ content_type: 'heritagePlace', limit: 200 });
    return res.items.map((item: any) => {
      const f = item.fields || {};
      const src = assetUrl(f.image);
      return {
        id: item.sys.id,
        href: `/destination/heritage/place/${item.sys.id}`,
        title: String(f.name || ''),
        region: f.region || undefined,
        image: src ? { src, alt: String(f.name || '') } : undefined,
        lat: typeof f.coordinates?.lat === 'number' ? f.coordinates.lat : undefined,
        lon: typeof f.coordinates?.lon === 'number' ? f.coordinates.lon : undefined,
      };
    }).filter((p) => p.title);
  } catch (err) {
    console.error('Түүхэн өвийн жагсаалт татахад алдаа гарлаа:', err);
    return [];
  }
}

// Contentful-ын 'destination' төрлийн бүх газар
export async function getDestinationCards(): Promise<PlaceCardData[]> {
  try {
    const res = await client.getEntries({ content_type: 'destination', limit: 200 });
    return res.items.map((item: any) => {
      const f = item.fields || {};
      const src = assetUrl(f.image || f.coverImage);
      return {
        id: item.sys.id,
        href: `/destination/${item.sys.id}`,
        title: String(f.title || ''),
        region: f.subtitle || undefined,
        image: src ? { src, alt: String(f.title || '') } : undefined,
      };
    }).filter((p) => p.title);
  } catch (err) {
    console.error('Газрын жагсаалт татахад алдаа гарлаа:', err);
    return [];
  }
}

// Тухайн цэгээс хамгийн ойр газрууд (координатгүй газрыг оруулахгүй)
export function nearestPlaces(
  from: { lat: number; lon: number },
  places: PlaceCardData[],
  excludeId: string,
  limit = 3
): PlaceCardData[] {
  return places
    .filter((p) => p.id !== excludeId && typeof p.lat === 'number' && typeof p.lon === 'number')
    .map((p) => ({ p, d: distanceKm(from, { lat: p.lat as number, lon: p.lon as number }) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map(({ p }) => p);
}
