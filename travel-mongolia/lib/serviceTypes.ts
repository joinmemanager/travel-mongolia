// «Хэрэгтэй үйлчилгээ»-ний төрөл, шошго. Client компонентод ашиглана: өгөгдлийн JSON-ыг (lib/provinceServices.ts) багцад оруулахгүй.
export type ServiceType = 'fuel_station' | 'hospital' | 'pharmacy' | 'government' | 'police' | 'bank';

export interface ProvinceService {
  id: string;
  name: string;
  type: ServiceType;
  soum: string | null;
  location: string | null;
  phones: string[];
  image: string | null;
  source?: 'osm';
  lat?: number;
  lon?: number;
}

export interface ServiceRow extends ProvinceService {
  aimag: string;
}

export const SERVICE_LABEL: Record<ServiceType, string> = {
  fuel_station: 'Шатахуун түгээх станц',
  hospital: 'Эмнэлэг',
  pharmacy: 'Эмийн сан',
  police: 'Цагдаа',
  bank: 'Банк, АТМ',
  government: 'Засаг даргын тамгын газар',
};

export const SERVICES_BASE = '/plan/useful-services' as const;
export const SERVICE_ICON: Record<ServiceType, string> = {
  fuel_station: 'fuel',
  hospital: 'hospital',
  pharmacy: 'pharmacy',
  police: 'police',
  bank: 'bank',
  government: 'government',
};

// Ерөнхий нэр: «ШТС», «Банк», нэргүй шатахуун. Жагсаалтын хамгийн сүүлд.
const GENERIC_NAME = /^(шатахуун түгээх (станц|газар)|штс\d*|шгс|тзс|азс|бензин колонк|fuel|petrol|independent fuel station|банк|bank|local branch bank|atm|атм|эмнэлэг|emneleg|хувийн эмнэлэг|өрхийн эмнэлэг|сумын эмнэлэг|county hospital|доктор|өрх\d*|эмийн сан|emiin san|emin san|цагдаа|tsagdaa|police|post)$/iu;
export const isGenericService = (name: string) => GENERIC_NAME.test(name.trim());

// Төрлүүдийг ээлжлэх дараалал
const MIX_ORDER: ServiceType[] = ['fuel_station', 'hospital', 'pharmacy', 'bank', 'police', 'government'];

function roundRobin<T>(groups: T[][]): T[] {
  const out: T[] = [];
  for (let i = 0; groups.some((g) => i < g.length); i++) {
    for (const g of groups) if (i < g.length) out.push(g[i]);
  }
  return out;
}

const groupBy = <T,>(rows: T[], key: (x: T) => string): T[][] => {
  const m = new Map<string, T[]>();
  for (const x of rows) m.set(key(x), [...(m.get(key(x)) || []), x]);
  return [...m.values()];
};

// Эрэмбэ: утастай → брэнд, тодорхой нэртэй → ерөнхий нэртэй (утастай ч сүүлд). Давхарга бүрт төрөл, аймаг ээлжилнэ.
export function rankServices(rows: ServiceRow[]): ServiceRow[] {
  const tier = (x: ServiceRow) => (isGenericService(x.name) ? 2 : x.phones.length > 0 ? 0 : 1);
  return [0, 1, 2].flatMap((t) => {
    const inTier = rows.filter((x) => tier(x) === t);
    return roundRobin(
      MIX_ORDER.map((type) => roundRobin(groupBy(inTier.filter((x) => x.type === type), (x) => x.aimag)))
    );
  });
}

export const OSM_ATTRIBUTION = '© OpenStreetMap contributors (ODbL)';
export const OSM_COPYRIGHT_URL = 'https://www.openstreetmap.org/copyright';
export const mapHref = (s: Pick<ProvinceService, 'lat' | 'lon'>) => `https://www.openstreetmap.org/?mlat=${s.lat}&mlon=${s.lon}#map=17/${s.lat}/${s.lon}`;
