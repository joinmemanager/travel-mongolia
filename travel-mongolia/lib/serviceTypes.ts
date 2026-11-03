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

export const OSM_ATTRIBUTION = '© OpenStreetMap contributors (ODbL)';
export const OSM_COPYRIGHT_URL = 'https://www.openstreetmap.org/copyright';
export const mapHref = (s: Pick<ProvinceService, 'lat' | 'lon'>) => `https://www.openstreetmap.org/?mlat=${s.lat}&mlon=${s.lon}#map=17/${s.lat}/${s.lon}`;
