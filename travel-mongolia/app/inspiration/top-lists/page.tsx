'use client';

import InspirationListing from '@/components/templates/InspirationListing';

interface TopListItem {
  id: string;
  category: string;
  categoryKey: string;
  rank: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  aspect: string;
}

const TOP_LIST_FILTERS = [
  { id: 'all', label: 'Бүгд' },
  { id: 'top5', label: 'Top 5' },
  { id: 'top10', label: 'Top 10' },
  { id: 'best-of-mongolia', label: 'Best of Mongolia' },
];

const TOP_LIST_ITEMS: TopListItem[] = [
  {
    id: '1',
    categoryKey: 'best-of-mongolia',
    category: 'Best of Mongolia',
    rank: '#01',
    title: 'Монголд заавал очиж үзэх 7 байгалийн гайхамшиг',
    subtitle: 'Хөвсгөл, Хонгорын элс, Алтай Таван Богд тэргүүтэй шилдэг цэгүүд',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    tag: 'Шилдэг байгаль',
    aspect: 'h-[440px]',
  },
  {
    id: '2',
    categoryKey: 'top5',
    category: 'Top 5',
    rank: '#02',
    title: 'Улаанбаатараас 2 цагийн дотор очих топ 5 амралтын цэг',
    subtitle: 'Амралтын өдрүүдээр салхинд гарахад хамгийн тохиромжтой байршлууд',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    tag: 'Амралтын өдөр',
    aspect: 'h-[330px]',
  },
  {
    id: '3',
    categoryKey: 'top10',
    category: 'Top 10',
    rank: '#03',
    title: 'Монголын хамгийн өндөр үнэлгээтэй 10 эко-лодж & кэмп',
    subtitle: 'Тав тух, байгаль орчны тэнцвэрийг төгс хангасан шилдэг баазууд',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
    tag: 'Шилдэг баазууд',
    aspect: 'h-[420px]',
  },
  {
    id: '4',
    categoryKey: 'best-of-mongolia',
    category: 'Best of Mongolia',
    rank: '#04',
    title: 'Гадаад жуулчдын хамгийн их дурласан Монгол 5 хоол',
    subtitle: 'Хорхог, бууз, өрөмтэй халуун талх ба үндэсний уламжлалт зоог',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    tag: 'Аяллын зоог',
    aspect: 'h-[360px]',
  },
  {
    id: '5',
    categoryKey: 'top5',
    category: 'Top 5',
    rank: '#05',
    title: 'Зэрлэг амьтад харах хамгийн өндөр магадлалтай 5 бүс нутаг',
    subtitle: 'Хустайн тахь, Говийн мазаалай, хавтгай, Алтайн аргаль угалз',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    tag: 'Ан амьтан',
    aspect: 'h-[450px]',
  },
  {
    id: '6',
    categoryKey: 'top10',
    category: 'Top 10',
    rank: '#06',
    title: 'Гэрэл зурагчдын заавал очих ёстой 10 өнцөг',
    subtitle: 'Өглөөний нар ургах, оройн жаргах наран ба тэнгэрийн заадлын цэгүүд',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    tag: 'Гэрэл зураг',
    aspect: 'h-[350px]',
  },
];

export default function TopListsPage() {
  return (
    <InspirationListing
      kicker="06. АЯЛАХ СЭДЭЛ"
      title="Top Lists"
      intro="Аялагчдын бодит сэтгэгдэл, үнэлгээ болон мэргэжлийн хөтөч нарын сонгосон шилдэг жагсаалтууд."
      param="list"
      filters={TOP_LIST_FILTERS}
      items={TOP_LIST_ITEMS.map((item) => ({
        id: item.id,
        categoryKey: item.categoryKey,
        image: item.image,
        title: item.title,
        desc: item.subtitle,
        eyebrow: item.category,
        badges: [item.tag, item.rank],
        aspect: item.aspect,
      }))}
      footerLinks={[
        { label: 'Дараах: 07. Маршрутууд', href: '/inspiration/itineraries' },
      ]}
    />
  );
}
