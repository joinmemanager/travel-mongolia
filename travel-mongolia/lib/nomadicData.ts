export interface NomadicSpot {
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

export const NOMADIC_CATEGORIES = [
  { id: 'all', label: 'Бүгд' },
  { id: 'visit-herder', label: 'Малчин айлд зочлох' },
  { id: 'ger-stay', label: 'Гэрт байрлах' },
  { id: 'herding', label: 'Мал маллагаа' },
  { id: 'horse-riding', label: 'Морь унах' },
  { id: 'milking', label: 'Сааль саах' },
  { id: 'dairy', label: 'Цагаан идээ' },
  { id: 'airag', label: 'Айраг исгэх' },
  { id: 'migration', label: 'Нүүдэл дагах' },
  { id: 'local-exp', label: 'Орон нутгийн туршлага' },
];

export const NOMADIC_SPOTS: NomadicSpot[] = [
  {
    id: 'orkhon-herder-family',
    title: 'Орхоны хөндийн малчин айлд зочлох',
    category: 'Малчин айлд зочлох',
    categoryKey: 'visit-herder',
    location: 'Өвөрхангай аймаг',
    region: 'Хангайн бүс',
    season: '6 - 9 сар',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
    description: 'Жинхэнэ нүүдэлчин айлын өдөр тутмын амьдралтай танилцаж, халуун цай, зочломтгой занг мэдрэх аялал.',
  },
  {
    id: 'terelj-traditional-ger',
    title: 'Тэрэлжийн уламжлалт эсгий гэрт байрлах',
    category: 'Гэрт байрлах',
    categoryKey: 'ger-stay',
    location: 'Төв аймаг',
    region: 'Төвийн бүс',
    season: 'Бүх улирал',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80',
    description: 'Олон зуун жилийн уламжлалт дугуй эсгий гэрт хоноглож, одот тэнгэр дор тав тухтай амрах боломж.',
  },
  {
    id: 'bulgan-airag-experience',
    title: 'Булганы Сайхан сумын айраг исгэх соёл',
    category: 'Айраг исгэх',
    categoryKey: 'airag',
    location: 'Булган аймаг',
    region: 'Хангайн бүс',
    season: '7 - 9 сар',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=900&q=80',
    description: 'Хөхүүрийн айраг бүлэх, исгэх уламжлалт технологитой танилцаж, амталгаа хийх өвөрмөц туршлага.',
  },
  {
    id: 'khentii-horse-riding',
    title: 'Хэрлэнгийн хөндийн морь унах аялал',
    category: 'Морь унах',
    categoryKey: 'horse-riding',
    location: 'Хэнтий аймаг',
    region: 'Зүүн бүс',
    season: '5 - 10 сар',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
    description: 'Тал нутгийн уудам хөндийгөөр монгол эмээл, хазаартай морь унаж, чөлөөтэй давхих эрх чөлөө.',
  },
  {
    id: 'arvaikheer-dairy-making',
    title: 'Уламжлалт өрөм, ааруул боловсруулах',
    category: 'Цагаан идээ',
    categoryKey: 'dairy',
    location: 'Архангай аймаг',
    region: 'Хангайн бүс',
    season: '6 - 8 сар',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
    description: 'Сүү хөөрүүлэх, өрөм загсаах, ээзгий болон ааруул хатаах нүүдэлчдийн экологийн цэвэр хүнсний соёл.',
  },
  {
    id: 'altai-seasonal-migration',
    title: 'Алтайн уулсын улирлын нүүдэл дагах',
    category: 'Нүүдэл дагах',
    categoryKey: 'migration',
    location: 'Баян-Өлгий аймаг',
    region: 'Баруун бүс',
    season: '5 болон 9 сар',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    description: 'Зуслан, намаржааны хооронд хэдэн зуун мал тууж, нүүдлийн ачаатай хамт алхах ховор мэдрэмж.',
  },
];