export interface WildlifeSpot {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  location: string;
  region: string;
  bestTime: string;
  image: string;
  description: string;
}

export const WILDLIFE_CATEGORIES = [
  { id: 'all', label: 'Бүгд' },
  { id: 'snow-leopard', label: 'Цоохор ирвэс' },
  { id: 'argali-ibex', label: 'Аргаль, янгир' },
  { id: 'takhi', label: 'Тахь' },
  { id: 'khulan', label: 'Хулан' },
  { id: 'havtgai', label: 'Хавтгай тэмээ' },
  { id: 'mazaalai', label: 'Мазаалай баавгай' },
  { id: 'saiga', label: 'Монгол бөхөн' },
  { id: 'birdwatching', label: 'Шувуу ажиглах' },
  { id: 'wildlife-photo', label: 'Зэрлэг амьтны зураг' },
];

export const WILDLIFE_SPOTS: WildlifeSpot[] = [
  {
    id: 'khustai-takhi',
    title: 'Хустайн нурууны зэрлэг тахь ажиглалт',
    category: 'Тахь',
    categoryKey: 'takhi',
    location: 'Төв аймаг, Хустай БЦГ',
    region: 'Төвийн бүс',
    bestTime: 'Өглөө эрт, үдэш бүрий',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=900&q=80',
    description: 'Дэлхийд цор ганц үлдсэн зэрлэг адуу болох Пржевальскийн тахийг байгаль дээр нь харах тусгай бүс.',
  },
  {
    id: 'altai-snow-leopard',
    title: 'Алтайн нурууны цоохор ирвэсийн мөрөөр',
    category: 'Цоохор ирвэс',
    categoryKey: 'snow-leopard',
    location: 'Ховд, Баян-Өлгий аймаг',
    region: 'Баруун бүс',
    bestTime: '1 - 3, 10 - 11 сар',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    description: 'Хадат өндөр уулсын ноён саарал ирвэсийг мэргэжлийн ренжер, хөтөч нарын хамт дурандах экспедиц.',
  },
  {
    id: 'great-gobi-mazaalai',
    title: 'Говийн Их Дархан Цаазат Газар (Мазаалай)',
    category: 'Мазаалай баавгай',
    categoryKey: 'mazaalai',
    location: 'Говь-Алтай аймаг',
    region: 'Говийн бүс',
    bestTime: '5, 9 сар',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
    description: 'Дэлхийд 50 орчим л үлдсэн говийн нэн ховор баавгай мазаалай болон зэрлэг хавтгайн дархан цаазтай нутаг.',
  },
  {
    id: 'sharga-saiga',
    title: 'Шаргын говийн монгол бөхөн',
    category: 'Монгол бөхөн',
    categoryKey: 'saiga',
    location: 'Говь-Алтай аймаг, Шаргын говь',
    region: 'Баруун бүс',
    bestTime: '6 - 10 сар',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
    description: 'Мөстлөгийн үеэс өнөөг хүртэл амьд үлдсэн шовгор хоншоорт содон хөхтөн бөхөнгийн сүрэг.',
  },
  {
    id: 'ogii-lake-birds',
    title: 'Өгий нуурын нүүдлийн шувуудын чуулган',
    category: 'Шувуу ажиглах',
    categoryKey: 'birdwatching',
    location: 'Архангай аймаг, Өгий нуур',
    region: 'Хангайн бүс',
    bestTime: '5, 9 сар',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
    description: 'Рамсарын конвенцод бүртгэлтэй, 150 гаруй зүйл усны болон нүүдлийн шувуудыг ажиглах таатай орчин.',
  },
  {
    id: 'yolyn-am-ibex',
    title: 'Ёлын ам, Хонгорын аргаль янгирын сүрэг',
    category: 'Аргаль, янгир',
    categoryKey: 'argali-ibex',
    location: 'Өмнөговь аймаг, Гурвансайхан БЦГ',
    region: 'Говийн бүс',
    bestTime: 'Өглөө эрт',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80',
    description: 'Гүн хавцлын эгц хадан хясаагаар дүүлэн явах зэрлэг ямаа янгир болон угалз аргалийн сүрэг.',
  },
];