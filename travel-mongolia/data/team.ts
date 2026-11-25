// «Бидний тухай» (/about-us) хуудасны хүмүүс: гүйцэтгэх баг (6), уран бүтээлчдийн баг (4).
// Текстийг эзэмшигчийн өгсөн хувилбараар үг үсгийг өөрчлөхгүй оруулсан (2026-11-25). Утасны дугаар оруулахгүй.
//
// Хэл: mn нь сайтад гарна. en-ийг одоогоор хадгалж байгаа (main дээр англи route байхгүй, Google Translate
// орчуулдаг); Payload-ийн шилжилтэд localized талбарын en утга болно.
//
// Зураг: public/images/team/<нэр>.jpg (1:1 тайрсан). Файл байхгүй/ачаалагдахгүй бол нэрийн эхний үсэг гарна
// (components/about/TeamGrid.tsx).
//
// 12-р сард Payload-ийн `team` collection руу шилжинэ (docs/plan/payload-report.md, feat/payload). Хуудас зөвхөн
// getTeam()-ээр уншдаг тул шилжихэд энэ функцийг Payload-ийн хүсэлтээр солиход л хангалттай.

export type TeamGroup = 'executive' | 'creative';

export interface Localized {
  mn: string;
  en: string;
}

export interface TeamMember {
  id: string;
  name: Localized;
  group: TeamGroup;
  role: Localized;
  bio: Localized;
  email?: string;
  // Зургийн зам (public/ доторх) эсвэл URL. Байхгүй бол нэрийн эхний үсэгтэй дугуй.
  photo?: string;
  order: number;
}

export const TEAM_GROUPS: { group: TeamGroup; title: Localized }[] = [
  { group: 'executive', title: { mn: 'Гүйцэтгэх баг', en: 'Executive Team' } },
  { group: 'creative', title: { mn: 'Уран бүтээлчдийн баг', en: 'Creative Team' } },
];

const photo = (file: string) => `/images/team/${file}`;

