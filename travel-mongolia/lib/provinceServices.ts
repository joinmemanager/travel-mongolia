import osmArkhangai from '@/data/services/osm/arkhangai.json';
import osmBayanUlgii from '@/data/services/osm/bayan-ulgii.json';
import osmBayankhongor from '@/data/services/osm/bayankhongor.json';
import osmBulgan from '@/data/services/osm/bulgan.json';
import osmDarkhanUul from '@/data/services/osm/darkhan-uul.json';
import osmDornod from '@/data/services/osm/dornod.json';
import osmDornogov from '@/data/services/osm/dornogov.json';
import osmDundgov from '@/data/services/osm/dundgov.json';
import osmGovAltai from '@/data/services/osm/gov-altai.json';
import osmGovsumber from '@/data/services/osm/govsumber.json';
import osmKhentii from '@/data/services/osm/khentii.json';
import osmKhovd from '@/data/services/osm/khovd.json';
import osmKhuvsgul from '@/data/services/osm/khuvsgul.json';
import osmOrkhon from '@/data/services/osm/orkhon.json';
import osmSelenge from '@/data/services/osm/selenge.json';
import osmSukhbaatar from '@/data/services/osm/sukhbaatar.json';
import osmTuv from '@/data/services/osm/tuv.json';
import osmUmnugov from '@/data/services/osm/umnugov.json';
import osmUvs from '@/data/services/osm/uvs.json';
import osmUvurkhangai from '@/data/services/osm/uvurkhangai.json';
import osmZavkhan from '@/data/services/osm/zavkhan.json';
import uvs from '@/data/services/uvs.json';
import zavkhan from '@/data/services/zavkhan.json';
import type { ProvinceService } from '@/lib/serviceTypes';

// Аймгийн практик үйлчилгээ. Contentful-д биш, репод, эх сурвалж тус бүр тусдаа файлд:
//   data/services/<аймаг>.json: joinme.mn (Завхан, Увс), scripts/joinme/import.js build үүсгэнэ
//   data/services/osm/<аймаг>.json: OpenStreetMap (ODbL), scripts/osm/services.js build үүсгэнэ
const items = (file: { items: unknown[] }) => file.items as ProvinceService[];

const JOINME: Record<string, ProvinceService[]> = { uvs: items(uvs), zavkhan: items(zavkhan) };
const OSM: Record<string, ProvinceService[]> = {
  arkhangai: items(osmArkhangai),
  'bayan-ulgii': items(osmBayanUlgii),
  bayankhongor: items(osmBayankhongor),
  bulgan: items(osmBulgan),
  'darkhan-uul': items(osmDarkhanUul),
  dornod: items(osmDornod),
  dornogov: items(osmDornogov),
  dundgov: items(osmDundgov),
  'gov-altai': items(osmGovAltai),
  govsumber: items(osmGovsumber),
  khentii: items(osmKhentii),
  khovd: items(osmKhovd),
  khuvsgul: items(osmKhuvsgul),
  orkhon: items(osmOrkhon),
  selenge: items(osmSelenge),
  sukhbaatar: items(osmSukhbaatar),
  tuv: items(osmTuv),
  umnugov: items(osmUmnugov),
  uvs: items(osmUvs),
  uvurkhangai: items(osmUvurkhangai),
  zavkhan: items(osmZavkhan),
};

export const SERVICE_PROVINCES = Object.keys(OSM);

export const getProvinceServices = (provinceSlug: string): ProvinceService[] => [
  ...(JOINME[provinceSlug] || []),
  ...(OSM[provinceSlug] || []),
];
