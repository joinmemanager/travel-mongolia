'use client';

import InspirationListing from '@/components/templates/InspirationListing';

interface ItineraryItem {
  id: string;
  category: string;
  categoryKey: string;
  days: string;
  title: string;
  subtitle: string;
  image: string;
  route: string;
  aspect: string;
}

const ITINERARY_FILTERS = [
  { id: 'all', label: 'Бүгд' },
  { id: '3-days', label: '3 өдөр' },
  { id: '5-days', label: '5 өдөр' },
  { id: '7-days', label: '7 өдөр' },
  { id: '10-days', label: '10 өдөр' },
  { id: '14-days', label: '14 өдөр' },
  { id: 'themed', label: 'Сэдэвчилсэн' },
];

const ITINERARY_ITEMS: ItineraryItem[] = [
  {
    id: '1',
    categoryKey: '3-days',
    category: 'Богино хугацааны',
    days: '3 Өдөр',
    title: 'Тэрэлж & Хустайн байгалийн цогцолбор',
    subtitle: 'УБ хотоос холгүй зэрлэг тахь үзэж, морь унан амрах төгс амралтын өдрүүд',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    route: 'УБ ➔ Хустай ➔ Тэрэлж ➔ УБ',
    aspect: 'h-[420px]',
  },
  {
    id: '2',
    categoryKey: '5-days',
    category: 'Дунд хугацааны',
    days: '5 Өдөр',
    title: 'Төв Монголын өв соёл & Элсэн тасархай',
    subtitle: 'Эртний Хархорум нийслэл, Эрдэнэзуу хийд, Орхоны хөндийгөөр аялах маршрут',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
    route: 'УБ ➔ Элсэн тасархай ➔ Хархорум ➔ Цэнхэрийн рашаан',
    aspect: 'h-[340px]',
  },
  {
    id: '3',
    categoryKey: '7-days',
    category: 'Классик аялал',
    days: '7 Өдөр',
    title: 'Өмнөд Говийн гайхамшигт экспедиц',
    subtitle: 'Цагаан суварга, Ёлын ам, Баянзаг, Хонгорын элсийг бүрэн туулах зам',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    route: 'УБ ➔ Дундговь ➔ Өмнөговь тойрог',
    aspect: 'h-[460px]',
  },
  {
    id: '4',
    categoryKey: '10-days',
    category: 'Их аялал',
    days: '10 Өдөр',
    title: 'Хөвсгөл нуур ба Хангайн нурууны тойрог',
    subtitle: 'Цэнхэр сувд нуураас Тэрхийн цагаан нуур, Тайхар чулуу хүртэлх байгалийн аялал',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=800&q=80',
    route: 'УБ ➔ Булган ➔ Хөвсгөл ➔ Архангай ➔ УБ',
    aspect: 'h-[360px]',
  },
  {
    id: '5',
    categoryKey: '14-days',
    category: 'Бүрэн экспедиц',
    days: '14 Өдөр',
    title: 'Баруун Монголын Алтай Таван Богдын аялал',
    subtitle: 'Мөсөн голууд, Казах айлуудын соёл, Бүргэдийн өлгий нутгаар туулах маршрут',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    route: 'УБ ➔ Баян-Өлгий ➔ Потанины мөсөн гол ➔ Увс нуур',
    aspect: 'h-[440px]',
  },
  {
    id: '6',
    categoryKey: 'themed',
    category: 'Сэдэвчилсэн',
    days: '6 Өдөр',
    title: 'Нүүдэлчдийн хоол & Цагаан идээний замнал',
    subtitle: 'Айраг исгэх, өрөм хайлах, уламжлалт малчин айлуудаар зочлох тусгай аялал',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    route: 'Булган ➔ Өвөрхангай сумдаар',
    aspect: 'h-[330px]',
  },
];

export default function ItinerariesPage() {
  return (
    <InspirationListing
      kicker="07. АЯЛАХ СЭДЭЛ"
      title="Маршрутууд"
      intro="Хугацаа, сонирхолдоо нийцүүлэн сонгох боломжтой нарийвчилсан замын зураглал, аяллын маршрутууд."
      param="days"
      filters={ITINERARY_FILTERS}
      items={ITINERARY_ITEMS.map((item) => ({
        id: item.id,
        categoryKey: item.categoryKey,
        image: item.image,
        title: item.title,
        desc: item.subtitle,
        eyebrow: `🧭 ${item.route}`,
        badges: [item.category, item.days],
        aspect: item.aspect,
      }))}
      footerLinks={[
        { label: 'Эхлэл рүү буцах (01. Magazine)', href: '/inspiration/magazine' },
      ]}
      footerNote="Нийт 7 хэсэг бүрэн хийгдэж дууслаа"
    />
  );
}
