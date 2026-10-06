'use client';

import InspirationListing from '@/components/templates/InspirationListing';

interface StoryItem {
  id: string;
  category: string;
  categoryKey: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  aspect: string;
}

const STORY_FILTERS = [
  { id: 'all', label: 'Бүгд' },
  { id: 'herder', label: 'Малчин ахуй' },
  { id: 'artisan', label: 'Уламжлалт урлал' },
  { id: 'guide', label: 'Хөтөч нарын тэмдэглэл' },
];

const STORY_ITEMS: StoryItem[] = [
  {
    id: '1',
    categoryKey: 'herder',
    category: 'Малчин ахуй',
    title: 'Талын салхитай уралдан адуу хураах үүр цайх мөч',
    subtitle: 'Сүхбаатар аймаг • Түмэн адууны нутгийн адуучин залуугийн нэг өдөр',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    tag: 'Малчин • Б.Болд',
    aspect: 'h-[440px]',
  },
  {
    id: '2',
    categoryKey: 'artisan',
    category: 'Уламжлалт урлал',
    title: 'Морин хуурын толгой сийлэхэд шингэсэн 40 жилийн хөдөлмөр',
    subtitle: 'Улаанбаатар хот • Урлаач өвөөгийн урлангаас хийсэн ярилцлага',
    image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=800&q=80',
    tag: 'Гар урлал • Ц.Дорж',
    aspect: 'h-[330px]',
  },
  {
    id: '3',
    categoryKey: 'guide',
    category: 'Хөтөч нарын тэмдэглэл',
    title: 'Алтайн оргилд казах бүргэдчидтэй хамт өвөлжсөн нь',
    subtitle: 'Баян-Өлгий аймаг • Уулын хөтөчийн аяллын бодит тэмдэглэл',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    tag: 'Хөтөч • А.Серик',
    aspect: 'h-[420px]',
  },
  {
    id: '4',
    categoryKey: 'herder',
    category: 'Малчин ахуй',
    title: 'Зүүн тайгын цаатан гэр бүлийн өвлийн нүүдэл',
    subtitle: 'Хөвсгөл аймаг • Цаатнуудын олон зуун жил хадгалсан зохицол',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=800&q=80',
    tag: 'Цаатан • О.Ганбат',
    aspect: 'h-[360px]',
  },
  {
    id: '5',
    categoryKey: 'artisan',
    category: 'Уламжлалт урлал',
    title: 'Эсгий ширмэл урлал: Нүүдэлчин эмэгтэйчүүдийн хамтын хүч',
    subtitle: 'Архангай аймаг • Гар урлалаар бие даасан эмэгтэйчүүдийн нөхөрлөл',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
    tag: 'Эсгий урлал • С.Саран',
    aspect: 'h-[450px]',
  },
  {
    id: '6',
    categoryKey: 'guide',
    category: 'Хөтөч нарын тэмдэглэл',
    title: 'Говийн уудамд зүг чигээ хэрхэн олох вэ?',
    subtitle: 'Өмнөговь аймаг • Замгүй хээр талд GPS-гүй чиг баримжаалах ухаан',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    tag: 'Хөтөч • М.Батбаяр',
    aspect: 'h-[350px]',
  },
];

export default function StoriesPage() {
  return (
    <InspirationListing
      kicker="05. АЯЛАХ СЭДЭЛ"
      title="Local Stories"
      intro="Эгэл жирийн малчид, уран гартнууд, аяллын хөтөч нарын амьдралын бодит өгүүлэмж ба дурсамжууд."
      param="cat"
      filters={STORY_FILTERS}
      items={STORY_ITEMS.map((item) => ({
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
        { label: 'Дараах: 06. Top Lists', href: '/inspiration/top-lists' },
      ]}
    />
  );
}
