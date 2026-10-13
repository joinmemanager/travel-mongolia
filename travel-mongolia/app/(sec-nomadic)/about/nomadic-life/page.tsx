import TopicSections from '@/components/section/TopicSections';
import AboutRelated from '@/components/templates/AboutRelated';

interface SubItem {
  title: string;
  desc: string;
  thumb: string;
  href?: string;
}

interface NomadicSection {
  id: string;
  // "Дэлгэрэнгүй" товч хаашаа заах (docs/plan/broken-links.md). Байхгүй бол товч харагдахгүй
  moreHref?: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: SubItem[];
}

const NOMADIC_SECTIONS: NomadicSection[] = [
  {
    id: 'ger',
    moreHref: '/things-to-do/nomadic?cat=ger-stay',
    title: 'Монгол гэр',
    desc: 'Нүүдэлчдийн олон зуун жилийн ахуй амьдралын ухааны охь болсон, байгалийн эрс тэс уур амьсгалд төгс зохицсон, угсарч буулгахад хялбар сууц.',
    imageUrl: 'https://images.unsplash.com/photo-1575415868394-e3b78f3e9b3f?auto=format&fit=crop&w=1200&q=80',
    items: [
      {
        title: 'Бүтэц ба эд анги',
        desc: 'Тооно, багана, унь, хана, хаалга зэргээс бүрдэх бөгөөд нэг ч хадаасгүйгээр тэмээний үр, сураар бэхлэгддэг.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
      {
        title: 'Орон зайн бэлгэдэл',
        desc: 'Хоймор, баруун эрэгтэй тал, зүүн эмэгтэй тал гэсэн нарийн дэг эрэмбэтэй бөгөөд тооноор нарны цагийг баримталдаг.',
        thumb: '',
      },
      {
        title: 'Эсгий бүрээс',
        desc: 'Хонины цэвэр ноосоор хийсэн эсгий нь өвөл дулаан, зун сэрүүн байлгах байгалийн төгс дулаалга болдог.',
        thumb: 'https://images.unsplash.com/photo-1575415868394-e3b78f3e9b3f?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'five-animals',
    moreHref: '/things-to-do/nomadic?cat=herding',
    title: 'Таван хошуу мал',
    desc: 'Адуу, үхэр, тэмээ, хонь, ямаа буюу монгол түмний амин зуулга, өмсөх хувцас, идэх хүнс, уналга хөсгийн эх үүсвэр болсон таван эрдэнэ.',
    imageUrl: 'https://images.unsplash.com/photo-1707669904577-2ebc6f95a826?auto=format&fit=crop&w=1200&q=80',
    items: [
      {
        title: 'Адуу ба Тэмээ',
        desc: 'Тал нутгийн хурдан хүлэг адуу хийгээд говь цөлийн хөлөг, хоёр бөхт тэмээн сүрэг.',
        thumb: 'https://images.unsplash.com/photo-1571821807771-62cf66ac3f14?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Үхэр & Сарлаг',
        desc: 'Хангайн сүрлэг сарлаг болон шимт сүү, ачлага уналгын гол тулгуур болсон үхэр сүрэг.',
        thumb: '',
      },
      {
        title: 'Хонь ба Ямаа',
        desc: 'Өөх тос, махны хэрэгцээг хангагч хонь болон дэлхийд гайхагддаг ноолуурын баялаг болсон ямаа.',
        thumb: 'https://images.unsplash.com/photo-1707669904577-2ebc6f95a826?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'four-seasons',
    moreHref: '/things-to-do/nomadic?cat=migration',
    title: 'Дөрвөн улирлын нүүдэл',
    desc: 'Бэлчээрийн соргог, усны тунгалгийг даган хаваржаа, зуслан, намаржаа, өвөлжөөний хооронд жил бүр нүүдэллэн амьдрах эко ухаан.',
    imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=1200',
    items: [
      {
        title: 'Өвөлжөө & Хаваржаа',
        desc: 'Нөмөр нөөлөг, энгэр газар мал сүргээ хүйтнээс хамгаалан суурьших өвлийн болон төлийн байршил.',
        thumb: 'https://images.unsplash.com/photo-1707669904577-2ebc6f95a826?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Зуслан & Намаржаа',
        desc: 'Салхины сэвшээ бүхий голын хөндий, шимтэй бэлчээрт малыг таргалуулж, өвлийн бэлтгэл базаах үе.',
        thumb: 'https://images.unsplash.com/photo-1707669904577-2ebc6f95a826?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Ачаа хөсөг & Нүүдэл',
        desc: 'Гэрээ буулган тэмээ, үхэр тэргэнд ачиж, шинэ нутаг руу цуваа болон хөдлөх эртний их аян.',
        thumb: 'https://images.unsplash.com/photo-1707669904577-2ebc6f95a826?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'herding',
    moreHref: '/things-to-do/nomadic?cat=herding',
    title: 'Мал маллах ухаан',
    desc: 'Байгаль дэлхий, цаг агаарын шинж байдал, од эрхэсээр цаг уурыг шинжиж мал сүргээ төллүүлэх, хариулах үе уламжилсан арга барил.',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
    items: [
      {
        title: 'Цаг агаар шинжих',
        desc: 'Мал амьтны зан авир, нар жаргах тэнгэрийн хаяа, салхины чигээр цасан болон шороон шуургыг урьдчилан таах ухаан.',
        thumb: '',
      },
      {
        title: 'Ургац, бэлчээр сонгох',
        desc: 'Таана, хөмүүл, хужир мараа бүхий газрыг нарийн тогтоон малын ашиг шимийг нэмэгдүүлнэ.',
        thumb: 'https://images.unsplash.com/photo-1707669904577-2ebc6f95a826?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Мал төллөлт',
        desc: 'Хаврын хатуу цагт шинэ төлийг дулаан байлгаж, эхэд нь эсэн мэнд дасган хөл дээр нь босгох нарийн арчилгаа.',
        thumb: '',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Ахуйн багаж, хэрэгсэл',
    desc: 'Уурга, хуйцаа, ногт, хазаар, эмээл, хазаараас эхлээд өдөр тутмын амьдралд хэрэглэгддэг шир, модон уламжлалт хэрэгслүүд.',
    imageUrl: '',
    items: [
      {
        title: 'Уурга & Хуйцаа',
        desc: 'Урт нарийн хус модоор хийсэн уурга, хуйцаагаар адуу малыг хээр талд гарамгай уургалах эрийн ур чадвар.',
        thumb: 'https://images.unsplash.com/photo-1630326867210-bf4b2cdd2019?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Монгол эмээл, хазаар',
        desc: 'Модон суурьтай, мөнгөн тоноглол бүхий уналгад бат бөх, морины нурууг хамгаалсан хийц.',
        thumb: '',
      },
      {
        title: 'Сур, ширэн тоног',
        desc: 'Үхрийн ширийг элдэн хийсэн сур, цулбуур, ногт нь байгальд ээлтэй, тасрахгүй бат бөх байдаг.',
        thumb: '',
      },
    ],
  },
  {
    id: 'eco-culture',
    moreHref: '/respect/nature#tradition',
    title: 'Байгаль хамгаалах уламжлал',
    desc: 'Ус, булаг шанд руу сүү, цус дусаахгүй байх, газар шороог сэндийлэхгүй байх зэрэг нүүдэлчдийн байгальтайгаа зохицсон ариун ёс.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    items: [
      {
        title: 'Усаа дээдлэх цээр',
        desc: 'Урсгал ус, гол горхины ундаргыг булингартуулах, бохир оруулахыг хатуу цээрлэж хайрладаг.',
        thumb: '',
      },
      {
        title: 'Уул овоо тахих',
        desc: 'Байгалийн савдаг, хангай дэлхийгээ баясгаж амьтан, ургамлыг хамгаалах сэтгэлийн их шүтлэг.',
        thumb: '',
      },
      {
        title: 'Хөрс хамгаалах ёс',
        desc: 'Газрын хөрсийг дэмий ухаж сэндийлэхийг цээрлэн, ургамлын үндсийг таслалгүй байгалийг онгон байдлаар нь хадгална.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
    ],
  },
  {
    id: 'games',
    title: 'Монгол ардын тоглоом наадам',
    desc: 'Шагай хамах, морь уралдуулах, алаг мэлхий өрөх, оньсон тоглоом зэрэг оюун ухаан, авхаалж самбаа сорьсон өв соёл.',
    imageUrl: '',
    items: [
      {
        title: 'Шагайн наадгай',
        desc: 'Хонины шагайгаар морь уралдуулах, шагай няслах, шүүрэх зэрэг малын хэлбэр дүрсийг ашигласан тоглоом.',
        thumb: '',
      },
      {
        title: 'Оньсон тоглоом',
        desc: 'Модыг хадаас цавуугүйгээр хооронд нь түгжин угсардаг орон зайн сэтгэлгээ хөгжүүлэх ухаан.',
        thumb: '',
      },
      {
        title: 'Алаг мэлхий өрөх',
        desc: 'Цагаан сарын шинийн нэгэнд шагайгаар мэлхийн эрхтнүүдийг өрж, шоо хаяж нааддаг уламжлалт зан үйл.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
    ],
  },
];

export default function NomadicLifePage() {
  return (
    <div>
      <TopicSections sections={NOMADIC_SECTIONS} />
      <AboutRelated current="/about/nomadic-life" embedded />
    </div>
  );
}
