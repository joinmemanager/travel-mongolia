'use client';

import InspirationListing from '@/components/templates/InspirationListing';

interface StyleItem {
  id: string;
  category: string;
  categoryKey: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  aspect: string; // Masonry жигд бус өндөр
}

const STYLE_FILTERS = [
  { id: 'all', label: 'Бүгд' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'culture', label: 'Culture' },
  { id: 'family', label: 'Family' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'slow-travel', label: 'Slow Travel' },
  { id: 'photography', label: 'Photography' },
  { id: 'sustainable', label: 'Sustainable' },
];

const STYLE_ITEMS: StyleItem[] = [
  {
    id: '1',
    categoryKey: 'adventure',
    category: 'Adventure',
    title: 'Алтайн нурууны мөсөн оргил руу авирах нь',
    subtitle: 'Аглаг байгалийн сорилт, адал явдалт аялагчдад зориулав',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    tag: 'Extreme Trekking',
    aspect: 'h-[440px]',
  },
  {
    id: '2',
    categoryKey: 'culture',
    category: 'Culture',
    title: 'Нүүдэлчдийн гэр барьж, өв соёлд суралцах хором',
    subtitle: 'Монгол өв уламжлалтай биечлэн танилцах боломж',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    tag: 'Heritage & Roots',
    aspect: 'h-[320px]',
  },
  {
    id: '3',
    categoryKey: 'luxury',
    category: 'Luxury',
    title: 'Говийн хязгаар дахь 5 одтой Glamping амралт',
    subtitle: 'Зэрлэг байгаль дундах дээд зэрэглэлийн тав тух',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    tag: 'Premium Wilderness',
    aspect: 'h-[400px]',
  },
  {
    id: '4',
    categoryKey: 'photography',
    category: 'Photography',
    title: 'Тэнгэрийн заадас ба Хонгорын элсний нар жаргалт',
    subtitle: 'Гэрэл зургийн хальснаа буух хамгийн ховор агшнууд',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    tag: 'Golden Hour & Stars',
    aspect: 'h-[360px]',
  },
  {
    id: '5',
    categoryKey: 'slow-travel',
    category: 'Slow Travel',
    title: 'Орхоны хөндийгөөр морин тэргээр аниргүй аялах',
    subtitle: 'Амьдралын хурдыг сааруулж, байгальтайгаа нэгдэхүй',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
    tag: 'Mindful Travel',
    aspect: 'h-[460px]',
  },
  {
    id: '6',
    categoryKey: 'family',
    category: 'Family',
    title: 'Хөвсгөл нуурын эрэг дээрх гэр бүлийн намуун аялал',
    subtitle: 'Бүх насныханд зориулсан аюулгүй, тав тухтай амралт',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=800&q=80',
    tag: 'Kid Friendly',
    aspect: 'h-[340px]',
  },
  {
    id: '7',
    categoryKey: 'sustainable',
    category: 'Sustainable',
    title: 'Эко аялал: Хог хаягдалгүй, ул мөргүй зорчих хэв маяг',
    subtitle: 'Байгаль дэлхийгээ хамгаалж, орон нутгийг дэмжих нь',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    tag: 'Zero Waste Trip',
    aspect: 'h-[380px]',
  },
  {
    id: '8',
    categoryKey: 'adventure',
    category: 'Adventure',
    title: 'Баянзагийн шавар цаваар хийх мотоциклтэй аялал',
    subtitle: 'Тал хээрийн салхи сөрөн эрх чөлөөг мэдрэх өдрүүд',
    image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=800&q=80',
    tag: 'Off-road Expedition',
    aspect: 'h-[420px]',
  },
];

export default function StylesPage() {
  return (
    <InspirationListing
      kicker="03. АЯЛАХ СЭДЭЛ"
      title="Хэв маягаар"
      intro="Аялал бүр өөрийн гэсэн онцлогтой. Таны дотоод сэтгэл ямар аяллыг хүсэж буйд тохирох төгс хэв маягийг эндээс олоорой."
      param="style"
      filters={STYLE_FILTERS}
      items={STYLE_ITEMS.map((item) => ({
        id: item.id,
        categoryKey: item.categoryKey,
        image: item.image,
        title: item.title,
        desc: item.subtitle,
        eyebrow: item.category,
        badges: [item.tag],
        aspect: item.aspect,
      }))}
      footerLinks={[
        { label: 'Дараах: 04. Hidden Mongolia', href: '/inspiration/hidden' },
      ]}
    />
  );
}
