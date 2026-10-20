import TopicSections from '@/components/section/TopicSections';
import AboutRelated from '@/components/templates/AboutRelated';
import { metaFor } from '@/lib/pageMeta';

export const metadata = metaFor('/about/nature');

interface NatureItem {
  title: string;
  desc: string;
  thumb: string;
  href?: string;
}

interface NatureSection {
  id: string;
  // "Дэлгэрэнгүй" товч хаашаа заах (docs/plan/broken-links.md). Байхгүй бол товч харагдахгүй
  moreHref?: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: NatureItem[];
}

const NATURE_SECTIONS: NatureSection[] = [
  {
    id: 'geography',
    moreHref: '/destination/region',
    title: 'Монгол орны газарзүй',
    desc: 'Далайд гарцгүй, далайн түвшнээс дунджаар 1,580 метр өндөрт орших 1.5 сая хавтгай дөрвөлжин километр уудам нутаг.',
    imageUrl: '',
    items: [
      {
        title: 'Байршил & Хил хязгаар',
        desc: 'ОХУ болон БНХАУ-тай хиллэдэг, дэлхийн 18 дахь том газар нутагтай улс.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
      {
        title: 'Туйлын цэгүүд',
        desc: 'Хамгийн өндөр цэг Хүйтэн оргил (4,374 м), хамгийн нам дор цэг Хөх нуурын хотгор (560 м).',
        thumb: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=600',
      },
      {
        title: 'Байгалийн бүс бүслүүр',
        desc: 'Мөнх цаст уулс, хөвч тайгаас эхлээд тал хээр, өргөн уудам говь цөл хосолсон орон зай.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
    ],
  },
  {
    id: 'climate',
    moreHref: '/inspiration/seasons',
    title: 'Уур амьсгал',
    desc: 'Жилд дунджаар 250 гаруй цэлмэг өдөртэй тул “Мөнх хөх тэнгэрийн орон” хэмээн алдаршсан дөрвөн улирлын ялгаралтай бүс.',
    imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=1400',
    items: [
      {
        title: 'Температурын далайц',
        desc: 'Өвөл -40°C хүйтэрч, зун +40°C халдаг эх газрын эрс тэс уур амьсгалын онцлог.',
        thumb: '',
      },
      {
        title: 'Дөрвөн улирал',
        href: '/inspiration/seasons',
        desc: 'Урин хавар, дэлгэр зун, алтан намар, өвлийн өнтэй цаг гэсэн тод мөчлөгт амьдрал.',
        thumb: '',
      },
      {
        title: 'Нарлаг өдрүүд',
        desc: 'Хөх тэнгэр, тунгалаг хуурай агаар, жилийн ихэнх өдөр гэрэлтэх нарны илч.',
        thumb: '',
      },
    ],
  },
  {
    id: 'gobi',
    moreHref: '/destination/landscapes#gobi',
    title: 'Говь',
    desc: 'Хонгорын элс, Баянзаг, Хэрмэн цав зэрэг байгалийн уран баримал болсон элсэн манхан, заган ой бүхий дэлхийд ховор говь.',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1400',
    items: [
      {
        title: 'Хонгорын элс',
        desc: '180 км урт үргэлжлэх дуут манхан, салхины аясаар хөгжим мэт эгшиглэдэг элсэн далай.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
      {
        title: 'Баянзаг & Улаан хавцал',
        desc: 'Дэлхийд анх үлэг гүрвэлийн өндөг олдсон галын өнгөт алдарт улаан цав.',
        thumb: 'https://images.unsplash.com/photo-1537212429608-6b5f5449cdf8?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Говийн баянбүрдүүд',
        desc: 'Хүйтэн булаг, тоорой мод, хулсан шугуй бүхий элсэн дундах байгалийн амьдралын арал.',
        thumb: 'https://images.unsplash.com/photo-1571821807771-62cf66ac3f14?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'steppe',
    moreHref: '/destination/landscapes#steppes',
    title: 'Тал хээр',
    desc: 'Нүд алдам үргэлжлэх Дорнодын уудам тал нутаг, нүүдэлчин амьдралын өлгий болсон хялганат ногоон далай.',
    imageUrl: 'https://images.unsplash.com/photo-1630326867210-bf4b2cdd2019?auto=format&fit=crop&w=1200&q=80',
    items: [
      {
        title: 'Дорнодын тал',
        desc: 'Дэлхийн хамгийн сүүлчийн онгон дагшин хялганат хээр талын асар том экосистем.',
        thumb: '',
      },
      {
        title: 'Цагаан зээрийн сүрэг',
        desc: 'Зуун зуун мянгаараа сүрэглэн цахилах нүүдлийн амьдралтай хээрийн гайхамшиг.',
        thumb: '',
      },
      {
        title: 'Шилийн Богд & Ганга нуур',
        desc: 'Дарьгангын галт уулс, хунгийн чуулган хурах талын үзэсгэлэнт уул ус.',
        thumb: 'https://images.unsplash.com/photo-1591804860948-cdb450a32b77?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'mountains',
    moreHref: '/destination/landscapes#mountains',
    title: 'Уулс',
    desc: 'Монгол Алтай, Хангай, Хэнтийн нуруудын өндөр сүрлэг оргилууд, мөсөн голууд болон хад хавцлын гайхамшиг.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400',
    items: [
      {
        title: 'Алтай Таван Богд',
        desc: 'Мөнх цаст 5 сүрлэг оргил болон Монголын хамгийн урт Потанины мөсөн гол.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
      {
        title: 'Отгонтэнгэр хайрхан',
        desc: 'Хангайн нурууны ноён оргил, төрийн тахилгат Очирваань бурхны орон.',
        thumb: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=600',
      },
      {
        title: 'Бурхан Халдун хайрхан',
        desc: 'Чингис хааны өлгий нутаг, ЮНЕСКО-гийн соёлын өвд бүртгэгдсэн ариун шүтээн уул.',
        thumb: '',
      },
    ],
  },
  {
    id: 'taiga',
    moreHref: '/destination/landscapes#forest-taiga',
    title: 'Ой, тайга',
    desc: 'Хөвсгөл, Хэнтийн хөвч тайга, хар мод, хуш моддын анхилуун үнэр, цаатнуудын нутагладаг онгон зэрлэг байгаль.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1400',
    items: [
      {
        title: 'Хөвсгөлийн хөвч тайга',
        desc: 'Монголын цаатан иргэд болон цаа бугын сүргийн төрөлх онгон бүс нутаг.',
        thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600',
      },
      {
        title: 'Шинэс ба хушин ой',
        desc: 'Монголын ойн сангийн 80 хувийг бүрдүүлдэг Сибирийн хар мод болон самар үржилт хуш.',
        thumb: '',
      },
      {
        title: 'Тайгын экосистем',
        desc: 'Халиун буга, хандгай, баавгай, булга, хүдэр зэрэг ан амьтдын амин тулгуур.',
        thumb: '',
      },
    ],
  },
  {
    id: 'lakes-rivers',
    moreHref: '/destination/landscapes#lakes',
    title: 'Гол, нуур',
    desc: 'Дэлхийн цэнгэг усны 1 хувийг агуулдаг “Далай ээж” Хөвсгөл нуураас эхлээд Хойд мөсөн далай, Номхон далайн ай савын голууд.',
    imageUrl: 'https://images.unsplash.com/photo-1591804860948-cdb450a32b77?auto=format&fit=crop&w=1200&q=80',
    items: [
      {
        title: 'Хөвсгөл нуур',
        href: '/destination/khuvsgul-nuur',
        desc: 'Азийн хамгийн цэнгэг нууруудын нэг, 2 сая гаруй жилийн настай эртний цэнхэр сувд.',
        thumb: 'https://images.unsplash.com/photo-1591804860948-cdb450a32b77?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Сэлэнгэ, Орхон, Хэрлэн',
        desc: 'Монголын түүхийг тэтгэж ирсэн хамгийн урт, ус ихтэй гол мөрний ай савууд.',
        thumb: '',
      },
      {
        title: 'Увс нуурын хотгор',
        desc: 'Давстай их нуур, ЮНЕСКО-гийн дэлхийн байгалийн өвд бүртгэгдсэн шувуудын чуулган.',
        thumb: 'https://images.unsplash.com/photo-1591804860948-cdb450a32b77?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'flora',
    title: 'Ургамлын аймаг',
    desc: '3,000 гаруй зүйлийн дээд ургамал, үүнээс 800 гаруй нь уламжлалт анагаах ухаанд хэрэглэгддэг шимт ургамлууд.',
    imageUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1400',
    items: [
      {
        title: 'Цөлийн ба талын ургамал',
        desc: 'Таана, хөмүүл, хазаар өвс, шаваг зэрэг малын тарга хүчийг тэтгэдэг шимт ногоо.',
        thumb: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=600',
      },
      {
        title: 'Эмийн ургамлууд',
        desc: 'Вансэмбэрүү, алтан гагнуур, чацаргана, цөлийн аргамжин цэцэг зэрэг ховор ургамал.',
        thumb: '',
      },
      {
        title: 'Эндемик ургамал',
        desc: 'Зөвхөн Монголын говь, хангайд ургадаг дэлхийд өөр хаана ч байхгүй ургамлын аймгууд.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
    ],
  },
  {
    id: 'wildlife',
    moreHref: '/things-to-do/wildlife',
    title: 'Зэрлэг амьтад',
    desc: 'Дэлхийд цор ганц говийн мазаалай баавгай, цоохор ирвэс, тахь адуу, хавтгай тэмээний өлгий нутаг.',
    imageUrl: '',
    items: [
      {
        title: 'Мазаалай баавгай',
        desc: 'Дэлхийд ердөө 50 хүрэхгүй толгой үлдсэн говийн эрс тэс уур амьсгалд дасан зохицсон амьтан.',
        thumb: '',
      },
      {
        title: 'Цоохор ирвэс & Тахь',
        desc: 'Өндөр уулын эзэн цоохор ирвэс болон байгальд нь эргүүлэн нутагшуулсан зэрлэг адуу Тахь.',
        thumb: '',
      },
      {
        title: 'Хавтгай & Хулан',
        desc: 'Зэрлэг хоёр бөхт тэмээ Хавтгай, тал говийн түргэн хөлт хулан зэрэг ховор амьтад.',
        thumb: '',
      },
    ],
  },
  {
    id: 'geology',
    moreHref: '/destination/landscapes#caves-geology',
    title: 'Геологи',
    desc: 'Төв Азийн нугачаа үүссэн эртний үеийн чулуулаг, унтарсан галт уулс, халуун рашаан ба эрдэс баялгийн их уурхай.',
    imageUrl: '',
    items: [
      {
        title: 'Унтарсан галт уулс',
        desc: 'Хоргын тогоо, Дарьгангын галт уулс, лаавын урсацаас тогтсон байгалийн өвөрмөц тогтоц.',
        thumb: '',
      },
      {
        title: 'Байгалийн халуун рашаанууд',
        desc: 'Цэнхэрийн рашаан, Шаргалжуут зэрэг газрын гүнээс оргилон гарах эрдэст эмчилгээний ус.',
        thumb: '',
      },
      {
        title: 'Эрдэс баялгийн бүсүүд',
        desc: 'Зэс, нүүрс, алт, ховор элементүүдээр дэлхийд дээгүүрт тооцогдох геологийн сан.',
        thumb: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=600',
      },
    ],
  },
  {
    id: 'paleontology',
    title: 'Палеонтологи, үлэг гүрвэл',
    desc: 'Дэлхийн үлэг гүрвэлийн судалгааны эх орон. Тарбозавр, Зауролоф, Протоцератопсын бүрэн хэлхээ яс олдсон газар.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1400',
    items: [
      {
        title: 'Тарбозавр Батаар',
        desc: 'Ази тивд амьдарч байсан махан идэшт хамгийн хүчирхэг аварга үлэг гүрвэл.',
        thumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600',
      },
      {
        title: 'Үлэг гүрвэлийн өндөг',
        desc: '1923 онд Рой Чепмен Эндрюсийн экспедиц хүн төрөлхтний түүхэнд анх удаа чулуужсан өндөг олсон түүх.',
        thumb: 'https://images.unsplash.com/photo-1537212429608-6b5f5449cdf8?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Хэрмэн цав & Нэмэгтийн хөндий',
        desc: 'Дэлхийн хамгийн том палеонтологийн ил музей хэмээгддэг олдворт улаан хавцлууд.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
    ],
  },
];

export default function NaturePage() {
  return (
    <div>
      <TopicSections sections={NATURE_SECTIONS} />
      <AboutRelated current="/about/nature" embedded />
    </div>
  );
}
