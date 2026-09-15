export interface NatureSpot {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  location: string;
  region: string;
  season: string;
  image: string;
  description: string;
}

export const NATURE_CATEGORIES = [
  { id: 'all', label: 'Бүгд' },
  { id: 'scenic', label: 'Үзэсгэлэнт газрууд' },
  { id: 'mountains', label: 'Уул, хөндий' },
  { id: 'lakes-rivers', label: 'Нуур, гол' },
  { id: 'gobi', label: 'Говь, манхан' },
  { id: 'forest', label: 'Ой, тайга' },
  { id: 'protected', label: 'Тусгай хамгаалалттай газар' },
  { id: 'camping', label: 'Кемпинг' },
  { id: 'photo', label: 'Гэрэл зураг' },
  { id: 'stargazing', label: 'Од харах / Stargazing' },
];

export const NATURE_SPOTS: NatureSpot[] = [
  {
    id: 'khuvsgul-lake',
    title: 'Хөвсгөл нуур',
    category: 'Нуур, гол',
    categoryKey: 'lakes-rivers',
    location: 'Хөвсгөл аймаг',
    region: 'Хангайн бүс',
    season: '6 - 9 сар',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
    description:
      'Дэлхийн хамгийн эртний бөгөөд цэнгэг уст нууруудын нэг, Монголын хөх сувд.',
  },
  {
    id: 'khongor-sand-dunes',
    title: 'Хонгорын элс',
    category: 'Говь, манхан',
    categoryKey: 'gobi',
    location: 'Өмнөговь аймаг',
    region: 'Говийн бүс',
    season: '5 - 10 сар',
    image:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
    description: '180 км үргэлжлэх Дуут манхан, нар жаргах үеийн элсэн долгио.',
  },
  {
    id: 'altan-gadas-stargazing',
    title: 'Өмнөговийн уудам тал (Од харах)',
    category: 'Од харах / Stargazing',
    categoryKey: 'stargazing',
    location: 'Өмнөговь аймаг',
    region: 'Говийн бүс',
    season: 'Бүх улирал',
    image:
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=900&q=80',
    description:
      'Гэрлийн бохирдолгүй задгай огторгуй дор Тэнгэрийн заадлыг нүдээр харах боломж.',
  },
  {
    id: 'altai-tavan-bogd',
    title: 'Алтай Таван Богд',
    category: 'Уул, хөндий',
    categoryKey: 'mountains',
    location: 'Баян-Өлгий аймаг',
    region: 'Баруун бүс',
    season: '6 - 8 сар',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    description:
      'Монгол орны хамгийн өндөр цэг хүйтэн оргил болон Потанины мөсөн гол.',
  },
  {
    id: 'orkhon-valley',
    title: 'Орхоны хөндийн байгалийн цогцолборт газар',
    category: 'Тусгай хамгаалалттай газар',
    categoryKey: 'protected',
    location: 'Өвөрхангай аймаг',
    region: 'Төвийн бүс',
    season: '5 - 10 сар',
    image:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
    description:
      'ЮНЕСКО-ийн соёлын болон байгалийн өвд бүртгэгдсэн түүхэн, үзэсгэлэнт хөндий.',
  },
  {
    id: 'terelj-camping',
    title: 'Горхи Тэрэлжийн Кемпинг',
    category: 'Кемпинг',
    categoryKey: 'camping',
    location: 'Төв аймаг',
    region: 'Төвийн бүс',
    season: '5 - 9 сар',
    image:
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80',
    description:
      'Улаанбаатараас ойр, хадат уулс, голын хөвөөгөөр аялж майхантай хоноглох таатай бүс.',
  },
];
