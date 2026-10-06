'use client';

import CategoryDirectory, { DirectoryGroupSection } from '@/components/templates/CategoryDirectory';

interface PlaceCard {
  name: string;
  region: string;
  img: string;
}

interface LandscapeCategory {
  id: string;
  // "Дэлгэрэнгүй" товч хаашаа заах (docs/plan/broken-links.md). Байхгүй бол товч харагдахгүй
  moreHref?: string;
  title: string;
  count: string;
  places: PlaceCard[];
  remainingCount: number;
}

const LANDSCAPE_CATEGORIES: LandscapeCategory[] = [
  {
    id: 'mountains',
    moreHref: '/destination/map',
    title: 'Уул, нуруу',
    count: 'Нийт 40+ сүрлэг хайрхан',
    places: [
      {
        name: 'Алтай Таван Богд',
        region: 'Баян-Өлгий · Хүйтэн оргил 4,374 м',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000',
      },
      {
        name: 'Отгонтэнгэр хайрхан',
        region: 'Завхан · 4,008 м',
        img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1000',
      },
      {
        name: 'Мөнххайрхан уул',
        region: 'Ховд · 4,231 м',
        img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000',
      },
    ],
    remainingCount: 37,
  },
  {
    id: 'lakes',
    moreHref: '/destination/map',
    title: 'Нуур',
    count: 'Нийт 30+ үзэсгэлэнт нуур',
    places: [
      {
        name: 'Хөвсгөл нуур',
        region: 'Хөвсгөл · Дэлхийн цэнгэг сувд',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000',
      },
      {
        name: 'Увс нуур',
        region: 'Увс · Төв Азийн давст их далай',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
      },
      {
        name: 'Тэрхийн цагаан нуур',
        region: 'Архангай · Галт уулын нуур',
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000',
      },
    ],
    remainingCount: 27,
  },
  {
    id: 'rivers',
    moreHref: '/destination/map',
    title: 'Гол, мөрөн',
    count: 'Нийт 25+ гол мөрөн',
    places: [
      {
        name: 'Орхон гол',
        region: 'Архангай, Өвөрхангай · 1,124 км',
        img: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=1000',
      },
      {
        name: 'Сэлэнгэ мөрөн',
        region: 'Сэлэнгэ · Монголын хамгийн их устай мөрөн',
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000',
      },
      {
        name: 'Хэрлэн гол',
        region: 'Хэнтий, Дорнод · 1,254 км',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
      },
    ],
    remainingCount: 22,
  },
  {
    id: 'gobi',
    moreHref: '/destination/map',
    title: 'Говь, цөл',
    count: 'Нийт 20+ онцлох говийн нутаг',
    places: [
      {
        name: 'Баянзаг (Улаан хэрэм)',
        region: 'Өмнөговь · Үлэг гүрвэлийн өлгий',
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000',
      },
      {
        name: 'Нэмэгтийн хөндий',
        region: 'Өмнөговь · Үлэг гүрвэлийн оршуулга',
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000',
      },
      {
        name: 'Хэрмэн цав',
        region: 'Өмнөговь · Байгалийн сүрлэг цайз хавцал',
        img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000',
      },
    ],
    remainingCount: 17,
  },
  {
    id: 'sand-dunes',
    moreHref: '/destination/map',
    title: 'Элсэн манхан',
    count: 'Нийт 15+ их элс',
    places: [
      {
        name: 'Хонгорын элс',
        region: 'Өмнөговь · Дуут манхан 180 км',
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000',
      },
      {
        name: 'Элсэн тасархай',
        region: 'Булган, Төв · Их монгол элс',
        img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000',
      },
      {
        name: 'Бөөрөг дэлийн элс',
        region: 'Увс · Дэлхийн хамгийн урт манхан',
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000',
      },
    ],
    remainingCount: 12,
  },
  {
    id: 'canyons',
    moreHref: '/destination/map',
    title: 'Хавцал, хөндий',
    count: 'Нийт 25+ байгалийн хавцал',
    places: [
      {
        name: 'Ёлын амны хавцал',
        region: 'Өмнөговь · Зун ч мөстэй нарийн хавцал',
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000',
      },
      {
        name: 'Чулуутын голын хавцал',
        region: 'Архангай · 50 м өндөр базальт хана',
        img: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=1000',
      },
      {
        name: 'Дүнгэнээгийн хавцал',
        region: 'Өмнөговь · Баянборхойн хавцлын зам',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000',
      },
    ],
    remainingCount: 22,
  },
  {
    id: 'forest-taiga',
    moreHref: '/destination/map',
    title: 'Ой, тайга',
    count: 'Нийт 18+ онцлох ойн бүс',
    places: [
      {
        name: 'Хөвсгөлийн их тайга',
        region: 'Хөвсгөл · Цаатан түмний эх нутаг',
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000',
      },
      {
        name: 'Хэнтийн хөвч тайга',
        region: 'Хэнтий, Төв · Онон, Хэрлэнгийн эх',
        img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1000',
      },
      {
        name: 'Батхааны хушин ой',
        region: 'Төв аймаг · Хангай, талын зааг',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
      },
    ],
    remainingCount: 15,
  },
  {
    id: 'steppes',
    moreHref: '/destination/map',
    title: 'Тал хээр',
    count: 'Нийт 16+ уудам тал',
    places: [
      {
        name: 'Мэнэнгийн тал',
        region: 'Дорнод · Дэлхийн хамгийн том тал хээр',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
      },
      {
        name: 'Шаргын говийн тал',
        region: 'Говь-Алтай · Зээрийн их сүрэг',
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000',
      },
      {
        name: 'Дарьгангын тэгш өндөрлөг',
        region: 'Сүхбаатар · Галт уулын тогоот тал',
        img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000',
      },
    ],
    remainingCount: 13,
  },
  {
    id: 'glaciers',
    moreHref: '/destination/map',
    title: 'Мөсөн гол',
    count: 'Нийт 10+ мөнх цас, мөсөн гол',
    places: [
      {
        name: 'Потанины мөсөн гол',
        region: 'Баян-Өлгий · 19 км урт Монголын хамгийн том мөсөн гол',
        img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000',
      },
      {
        name: 'Александрын мөсөн гол',
        region: 'Баян-Өлгий · Алтай Таван Богд',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000',
      },
      {
        name: 'Гранигийн мөсөн гол',
        region: 'Баян-Өлгий · Сүрлэг мөсөн хавцал',
        img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1000',
      },
    ],
    remainingCount: 7,
  },
  {
    id: 'springs',
    moreHref: '/destination/map',
    title: 'Рашаан',
    count: 'Нийт 30+ эрдэст рашаан булаг',
    places: [
      {
        name: 'Шаргалжуутын халуун рашаан',
        region: 'Баянхонгор · 108 булагтай эмчилгээний төв',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000',
      },
      {
        name: 'Цэнхэрийн халуун рашаан',
        region: 'Архангай · 86°C байгалийн халуун ундарга',
        img: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=1000',
      },
      {
        name: 'Хужиртын рашаан',
        region: 'Өвөрхангай · Эртний алдарт эрдэст шавар',
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000',
      },
    ],
    remainingCount: 27,
  },
  {
    id: 'caves-geology',
    moreHref: '/destination/map',
    title: 'Агуй, геологийн тогтоц',
    count: 'Нийт 25+ байгалийн хосгүй бүтэц',
    places: [
      {
        name: 'Цагаан суварга',
        region: 'Дундговь · Эртний тэнгисийн аварга шавар цайз',
        img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000',
      },
      {
        name: 'Даян дээрхийн агуй',
        region: 'Хөвсгөл · Карстын шохойн чулуун том агуй',
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000',
      },
      {
        name: 'Хоргын галт уулын тогоо',
        region: 'Архангай · Унтарсан сүрлэг тогоо, лаавын агуйнууд',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
      },
    ],
    remainingCount: 22,
  },
];

export default function NaturalLandscapesPage() {
  return (
    <CategoryDirectory
      hero={{
        src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2400',
        alt: 'Байгалийн тогтоц, ландшафт',
      }}
      kicker="04. Natural Landscapes"
      title="Байгалийн тогтоц, ландшафтаар"
      intro="Монгол орны мөнх цаст уулс, говь хээр, цэнгэг нуурууд болон геологийн хосгүй 11 үндсэн тогтоц"
      nav={LANDSCAPE_CATEGORIES.map((sec) => ({ id: sec.id, label: sec.title }))}
    >
      {LANDSCAPE_CATEGORIES.map((sec) => (
        <DirectoryGroupSection
          key={sec.id}
          group={sec}
          moreCount="тогтоц"
          moreTitle="Бүх лавлах сан"
          moreDesc="Интерактив газрын зураг, байршил & дэлгэрэнгүй"
        />
      ))}
    </CategoryDirectory>
  );
}
