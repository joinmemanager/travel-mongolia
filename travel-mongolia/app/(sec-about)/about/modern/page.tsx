import TopicSections from '@/components/section/TopicSections';
import AboutRelated from '@/components/templates/AboutRelated';

interface ModernItem {
  title: string;
  desc: string;
  thumb: string;
  href?: string;
}

interface ModernSection {
  id: string;
  // "Дэлгэрэнгүй" товч хаашаа заах (docs/plan/broken-links.md). Байхгүй бол товч харагдахгүй
  moreHref?: string;
  num: string;
  tag: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: ModernItem[];
}

const MODERN_SECTIONS: ModernSection[] = [
  {
    id: 'lifestyle',
    num: '01',
    tag: 'Орчин цагийн хэмнэл',
    title: 'Орчин үеийн Монголын амьдрал',
    desc: 'Уламжлалт нүүдлийн ахуй болон даяаршлын дижитал шийдлийг хослуулан хөгжүүлж буй шинэ үе, энтертайнмент соёл, эрч хүчтэй амьдралын өнгө төрх.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    items: [
      {
        title: 'Кофены соёл & Коворкинг',
        desc: 'Залуус чөлөөтэй сэтгэн ажиллах бүтээлч орчин, нийслэлийн эрч хүчтэй бизнес төвүүд.',
        thumb: '',
      },
      {
        title: 'Дижитал эрин үе',
        desc: 'Цахим банк, финтек, ухаалаг үйлчилгээ өндөр хөгжсөн бэлэн мөнгөгүй төлбөрийн хэв маяг.',
        thumb: '',
      },
      {
        title: 'Амралтын өдрүүдийн аялал',
        desc: 'Хотын залуус амралтын өдрөөр хөдөө гарч, байгальд аялан эрүүл эрч хүчээ сэлбэх соёл.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
    ],
  },
  {
    id: 'urban-rural',
    num: '02',
    tag: 'Хөгжил ба ялгарал',
    title: 'Хот ба хөдөөгийн амьдрал',
    desc: 'Шилэн цамхгууд сүндэрлэсэн нийслэл Улаанбаатар хот ба онгон зэлүүд байгальтайгаа зэрэгцэн орших уудам хөдөөгийн малчин ахуйн зохицол.',
    imageUrl: 'https://images.unsplash.com/photo-1707669904577-2ebc6f95a826?auto=format&fit=crop&w=1200&q=80',
    items: [
      {
        title: 'Нийслэл Улаанбаатар хот',
        href: '/province/ulaanbaatar',
        desc: 'Түүх соёл, орчин үеийн дэд бүтэц хосолсон Төв Азийн хамгийн өвөрмөц мегаполис хот.',
        thumb: '',
      },
      {
        title: 'Малчин өрхийн дэвшил',
        desc: 'Нарны дэлгэц, сансрын интернэт, мотоцикль ашигладаг орчин цагийн шинэ үеийн малчид.',
        thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
      },
      {
        title: 'Аймгийн төвүүд & Хөгжил',
        desc: 'Бүс нутгийн дэд бүтэц, авто замын сүлжээ болон аялал жуулчлалын төвүүдийн тэлэлт.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
    ],
  },
  {
    id: 'creative-arts',
    num: '03',
    tag: 'Бүтээлч үйлдвэрлэл',
    title: 'Орчин үеийн урлаг, дизайн',
    desc: 'Монгол өв соёлыг дэлхийн контемпорари урлагтай хослуулсан шинэ үеийн загвар зохион бүтээгчид, кино найруулагчид ба уран бүтээлчид.',
    imageUrl: '',
    items: [
      {
        title: 'Орчин үеийн Монгол загвар',
        desc: 'Үндэсний дээл, хээ угалзыг орчин үеийн өдөр тутмын загварт шингээсэн брэндүүд.',
        thumb: '',
      },
      {
        title: 'Контемпорари уран зураг',
        desc: 'Уламжлалт монгол зургийн арга барилыг модернизмтай холбосон олон улсын үзэсгэлэнгүүд.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
      {
        title: 'Кино & Театр',
        desc: 'Дэлхийн кино наадмуудад шагнал хүртэж буй бие даасан уран бүтээлчдийн бүтээлүүд.',
        thumb: '',
      },
    ],
  },
  {
    id: 'music',
    moreHref: '/things-to-do/festivals',
    num: '04',
    tag: 'Аялгуу эгшиг',
    title: 'Хөгжим & Фестивалиуд',
    desc: 'Морин хуур, хөөмийн язгуур эгшгийг метал роктой хослуулсан дэлхийн од хамтлагуудаас эхлээд олон улсын томоохон хөгжмийн наадмууд.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200',
    items: [
      {
        title: 'Хүннү Рок & Дэлхийн тавцан',
        desc: '"The Hu" зэрэг хамтлагууд язгуур урлагийг дэлхийн рок хөгжмийн тавцанд тунхаглаж байна.',
        thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
      },
      {
        title: 'Playtime Festival',
        desc: 'Төв Азийн хамгийн том амьд хөгжмийн фестивалиудын нэг бөгөөд дэлхийн олон орны залуусыг нэгтгэдэг.',
        thumb: '',
      },
      {
        title: 'Хип хоп & Электрон урсгал',
        desc: 'Хотын залуусын өдөр тутмын амьдрал, үзэл бодлыг илэрхийлсэн шинэ цагийн дуу хоолой.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
    ],
  },
  {
    id: 'youth-culture',
    num: '05',
    tag: 'Ирээдүйг бүтээгчид',
    title: 'Залуусын соёл & Спорт',
    desc: 'Олимп, тив дэлхийд амжилт гаргаж буй жүдо, чөлөөт бөх, цахим спортын тамирчид болон сайн дурын нэгдэл, стартап экосистем.',
    imageUrl: '',
    items: [
      {
        title: 'Цахим спорт (Esports)',
        desc: 'CS2, PUBG Mobile зэрэг спортын төрлөөр дэлхийн аваргын цомыг эх орондоо авчирсан залуус.',
        thumb: '',
      },
      {
        title: 'Олимп & Их спорт',
        desc: 'Жүдо, чөлөөт бөх, бокс болон 3х3 сагсан бөмбөгийн төрлөөр дэлхийд өрсөлдөж буй тамирчид.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
      {
        title: 'Стартап & Инноваци',
        desc: 'Дэлхийн зах зээлд өрсөлдөх зорилготой технологийн шинэ бизнес, залуу энтрепренерүүд.',
        thumb: '',
      },
    ],
  },
];

export default function ModernMongoliaPage() {
  return (
    <div>
      <TopicSections sections={MODERN_SECTIONS} />
      <AboutRelated current="/about/modern" embedded />
    </div>
  );
}
