import { client } from '@/lib/contentful';

export interface ProvinceLink {
  title: string;
  center: string;
  href: string;
}

// Contentful-ын бүх аймгийг /province/<slug> холбоостойгоор, нэрийн дарааллаар буцаана
export async function getProvinceLinks(): Promise<ProvinceLink[]> {
  try {
    const res = await client.getEntries({ content_type: 'province', limit: 100 });
    return res.items
      .map((item: any) => {
        const f = item.fields || {};
        return {
          title: String(f.title || ''),
          center: f.center ? `Төв: ${f.center}` : '',
          href: `/province/${f.slug || item.sys.id}`,
        };
      })
      .filter((p) => p.title)
      .sort((a, b) => a.title.localeCompare(b.title, 'mn'));
  } catch (err) {
    console.error('Аймгийн жагсаалт татахад алдаа гарлаа:', err);
    return [];
  }
}
