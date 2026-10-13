import TopicSections from '@/components/section/TopicSections';
import AboutRelated from '@/components/templates/AboutRelated';

interface PeopleItem {
  title: string;
  desc: string;
  thumb: string;
  href?: string;
}

interface PeopleSection {
  id: string;
  // "Дэлгэрэнгүй" товч хаашаа заах (docs/plan/broken-links.md). Байхгүй бол товч харагдахгүй
  moreHref?: string;
  num: string;
  tag: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: PeopleItem[];
}

const PEOPLE_SECTIONS: PeopleSection[] = [
  {
    id: 'mongolians',
    num: '01',
    tag: 'Язгуур өв ба угсаатан',
    title: 'Монголчууд',
    desc: 'Эртний нүүдэлчин овог аймгуудаас эхтэй монгол туургатан нь эв нэгдэл, эрх чөлөө, байгаль дэлхийгээ дээдлэн хамгаалдаг өнө эртний оюун санааны баялаг өвтэй ард түмэн билээ.',
    imageUrl: '/hero.jpg',
    items: [
      {
        title: 'Язгуур угсаа',
        desc: 'Төв Азийн өндөрлөгт олон зуун жил нутаглаж, төрт ёсыг үндэслэсэн өвөг дээдсийн үр сад.',
        thumb: '',
      },
      {
        title: 'Зан чанарын онцлог',
        desc: 'Уужим ухаан, байгальтайгаа зохицох мэдрэмж, зочломтгой халуун дулаан зан төлөв.',
        thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
      },
      {
        title: 'Ахмадаа дээдлэх ёс',
        desc: 'Үг сургаалыг сонсож, ургийн уламжлалаа хүндэтгэн дагаж мөрддөг өвөрмөц ёс зүй.',
        thumb: '',
      },
    ],
  },
  {
    id: 'ethnic-groups',
    num: '02',
    tag: 'Олон янз соёлын өнгө',
    title: 'Угсаатны бүлгүүд',
    desc: 'Халх, буриад, баяд, дөрвөд, казак, захчин, урианхай зэрэг 20 гаруй ястан өөрсдийн аялгуу, өвөрмөц дээл хувцас, зан үйлээрээ Монгол түмний соёлыг баяжуулдаг.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    items: [
      {
        title: 'Баруун Монголын ястнууд',
        desc: 'Ойрад түмний өвөрмөц бүжиг, товшуур хөгжим, баатарлаг туульсийн их өв соёл.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
      {
        title: 'Буриад зоны өв',
        desc: 'Ёохор харайх бүжиг, уран хийцийн дээл хувцас, нандин гар урлалын гайхамшиг.',
        thumb: '',
      },
      {
        title: 'Казак түмний соёл',
        desc: 'Бүргэдээр ан хийх хосгүй эрдэм, гар хатгамал бүхий өнгөлөг эсгий гэр, ёс заншил.',
        thumb: 'https://images.unsplash.com/photo-1742205025290-f8d83fe1bb58?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'language-script',
    num: '03',
    tag: 'Оюуны тусгаар тогтнол',
    title: 'Монгол хэл ба Монгол бичиг',
    desc: 'Алтай язгуурын яруу тансаг монгол хэл болон тэнгэрээс газар луу нар зөв урсдаг босоо монгол бичиг нь хүн төрөлхтний соёлын үнэт эрдэнэ юм.',
    imageUrl: '',
    items: [
      {
        title: 'Босоо монгол бичиг',
        desc: 'Мянга гаруй жилийн түүхтэй, үсэг бүр нь тэнгэр, газар, хүний холбоосыг агуулсан бичиг.',
        thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
      },
      {
        title: 'Уран бичлэг (Каллиграфи)',
        desc: 'Бийр янтай нийлүүлэн сэтгэлийн эрч хүчийг цаасан дээр амилуулах дүрслэх урлаг.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
      {
        title: 'Аман зохиолын баялаг',
        desc: 'Ерөөл, магтаал, зүйр цэцэн үгээр дамжин үеэс үед уламжлагдсан үгийн их сан хөмрөг.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
    ],
  },
  {
    id: 'hospitality',
    moreHref: '/about/traditions#hospitality',
    num: '04',
    tag: 'Тал нутгийн соёл',
    title: 'Зочломтгой зан заншил',
    desc: 'Хээр талын аялагчийг танихгүй ч халуун цай, шүүс зоогоор дайлж үддэг, үүд хаалгаа хэзээд нээлттэй байлгадаг нүүдэлчдийн эрхэм ёсон.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200',
    items: [
      {
        title: 'Цай барих ёсон',
        desc: 'Гэрт орж ирсэн хүнд хамгийн түрүүнд сая чанасан сүүтэй цайгаа хоёр гардан барьдаг.',
        thumb: '',
      },
      {
        title: 'Хөөрөг зөрүүлэх',
        desc: 'Бие биеийн амар мэндийг лавлан, хөөргөө хүндэтгэлтэйгээр солилцон үнэрлэж мэндэлнэ.',
        thumb: '',
      },
      {
        title: 'Хүндэтгэлийн зоог',
        desc: 'Шүүс тавих, цагаан идээгээр дайлах, гийчнийг үдэх үеийн бэлэг дэмбэрлийн уламжлал.',
        thumb: '',
      },
    ],
  },
  {
    id: 'lifestyle',
    moreHref: '/about/nomadic-life',
    num: '05',
    tag: 'Ахуй амьдралын ухаан',
    title: 'Монгол хүний аж төрөхүй',
    desc: 'Нар мандахаас жаргах хүртэл байгаль эхтэйгээ хамт сэрж, дөрвөн улирлын байгалийн өөрчлөлтийг урьдчилан таньж амьдардаг амьдралын философи.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200',
    items: [
      {
        title: 'Од эрхэс шинжих ухаан',
        desc: 'Тэнгэрийн хаяа, оддын байрлал, салхины чигээр цаг агаарыг урьдчилан тааварладаг.',
        thumb: 'https://images.unsplash.com/photo-1535219241072-7d3c28a49a5c?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Эрүүл амьдралын хэв маяг',
        desc: 'Цэвэр агаар, байгалийн цэвэр хүнс, өдөр тутмын байнгын хөдөлгөөнтэй эрүүл амьдрал.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
      {
        title: 'Үр хүүхдээ хүмүүжүүлэх',
        desc: 'Мал ахуйд сургаж, хөдөлмөрч чанар, байгальд хайртай сэтгэлийг багаас нь суулгадаг.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
    ],
  },
];

export default function PeoplePage() {
  return (
    <div>
      <TopicSections sections={PEOPLE_SECTIONS} />
      <AboutRelated current="/about/people" embedded />
    </div>
  );
}