export const TEAM: TeamMember[] = [
  // === Гүйцэтгэх баг ===
  {
    id: 'tsomorlig',
    group: 'executive',
    order: 1,
    name: { mn: 'Э. Цоморлиг', en: 'E. Tsomorlig' },
    role: { mn: 'Төслийн санаачлагч, удирдагч', en: 'Project Founder and Lead' },
    bio: {
      mn: 'Аялал жуулчлалын салбарт 20 гаруй жилийн туршлагатай. Тогтвортой аялал жуулчлал, дижитал шилжилт, контент хөгжүүлэлтийн чиглэлээр ажилладаг.',
      en: 'Brings more than 20 years of experience in the tourism sector, working on sustainable tourism, digital transformation and content development.',
    },
    photo: photo('tsomorlig.jpg'),
  },
  {
    id: 'sarantsatsral',
    group: 'executive',
    order: 2,
    name: { mn: 'Б. Саранцацрал', en: 'B. Sarantsatsral' },
    role: { mn: 'Төслийн зохицуулагч', en: 'Project Coordinator' },
    bio: {
      mn: 'Сэтгүүл зүй, маркетингийн салбарт 15 жилийн туршлагатай. Төслийн үндсэн үйл ажиллагааг дэмжиж, зохион байгуулдаг.',
      en: "Brings 15 years of experience in journalism and marketing, and organises and supports the project's core activities.",
    },
    photo: photo('sarantsatsral.jpg'),
  },
  {
    id: 'otgontugs',
    group: 'executive',
    order: 3,
    name: { mn: 'Х. Отгонтөгс', en: 'Kh. Otgontugs' },
    role: { mn: 'Төслийн менежер', en: 'Project Manager' },
    // TODO: түр текст
    bio: {
      mn: 'Төслийн төлөвлөгөө, хугацаа, гүйцэтгэлийг хариуцаж, ажлууд цагтаа, чанартай хэрэгжихэд хяналт тавьдаг.',
      en: 'Responsible for the project plan, timeline and delivery, making sure work is completed on time and to a high standard.',
    },
    photo: photo('otgontugs.jpg'),
  },
  {
    id: 'tsatsalmaa',
    group: 'executive',
    order: 4,
    name: { mn: 'Э. Цацалмаа', en: 'E. Tsatsalmaa' },
    role: { mn: 'Ложистикийн менежер', en: 'Logistics Manager' },
    // TODO: түр текст
    bio: {
      mn: 'Аялал, зураг авалтын ажлын тээвэр, байр, хангамжийн зохион байгуулалтыг хариуцаж, багийн хээрийн ажлыг саадгүй явуулахад дэмжлэг үзүүлдэг.',
      en: "Handles transport, accommodation and supplies for trips and film shoots, keeping the team's fieldwork running smoothly.",
    },
    photo: photo('tsatsalmaa.jpg'),
  },
  {
    id: 'urangoo',
    group: 'executive',
    order: 5,
    name: { mn: 'М. Урангоо', en: 'M. Urangoo' },
    role: { mn: 'Бүтээлч үйл ажиллагааны менежер', en: 'Creative Manager' },
    // TODO: түр текст
    bio: {
      mn: 'Сайтын контент, видео, зургийн бүтээлч чиглэлийг тодорхойлж, уран бүтээлчдийн багтай хамтран ажилладаг.',
      en: "Sets the creative direction for the site's content, video and photography, working closely with the creative team.",
    },
    photo: photo('urangoo.jpg'),
  },
  {
    id: 'michidmaa',
    group: 'executive',
    order: 6,
    name: { mn: 'Д. Мичидмаа', en: 'D. Michidmaa' },
    role: { mn: 'Төслийн нарийн бичиг', en: 'Project Secretary' },
    // TODO: түр текст
    bio: {
      mn: 'Төслийн баримт бичиг, хурал, харилцаа холбоог хариуцаж, багийн өдөр тутмын ажлыг дэмждэг.',
      en: "Handles the project's documentation, meetings and communications, supporting the team's day-to-day work.",
    },
    photo: photo('michidmaa.jpg'),
  },

  // === Уран бүтээлчдийн баг ===
  {
    id: 'tumenjargal',
    group: 'creative',
    order: 1,
    name: { mn: 'Д. Түмэнжаргал', en: 'D. Tumenjargal' },
    role: {
      mn: 'Уран бүтээлчдийн багийн ахлагч · Зураглаач, продюсер',
      en: 'Creative Team Lead · Cinematographer, Producer',
    },
    bio: {
      mn: '2005 оноос хойш зураглаач, найруулагчаар ажиллаж байгаа, Кино урлагийн дээд сургуулийг зураглаач мэргэжлээр төгссөн. NTV, ECO телевизэд олон жил ажилласан. Японы NHK телевизийн баримтат кинонууд, «Монгол Майк» баримтат цуврал, «Risk It All: Bodons» зэрэг төслийн зураглаачаар ажилласан. Зураглаачдын «Алмаз» наадмын шилдэг зураглаач (2013), Монгол Улсын соёлын тэргүүний ажилтан (2022).',
      en: 'A cinematographer and director since 2005, with a bachelor\'s degree in cinematography from the University of Film Art. He spent many years at NTV and ECO TV, and has shot documentaries for Japan\'s NHK, the documentary series "Mongol Mike" and "Risk It All: Bodons." Best Cinematographer at the "Almaz" cinematographers\' festival (2013); Honoured Cultural Worker of Mongolia (2022).',
    },
    email: 'tumeehd84@gmail.com',
    photo: photo('tumenjargal.jpg'),
  },
  {
    id: 'javkhlan',
    group: 'creative',
    order: 2,
    name: { mn: 'Д. Жавхлан', en: 'D. Javkhlan' },
    role: { mn: 'Зураглаач, эвлүүлэгч', en: 'Cinematographer, Editor' },
    bio: {
      mn: 'Кино урлагийн дээд сургуулийг зураглаач мэргэжлээр төгссөн. EDU телевиз, Хүлэгү пикчерс, Imax студид ажилласан. «Яг түүн шиг», «Mongolian Next Top Model» зэрэг телевизийн шоу, «Торгоны маань хээ», «Өмнөдийн зорих замд» уран сайхны кино, «Risk It All» баримтат цувралын зураглаачаар ажилласан. Монгол Улсын соёлын тэргүүний ажилтан (2022).',
      en: 'A graduate in cinematography from the University of Film Art, he has worked at EDU TV, Khulegu Pictures and Imax Studio. He was director of photography on TV shows such as "Yag Tuun Shig" and "Mongolian Next Top Model," the feature films "Torgony Maani Khee" and "Omnodiin Zorikh Zamd," and the documentary series "Risk It All." Honoured Cultural Worker of Mongolia (2022).',
    },
    email: 'Javha0915@gmail.com',
    photo: photo('javkhlan.jpg'),
  },
  {
    id: 'buuveibaatar',
    group: 'creative',
    order: 3,
    name: { mn: 'Ц. Бүүвэйбаатар', en: 'Ts. Buuveibaatar' },
    role: { mn: 'Эвлүүлгийн найруулагч, график дизайнер', en: 'Film Editor, Graphic Designer' },
    bio: {
      mn: '2007 оноос хойш эвлүүлэгчээр ажиллаж байгаа, Цахим дээд сургуулийг график дизайнер мэргэжлээр төгссөн. Эх Орон ТВ, Боловсрол суваг, Эко ТВ-д ажилласан. «Зөн билгийн тулаан» шоуны 1–8-р улирал, «Яг түүн шиг» шоу, «Даши Намдаков» баримтат киноны эвлүүлгийг хийсэн. Хэвлэл мэдээллийн тэргүүний ажилтан (2015).',
      en: 'A film editor since 2007, with a bachelor\'s degree in graphic design from the Digital Institute. He has worked at Ekh Oron TV, the Education Channel and Eco TV, and edited eight seasons of "Zon Bilgiin Tulaan," the show "Yag Tuun Shig" and the documentary "Dashi Namdakov." Honoured Media Worker (2015).',
    },
    email: 'buubei3@gmail.com',
    photo: photo('buuveibaatar.jpg'),
  },
  {
    id: 'bilguun',
    group: 'creative',
    order: 4,
    name: { mn: 'Ч. Билгүүн', en: 'Ch. Bilguun' },
    role: { mn: 'Найруулагч, продюсер, эвлүүлгийн найруулагч', en: 'Director, Producer, Editor' },
    bio: {
      mn: '1998 оноос хойш хэвлэл мэдээллийн салбарт ажиллаж байгаа. Хятадын хэвлэл мэдээллийн их сургуулийн магистр. NTV, EDU телевиз, Хүлэгү пикчерст найруулагч, продюсерээр ажилласан. «Болжмор» баримтат кино нь Japan Prize наадамд ЮНИСЕФ-ийн шилдэг баримтат киногоор (2009), «Зуд» нь Hong Kong Independent Film and Video Awards-д шилдэг баримтат киногоор (2011) шалгарсан. Discovery Channel-ийн «Here is Guizhou» цуврал, The HU хамтлагийн «Sad but True» клип, «Slow Boat to China» баримтат кинон дээр ажилласан. Англи, хятад, орос хэлтэй. Монгол Улсын соёлын тэргүүний ажилтан (2015).',
      en: 'In media since 1998, with a master\'s degree from the Communication University of China. He has worked as a director and producer at NTV, EDU TV and Khulegu Pictures. His documentary "Boljmor" won the UNICEF prize at the Japan Prize (2009), and "Zud" was named best documentary at the Hong Kong Independent Film and Video Awards (2011). He also worked on Discovery Channel\'s "Here is Guizhou," The HU\'s "Sad but True" music video and the feature documentary "Slow Boat to China." Speaks English, Chinese and Russian. Honoured Cultural Worker of Mongolia (2015).',
    },
    email: 'bilguunbek@hotmail.com',
    // Эх зураг 222×222: аватар ≤112px (2x дэлгэцэнд 224px) тул сунгагдахгүй
    photo: photo('bilguun.jpg'),
  },
];

export function getTeam(group: TeamGroup): TeamMember[] {
  return TEAM.filter((m) => m.group === group).sort((a, b) => a.order - b.order);
}
