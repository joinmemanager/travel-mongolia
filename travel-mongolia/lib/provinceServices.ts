import uvs from '@/data/services/uvs.json';
import zavkhan from '@/data/services/zavkhan.json';

// Аймгийн практик үйлчилгээ (шатахуун, эмнэлэг, эмийн сан, ЗДТГ). Contentful-д биш, репод: data/services/<аймаг>.json.
// Эх: joinme.mn, scripts/joinme/import.js build үүсгэнэ. Одоогоор Завхан, Увсын мэдээлэл л бий.
export type ServiceType = 'fuel_station' | 'hospital' | 'pharmacy' | 'government';

export interface ProvinceService {
  id: string;
  name: string;
  type: ServiceType;
  soum: string | null;
  location: string | null;
  phones: string[];
  image: string | null;
}

export const SERVICE_LABEL: Record<ServiceType, string> = {
  fuel_station: 'Шатахуун түгээх станц',
  hospital: 'Эмнэлэг',
  pharmacy: 'Эмийн сан',
  government: 'Засаг даргын тамгын газар',
};

const BY_PROVINCE: Record<string, ProvinceService[]> = {
  uvs: uvs.items as ProvinceService[],
  zavkhan: zavkhan.items as ProvinceService[],
};

export const getProvinceServices = (provinceSlug: string): ProvinceService[] => BY_PROVINCE[provinceSlug] || [];
