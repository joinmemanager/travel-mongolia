'use client';

import InspirationListing from '@/components/templates/InspirationListing';

interface HiddenItem {
  id: string;
  category: string;
  categoryKey: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  aspect: string;
}

const HIDDEN_FILTERS = [
  { id: 'all', label: 'Бүгд' },
  { id: 'nature', label: 'Байгалийн содон' },
  { id: 'heritage', label: 'Эртний туурь, түүх' },
  { id: 'isolated', label: 'Хөндөгдөөгүй аглаг' },
];

const HIDDEN_ITEMS: HiddenItem[] = [
  {
    id: '1',
    categoryKey: 'nature',
    category: 'Байгалийн содон',
    title: 'Хэрмэн цавын улаан хавцал',
    subtitle: 'Өмнөговь аймаг • Сая сая жилийн өмнөх далайн ёроол',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    tag: 'EXP-01 • 1,120м',
    aspect: 'h-[440px]',
  },
  {
    id: '2',
    categoryKey: 'isolated',
    category: 'Хөндөгдөөгүй аглаг',
    title: 'Сангийн далай нуурын шувуудын чуулган',
    subtitle: 'Хөвсгөл аймаг • Жуулчдын хөл хүрээгүй аниргүй булаг',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=800&q=80',
    tag: 'EXP-02 • 1,488м',
    aspect: 'h-[320px]',
  },
  {
    id: '3',
    categoryKey: 'heritage',
    category: 'Эртний туурь, түүх',
    title: 'Хамарын хийдийн 108 бясалгалын агуй',
    subtitle: 'Дорноговь аймаг • Данзанравжаа хутагтын даяаны орон',
    image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=800&q=80',
    tag: 'EXP-03 • 960м',
    aspect: 'h-[400px]',
  },
  {
    id: '4',
    categoryKey: 'isolated',
    category: 'Хөндөгдөөгүй аглаг',
    title: 'Баян-Айрагийн хавцал ба хадан хүрхрээ',
    subtitle: 'Завхан аймаг • Газрын зурагт тэмдэглэгдээгүй нууц рашаан',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    tag: 'EXP-04 • 2,150м',
    aspect: 'h-[360px]',
  },
  {
    id: '5',
    categoryKey: 'heritage',
    category: 'Эртний туурь, түүх',
    title: 'Суварга хайрханы нууц сүмбэр',
    subtitle: 'Архангай аймаг • Эрт дээр үеэс тахиж ирсэн онгон хайрхан',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
    tag: 'EXP-05 • 3,117м',
    aspect: 'h-[460px]',
  },
  {
    id: '6',
    categoryKey: 'nature',
    category: 'Байгалийн содон',
    title: 'Нэмэгтийн хөндийн үлэг гүрвэлийн оршуулга',
    subtitle: 'Өмнөговь аймаг • Дэлхийд алдартай палеонтологийн өлгий',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    tag: 'EXP-06 • 1,350м',
    aspect: 'h-[340px]',
  },
];

export default function HiddenPage() {
  return (
    <InspirationListing
      kicker="04. АЯЛАХ СЭДЭЛ"
      title="Hidden Mongolia"
      intro="Жуулчдын хөлд талхлагдаагүй онгон дагшин газрууд болон газрын зураг дээр тэмдэглэгдээгүй нууц өнцгүүд."
      param="cat"
      filters={HIDDEN_FILTERS}
      items={HIDDEN_ITEMS.map((item) => ({
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
        { label: 'Дараах: 05. Local Stories', href: '/inspiration/stories' },
      ]}
    />
  );
}
