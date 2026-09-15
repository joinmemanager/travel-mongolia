export interface FoodSpot {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  location: string;
  region: string;
  specialty: string;
  image: string;
  description: string;
}

export const FOOD_CATEGORIES = [
  { id: 'all', label: 'Бүгд' },
  { id: 'national-dishes', label: 'Үндэсний зоог' },
  { id: 'dairy-products', label: 'Цагаан идээ' },
  { id: 'airag-fermentation', label: 'Айраг исгэлт' },
  { id: 'mongolian-tea', label: 'Монгол цай' },
  { id: 'regional-food', label: 'Орон нутгийн хоол' },
  { id: 'cooking-classes', label: 'Хоол хийх сургалт' },
  { id: 'tasting-tours', label: 'Амталгааны аялал' },
];

export const FOOD_SPOTS: FoodSpot[] = [
  {
    id: 'khorkhog-boodog-exp',
    title: 'Уламжлалт хорхог, боодог хийх ёслол',
    category: 'Үндэсний зоог',
    categoryKey: 'national-dishes',
    location: 'Төв аймаг / Хөдөө хээр',
    region: 'Төвийн бүс',
    specialty: 'Улайсгасан чулууны жигнүүр',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    description:
      'Голын улайсгасан чулуугаар төмөр саванд жигнэж болгосон шүүслэг, уламжлалт хүндэтгэлийн зоог.',
  },
  {
    id: 'mongolian-dairy-platter',
    title: 'Зуны цагаан идээний амталгаа ба соёл',
    category: 'Цагаан идээ',
    categoryKey: 'dairy-products',
    location: 'Архангай аймаг',
    region: 'Хангайн бүс',
    specialty: 'Өрөм, ааруул, ээзгий',
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80',
    description:
      'Сарлаг, үхрийн шинэ сүүгээр бэлтгэсэн шар тос, өрөм, ааруулын амталгаа бүхий танин мэдэхүйн хөтөлбөр.',
  },
  {
    id: 'bulgan-saikhan-airag',
    title: 'Хөхүүрийн шимийн айраг амтлах аялал',
    category: 'Айраг исгэлт',
    categoryKey: 'airag-fermentation',
    location: 'Булган аймаг, Сайхан сум',
    region: 'Хангайн бүс',
    specialty: 'Хөхүүрийн гүүний айраг',
    image:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80',
    description:
      'Монголын хамгийн алдартай Булганы Сайханы айргийг хөхүүрээс нь шууд аягалж, исгэх арга барилтай танилцах.',
  },
  {
    id: 'suutei-tsai-tradition',
    title: 'Борцтой, шар тостой уламжлалт монгол цай',
    category: 'Монгол цай',
    categoryKey: 'mongolian-tea',
    location: 'Улаанбаатар / Орон нутаг',
    region: 'Бүх бүс',
    specialty: 'Борцтой хийцтэй цай',
    image:
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    description:
      'Шар тос, арвайн гурил, борцоор сүлсэн эрч хүч сэргээх нүүдэлчдийн өтгөн хийцтэй цайны соёл.',
  },
  {
    id: 'buuz-dumpling-masterclass',
    title: 'Монгол бууз, хуушуур чимхэх мастеркласс',
    category: 'Хоол хийх сургалт',
    categoryKey: 'cooking-classes',
    location: 'Улаанбаатар хот',
    region: 'Төвийн бүс',
    specialty: 'Гар хийцийн бууз, хуушуур',
    image:
      'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=900&q=80',
    description:
      'Мах татах, гурил зуурах, олон янзын хээгээр бууз чимхэж сурах гадаад, дотоодын аялагчдад зориулсан сургалт.',
  },
  {
    id: 'ub-nomadic-food-tour',
    title: 'Улаанбаатарын үндэсний хоолны аялал',
    category: 'Амталгааны аялал',
    categoryKey: 'tasting-tours',
    location: 'Улаанбаатар хот',
    region: 'Төвийн бүс',
    specialty: 'Орчин үеийн ба уламжлалт фьюшн',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
    description:
      'Эртний уламжлалт болон орчин үеийн монгол үндэсний ресторануудаар зочилж, шилдэг амтуудыг нэг дороос турших.',
  },
];
