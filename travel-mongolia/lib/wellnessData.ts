export interface WellnessSpot {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  location: string;
  region: string;
  feature: string;
  image: string;
  description: string;
}

export const WELLNESS_CATEGORIES = [
  { id: 'all', label: 'Бүгд' },
  { id: 'meditation-yoga', label: 'Бясалгал & Иог' },
  { id: 'hot-springs', label: 'Халуун рашаан' },
  { id: 'wellness-retreat', label: 'Wellness retreat' },
  { id: 'buddhist-exp', label: 'Буддын туршлага' },
  { id: 'shamanism', label: 'Бөө мөргөлийн соёл' },
  { id: 'sacred-sites', label: 'Тахилгат газрууд' },
  { id: 'digital-detox', label: 'Digital detox' },
];

export const WELLNESS_SPOTS: WellnessSpot[] = [
  {
    id: 'tuvkhun-meditation',
    title: 'Төвхөн хийдийн бясалгал, аглаг бүтээл',
    category: 'Буддын туршлага',
    categoryKey: 'buddhist-exp',
    location: 'Өвөрхангай / Архангай зааг',
    region: 'Хангайн бүс',
    feature: 'Сүнслэг анир чимээгүй',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
    description: 'Өндөр гэгээн Занабазарын бясалгаж, Соёмбо үсгийг зохиосон өндөр хадан хясаан дээрх сүнслэг дагшин орон.',
  },
  {
    id: 'tsenher-hot-spring',
    title: 'Цэнхэрийн халуун рашааны спа ретрит',
    category: 'Халуун рашаан',
    categoryKey: 'hot-springs',
    location: 'Архангай аймаг, Цэнхэр сум',
    region: 'Хангайн бүс',
    feature: '+86°C байгалийн эрдэст рашаан',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80',
    description: 'Ой модон дундах байгалийн халуун рашаанд орж алжаал тайлах, эрүүл мэндээ нөхөн сэргээх спа амралт.',
  },
  {
    id: 'khamar-monastery-energy',
    title: 'Хамарын хийд ба Дэлхийн энергийн төв',
    category: 'Тахилгат газрууд',
    categoryKey: 'sacred-sites',
    location: 'Дорноговь аймаг, Сайншанд',
    region: 'Говийн бүс',
    feature: 'Шамбалын орон ба энергийн төв',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
    description: 'Ноён хутагт Данзанравжаагийн байгуулсан Шамбалын орон, хүсэл биелүүлэгч тахилгат хайрхан, дотоод хүчээ сэлбэх орон зай.',
  },
  {
    id: 'terelj-yoga-nature',
    title: 'Тэрэлжийн байгалийн иог & бясалгалын кемп',
    category: 'Бясалгал & Иог',
    categoryKey: 'meditation-yoga',
    location: 'Төв аймаг, Горхи Тэрэлж',
    region: 'Төвийн бүс',
    feature: 'Нар мандах үеийн иог',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
    description: 'Өглөөний цэнгэг агаарт уулын бэлд иог хийж, оюун санаагаа цэгцлэн бие бялдраа сэргээх хөтөлбөр.',
  },
  {
    id: 'khuvsgul-shamanic-culture',
    title: 'Хөвсгөлийн тайгын бөө мөргөлийн соёлтой танилцах',
    category: 'Бөө мөргөлийн соёл',
    categoryKey: 'shamanism',
    location: 'Хөвсгөл аймаг, Дархадын хотгор',
    region: 'Хангайн бүс',
    feature: 'Эртний язгуур бөө мөргөл',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    description: 'Байгальтайгаа хүйн холбоотой дархад, цаатан удган зарингуудын зан үйл, эртний тахилгатай танилцах хүндэтгэлийн туршлага.',
  },
  {
    id: 'gobi-digital-detox',
    title: 'Уудам говийн сүлжээгүй дижитал детокс амралт',
    category: 'Digital detox',
    categoryKey: 'digital-detox',
    location: 'Өмнөговь аймаг',
    region: 'Говийн бүс',
    feature: 'Сүлжээгүй амар амгалан',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80',
    description: 'Интернэт, утасны сүлжээнээс бүрэн тасарч, одот тэнгэр, элсэн манхан дунд жинхэнэ нам гүмийг мэдрэх өвөрмөц амралт.',
  },
];