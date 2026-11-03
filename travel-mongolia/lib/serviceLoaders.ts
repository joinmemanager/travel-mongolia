import { type ProvinceService, rankServices, type ServiceRow } from '@/lib/serviceTypes';

// Хөтөчид аймгийн JSON-ыг хэрэгтэй үед нь ачаална (аймаг бүр тусдаа chunk). Бүх мөрийг хуудсанд оруулахгүй.
type Loader = () => Promise<{ default: { items: unknown[] } }>;

const JOINME: Record<string, Loader> = {
  uvs: () => import('@/data/services/uvs.json'),
  zavkhan: () => import('@/data/services/zavkhan.json'),
};

const OSM: Record<string, Loader> = {
  arkhangai: () => import('@/data/services/osm/arkhangai.json'),
  'bayan-ulgii': () => import('@/data/services/osm/bayan-ulgii.json'),
  bayankhongor: () => import('@/data/services/osm/bayankhongor.json'),
  bulgan: () => import('@/data/services/osm/bulgan.json'),
  'darkhan-uul': () => import('@/data/services/osm/darkhan-uul.json'),
  dornod: () => import('@/data/services/osm/dornod.json'),
  dornogov: () => import('@/data/services/osm/dornogov.json'),
  dundgov: () => import('@/data/services/osm/dundgov.json'),
  'gov-altai': () => import('@/data/services/osm/gov-altai.json'),
  govsumber: () => import('@/data/services/osm/govsumber.json'),
  khentii: () => import('@/data/services/osm/khentii.json'),
  khovd: () => import('@/data/services/osm/khovd.json'),
  khuvsgul: () => import('@/data/services/osm/khuvsgul.json'),
  orkhon: () => import('@/data/services/osm/orkhon.json'),
  selenge: () => import('@/data/services/osm/selenge.json'),
  sukhbaatar: () => import('@/data/services/osm/sukhbaatar.json'),
  tuv: () => import('@/data/services/osm/tuv.json'),
  umnugov: () => import('@/data/services/osm/umnugov.json'),
  uvs: () => import('@/data/services/osm/uvs.json'),
  uvurkhangai: () => import('@/data/services/osm/uvurkhangai.json'),
  zavkhan: () => import('@/data/services/osm/zavkhan.json'),
};

const cache = new Map<string, Promise<ServiceRow[]>>();

export function loadAimagServices(slug: string): Promise<ServiceRow[]> {
  const hit = cache.get(slug);
  if (hit) return hit;
  const loading = Promise.all([JOINME[slug]?.(), OSM[slug]?.()])
    .then((files) => {
      const items = files.flatMap((f) => (f ? (f.default.items as ProvinceService[]) : []));
      return rankServices(items.map((x) => ({ ...x, aimag: slug })));
    })
    .catch((err) => {
      // Дараагийн оролдлогод дахин татна
      cache.delete(slug);
      throw err;
    });
  cache.set(slug, loading);
  return loading;
}
