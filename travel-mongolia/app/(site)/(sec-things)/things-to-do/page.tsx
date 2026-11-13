import ImageCard from '@/components/design/ImageCard';
import { IMAGES, type SiteImage } from '@/lib/images';
import { liveHref } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import { getSection, sectionRows } from '@/lib/sections';

// «Үзэх, хийх зүйлс» хэсгийн Тойм (docs/plan/section-layout.md, эзэмшигчийн шийдвэр 2026-10-12):
// дэд сэдэв бүрийн карт. Нэр, хаяг нь lib/navigation.ts-ээс, тайлбар нь тухайн хуудасны оршил.
export const metadata = metaFor('/things-to-do');

// Зураг: Монголынх нь шалгагдсан зургуудаас (docs/plan/images.md). Тохирохгүй бол зураггүй карт.
const TOPICS: Record<string, { desc: string; image?: SiteImage }> = {
  '/things-to-do/nature': {
    desc: 'Хязгааргүй үргэлжлэх уудам тал нутаг, онгон дагшин тайга, сүрлэг Алтайн оргилууд болон Тэнгэрийн заадлыг тольдох элсэн манхнууд.',
    image: IMAGES.lakeGers,
  },
  '/things-to-do/adventure': {
    desc: 'Онгон дагшин уулсаар трек хийх, уудам тал нутгаар морьтой аялах, говийн элсэн манхнаар 4x4 туулах адал явдлууд.',
    image: IMAGES.whiteHorse,
  },
  '/things-to-do/culture': {
    desc: 'Эзэнт гүрний түүхэн дурсгалууд, эртний буддын хийдүүд, ЮНЕСКО-ийн дэлхийн өв болон уламжлалт урлагийн туршлагууд.',
    image: IMAGES.chinggisStatue,
  },
  '/things-to-do/food': {
    desc: 'Нүүдэлчдийн мах, сүүн идээ, уламжлалт хорхог, шимийн айраг болон нутаг нутгийн давтагдашгүй амтыг мэдрэх аяллууд.',
  },
  '/things-to-do/nomadic': {
    desc: 'Мянган жилийн нүүдэлчин ахуй соёл, малчин түмний зочломтгой зан, эсгий гэрийн амьдралыг биеэр мэдрэх аяллууд.',
    image: IMAGES.herdSnow,
  },
  '/things-to-do/wellness': {
    desc: 'Эртний энергийн төвүүд, байгалийн халуун рашаан, хийдүүдийн бясалгал болон уудам нутаг дахь дижитал детокс.',
    image: IMAGES.gerStars,
  },
  '/things-to-do/wildlife': {
    desc: 'Нэн ховордсон тахь, цоохор ирвэс, говийн мазаалай баавгай болон нүүдлийн шувуудын өлгий нутаг.',
    image: IMAGES.eagleHunter,
  },
  '/inspiration/styles': {
    desc: 'Адал явдал, гэр бүл, тансаг амралт, эко аялал: өөрт тохирох аяллын хэв маягаа сонгоорой.',
    image: IMAGES.gerCamp,
  },
};

export default function ThingsToDoPage() {
  // Тойм мөрөөс бусад дэд сэдвүүд (production дээр нийтлэгдээгүйг SectionLayout-тай адил нууна)
  const topics = sectionRows(getSection('things')).slice(1).filter((t) => liveHref(t.href));

  return (
    <div>
      <p className="mb-10 max-w-3xl text-base sm:text-lg text-neutral-600 leading-relaxed">
        Монгол бол уудам тал, говь, тайга, Алтайн оргилуудын орон. Байгальд аялах, адал явдал, түүх соёл,
        нүүдэлчин ахуй, хоол, амралт, зэрлэг амьтан ажиглах гээд сонирхолдоо тохирох сэдвээ сонгоорой.
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <li key={topic.href}>
            <ImageCard
              href={topic.href}
              image={TOPICS[topic.href]?.image}
              title={topic.label}
              desc={TOPICS[topic.href]?.desc}
              cta="Дэлгэрэнгүй"
              ctaButton
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
