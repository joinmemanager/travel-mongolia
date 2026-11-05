import { client, rethrowOutage } from '@/lib/contentful';
import { SAMPLE_PREFIX } from '@/lib/localContent';
import { provincesIn } from '@/lib/provinceNames';

// Impact Dashboard v1 (/impact#local-impact): Contentful-ын нийтлэгдсэн өгөгдлөөс автоматаар тооцоолно.
// "[ЖИШЭЭ]" entry ямар ч орчинд (preview дээр ч) тоонд орохгүй. Тоо зохиохгүй:
// өгөгдөлгүй үзүүлэлт null буцаана ("Мэдээлэл удахгүй").

export type ImpactKey =
  | 'providers'
  | 'provinces'
  | 'experiences'
  | 'womenYouthLed'
  | 'income'
  | 'projects'
  | 'contentToBooking';

export interface ImpactValue {
  // Харуулах утга ("12", "60%"). null бол "Мэдээлэл удахгүй"
  value: string | null;
  // Нэмэлт тайлбар ("5 нийтлэлээс 3")
  note?: string;
}

// Зөвхөн тоолоход хэрэгтэй талбарууд: бүтэн entry 2 MB-аас хэтэрвэл Data Cache-д (lib/contentful.ts) орохгүй,
// хуудас дахин үүсэх бүрт Contentful руу хүсэлт явна
async function allEntries(contentType: string, select: string[]): Promise<any[]> {
  try {
    const res = await client.getEntries({ content_type: contentType, select: ['sys.id', ...select], limit: 1000, include: 0 } as any);
    return res.items as any[];
  } catch (err) {
    rethrowOutage(err);
    return [];
  }
}

const notSample = (e: any) => {
  const f = e.fields || {};
  const title = String(f.title || f.name || '');
  return title && !title.startsWith(SAMPLE_PREFIX);
};

const text = (v: any) => (typeof v === 'string' ? v.trim() : '');

export async function computeImpact(): Promise<Record<ImpactKey, ImpactValue>> {
  const [providers, experiences] = (
    await Promise.all([
      allEntries('localProvider', ['fields.name', 'fields.province', 'fields.womenOrYouthLed']),
      allEntries('communityExperience', ['fields.title', 'fields.province']),
    ])
  ).map((list) => list.filter(notSample));

  // Хамрагдсан аймаг: үйлчилгээ үзүүлэгч, туршлагын аймгийн нэрс (21 аймаг + Улаанбаатар)
  const provinces = new Set<string>();
  [...providers, ...experiences].forEach((e) => provincesIn(text(e.fields?.province)).forEach((p) => provinces.add(p)));

  return {
    providers: { value: String(providers.length) },
    provinces: { value: String(provinces.size) },
    experiences: { value: String(experiences.length) },
    womenYouthLed: { value: String(providers.filter((p) => p.fields?.womenOrYouthLed === true).length) },
    // Contentful-д байхгүй өгөгдөл (docs/analytics.md, 5-р хэсэг)
    income: { value: null },
    projects: { value: null },
    contentToBooking: { value: null },
  };
}
