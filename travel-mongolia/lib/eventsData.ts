export interface EventSpot {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  location: string;
  region: string;
  date: string;
  image: string;
  description: string;
}

export const EVENTS_CATEGORIES = [
  { id: 'all', label: 'Бүгд' },
  { id: 'naadam', label: 'Их баяр наадам' },
  { id: 'tsagaan-sar', label: 'Цагаан сар' },
  { id: 'eagle-festival', label: 'Бүргэдийн баяр' },
  { id: 'camel-festival', label: 'Тэмээний баяр' },
  { id: 'ice-festival', label: 'Мөсний баяр' },
  { id: 'local-naadam', label: 'Орон нутгийн наадам' },
  { id: 'calendar', label: 'Арга хэмжээний хуанли' },
];

export const EVENTS_SPOTS: EventSpot[] = [
  {
    id: 'national-naadam',
    title: 'Үндэсний их баяр наадам',
    category: 'Их баяр наадам',
    categoryKey: 'naadam',
    location: 'Улаанбаатар хот, Төв цэнгэлдэх',
    region: 'Төвийн бүс',
    date: '7 сарын 11 - 13',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
    description:
      'Эрийн гурван наадам болох хүчит бөх, хурдан морь, сурын харвааг багтаасан ЮНЕСКО-ийн соёлын өв их баяр.',
  },
  {
    id: 'golden-eagle-festival',
    title: 'Алтайн бүргэдийн баяр',
    category: 'Бүргэдийн баяр',
    categoryKey: 'eagle-festival',
    location: 'Баян-Өлгий аймаг, Сагсай сум',
    region: 'Баруун бүс',
    date: '9 болон 10 сар',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    description:
      'Казах түмний гаршуулсан бүргэдээр ан хийх олон зуун жилийн уламжлалт тэмцээн, соёлын гайхамшиг.',
  },
  {
    id: 'thousand-camel-festival',
    title: 'Түмэн тэмээний баяр',
    category: 'Тэмээний баяр',
    categoryKey: 'camel-festival',
    location: 'Өмнөговь аймаг, Даланзадгад',
    region: 'Говийн бүс',
    date: '3 сарын эхээр',
    image:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
    description:
      'Хоёр бөхт тэмээний уралдаан, тэмээтэй буухиа, сайхан тэмээтэй хос шалгаруулах өвлийн өвөрмөц фестиваль.',
  },
  {
    id: 'khuvsgul-ice-festival',
    title: 'Хөх сувд - Хөвсгөлийн мөсний баяр',
    category: 'Мөсний баяр',
    categoryKey: 'ice-festival',
    location: 'Хөвсгөл аймаг, Хатгал тосгон',
    region: 'Хангайн бүс',
    date: '3 сарын эхээр',
    image:
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=900&q=80',
    description:
      'Толин цэнхэр мөсөн дээр морин чаргаар уралдах, мөсөн шагайн харваа болон мөсөн урлалын олон улсын арга хэмжээ.',
  },
  {
    id: 'tsagaan-sar-celebration',
    title: 'Уламжлалт Цагаан сарын баяр',
    category: 'Цагаан сар',
    categoryKey: 'tsagaan-sar',
    location: 'Монгол даяар / Малчин айлууд',
    region: 'Бүх бүс',
    date: '1 - 2 сар (Хаврын тэргүүн сар)',
    image:
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80',
    description:
      'Хаврын эхэн сард шинэ оноо угтах, ахмад настнаа хүндэтгэн золгох, уламжлалт зоог барих төрт ёсны их баяр.',
  },
  {
    id: 'danshig-naadam-khuree-tsam',
    title: 'Даншиг наадам ба Хүрээ цам',
    category: 'Орон нутгийн наадам',
    categoryKey: 'local-naadam',
    location: 'Төв аймаг, Хүй долоон худаг',
    region: 'Төвийн бүс',
    date: '8 сарын эхээр',
    image:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
    description:
      'Буддын шашны нууц тарнийн цам харайх зан үйл болон эрийн гурван наадмыг хослуулсан шашин, соёлын наадам.',
  },
];
