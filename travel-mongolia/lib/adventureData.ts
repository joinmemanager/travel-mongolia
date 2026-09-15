export interface AdventureSpot {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  location: string;
  region: string;
  difficulty: string;
  season: string;
  image: string;
  description: string;
}

export const ADVENTURE_CATEGORIES = [
  { id: 'all', label: 'Бүгд' },
  { id: 'hiking', label: 'Hiking, Trekking' },
  { id: 'climbing', label: 'Ууланд авиралт' },
  { id: 'horse', label: 'Морин аялал' },
  { id: 'camel', label: 'Тэмээн аялал' },
  { id: 'biking', label: 'Дугуйн аялал' },
  { id: 'kayaking', label: 'Kayaking / Rafting' },
  { id: 'offroad', label: '4×4 Off-road' },
  { id: 'winter', label: 'Цана, snowboard' },
  { id: 'other', label: 'Бусад үйл ажиллагаа' },
];

export const ADVENTURE_SPOTS: AdventureSpot[] = [
  {
    id: 'tavan-bogd-trek',
    title: 'Алтай Таван Богдын авиралт ба мөсөн голын трек',
    category: 'Ууланд авиралт',
    categoryKey: 'climbing',
    location: 'Баян-Өлгий аймаг',
    region: 'Баруун бүс',
    difficulty: 'Хүнд',
    season: '6 - 8 сар',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    description:
      'Хүйтэн оргил (4374м) руу мэргэжлийн хөтөчтэй авирах болон Потанины мөсөн голоор алхах адал явдал.',
  },
  {
    id: 'khuvsgul-horse-trek',
    title: 'Дархадын хотгор, Хөвсгөлийн тайгын морин аялал',
    category: 'Морин аялал',
    categoryKey: 'horse',
    location: 'Хөвсгөл аймаг',
    region: 'Хангайн бүс',
    difficulty: 'Дунд',
    season: '6 - 9 сар',
    image:
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=900&q=80',
    description:
      'Олон өдрийн морин аяллаар тайгын гүн дэх цаатны урцад очиж, онгон дагшин байгальтай танилцах.',
  },
  {
    id: 'gobi-camel-expedition',
    title: 'Хонгорын элсний тэмээн цуваа аялал',
    category: 'Тэмээн аялал',
    categoryKey: 'camel',
    location: 'Өмнөговь аймаг',
    region: 'Говийн бүс',
    difficulty: 'Хялбар',
    season: '5 - 10 сар',
    image:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
    description:
      'Хоёр бөхт тэмээгээр дуут манхныг даван нар жаргахыг ажиглах жинхэнэ нүүдэлчдийн арга барил.',
  },
  {
    id: 'orkhon-kayaking',
    title: 'Орхон голын хавцлын рафтинг ба каяк',
    category: 'Kayaking / Rafting',
    categoryKey: 'kayaking',
    location: 'Өвөрхангай аймаг',
    region: 'Төвийн бүс',
    difficulty: 'Дунд',
    season: '6 - 8 сар',
    image:
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=80',
    description:
      'Галт уулын чулуулаг бүхий Улаан цутгалангийн хөндийгөөр урсах түргэн урсгалт усаар сэлэх сорилт.',
  },
  {
    id: 'gobi-4x4-expedition',
    title: 'Өмнөговь, Нэмэгтийн хавцлын 4x4 Off-Road',
    category: '4×4 Off-road',
    categoryKey: 'offroad',
    location: 'Өмнөговь аймаг',
    region: 'Говийн бүс',
    difficulty: 'Ахисан',
    season: '5 - 10 сар',
    image:
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
    description:
      'Замгүй уудам говь, үлэг гүрвэлийн олдворт улаан цав, хавцлуудаар туулах тусгай тээврийн экспедиц.',
  },
  {
    id: 'sky-resort-winter',
    title: 'Богд хан уулын өвлийн цана, сноуборд',
    category: 'Цана, snowboard',
    categoryKey: 'winter',
    location: 'Улаанбаатар хот',
    region: 'Төвийн бүс',
    difficulty: 'Бүх түвшин',
    season: '11 - 3 сар',
    image:
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=900&q=80',
    description:
      'Олон улсын стандартад нийцсэн цанын бааз, гэрэлтүүлэгтэй шөнийн гулгалт, өвлийн аялал.',
  },
  {
    id: 'khentii-hiking',
    title: 'Асралт Хайрхан уулын явган трек',
    category: 'Hiking, Trekking',
    categoryKey: 'hiking',
    location: 'Төв / Хэнтий аймаг',
    region: 'Төвийн бүс',
    difficulty: 'Хүндэвтэр',
    season: '6 - 9 сар',
    image:
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=900&q=80',
    description:
      'Хэнтийн нурууны ноён оргил (2799м) өөд хадархаг нуруугаар алхах 1-2 өдрийн хайкинг.',
  },
  {
    id: 'terelj-cycling',
    title: 'Туул голын хөндийн уулын дугуйн аялал',
    category: 'Дугуйн аялал',
    categoryKey: 'biking',
    location: 'Төв аймаг',
    region: 'Төвийн бүс',
    difficulty: 'Дунд',
    season: '5 - 9 сар',
    image:
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80',
    description:
      'Горхи Тэрэлжийн байгалийн цогцолборт газрын хөвөө замаар уулын дугуйгаар жийх адал явдал.',
  },
];
