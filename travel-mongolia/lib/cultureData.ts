export interface CultureSpot {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  location: string;
  region: string;
  period: string;
  image: string;
  description: string;
}

export const CULTURE_CATEGORIES = [
  { id: 'all', label: 'Бүгд' },
  { id: 'historical-sites', label: 'Түүхэн дурсгал' },
  { id: 'archaeology', label: 'Археологийн газар' },
  { id: 'monasteries', label: 'Хийд, сүм' },
  { id: 'museums', label: 'Музей' },
  { id: 'unesco', label: 'UNESCO өв' },
  { id: 'arts', label: 'Монгол урлаг' },
  { id: 'music-dance', label: 'Хөгжим, бүжиг' },
  { id: 'crafts', label: 'Гар урлал' },
  { id: 'workshops', label: 'Соёлын сургалт' },
];

export const CULTURE_SPOTS: CultureSpot[] = [
  {
    id: 'erdene-zuu',
    title: 'Эрдэнэ зуу хийд',
    category: 'Хийд, сүм',
    categoryKey: 'monasteries',
    location: 'Өвөрхангай аймаг, Хархорин',
    region: 'Хангайн бүс',
    period: 'XVI зуун (1586 он)',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
    description: 'Эртний нийслэл Хархорум хотын туурин дээр сүндэрлэсэн Монголын анхны буддын шашны хийд.',
  },
  {
    id: 'chinggis-khan-statue',
    title: 'Чингис хааны морьт хөшөө цогцолбор',
    category: 'Түүхэн дурсгал',
    categoryKey: 'historical-sites',
    location: 'Төв аймаг, Цонжин болдог',
    region: 'Төвийн бүс',
    period: 'Орчин үе',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
    description: 'Дэлхийн хамгийн том морьт хөшөө ба доторх түүхийн үзмэр, алтан ташуур домогт нутаг.',
  },
  {
    id: 'orkhon-valley-cultural',
    title: 'Орхоны хөндийн соёлын дурсгалт газар',
    category: 'UNESCO өв',
    categoryKey: 'unesco',
    location: 'Өвөрхангай, Архангай',
    region: 'Хангайн бүс',
    period: 'МЭ VI-XIV зуун',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
    description: 'Түрэг, Уйгар, Их Монгол гүрний төв болж байсан ЮНЕСКО-ийн дэлхийн өвд бүртгэлтэй түүхэн хөндий.',
  },
  {
    id: 'chinggis-museum-ub',
    title: 'Чингис хаан үндэсний музей',
    category: 'Музей',
    categoryKey: 'museums',
    location: 'Улаанбаатар хот',
    region: 'Төвийн бүс',
    period: 'Хүннүгээс XX зуун хүртэл',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80',
    description: 'Монголын хаад язгууртны 10,000 гаруй эх олдвор, үзмэрийг дэглэсэн олон улсын жишиг бүхий музей.',
  },
  {
    id: 'tsagaan-suvarga-archaeology',
    title: 'Цагаан суварга ба Цахиуртын хөндий',
    category: 'Археологийн газар',
    categoryKey: 'archaeology',
    location: 'Дундговь аймаг',
    region: 'Говийн бүс',
    period: 'Чулуун зэвсгийн үе',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    description: 'Эртний далайн ёроол бүхий байгалийн цав цамхаг ба палеолитын үеийн чулуун зэвсгийн суурин.',
  },
  {
    id: 'morin-khuur-workshop',
    title: 'Морин хуур, хөөмэйн уламжлалт урлаг',
    category: 'Хөгжим, бүжиг',
    categoryKey: 'music-dance',
    location: 'Улаанбаатар хот',
    region: 'Төвийн бүс',
    period: 'Биет бус соёлын өв',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=900&q=80',
    description: 'Монгол ардын язгуур аялгуу, аялгуут исгэрээ, хөөмэйн тоглолт болон хуур урлалын туршлага.',
  },
];