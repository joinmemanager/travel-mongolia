'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import { Language, useLanguage } from './LanguageContext';

interface ProvinceData {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  images: string[];
  svgPoint: { x: number; y: number };
}

const PROVINCES: ProvinceData[] = [
  // 1. БАРУУН БҮС
  {
    id: 'bayan-olgii',
    name: {
      mn: 'Баян-Өлгий аймаг',
      en: 'Bayan-Ulgii',
      ru: 'Баян-Улгий',
      zh: '巴彦乌列盖省',
      ja: 'バヤン・ウルギー県',
      ko: '바얀울기',
    },
    description: {
      mn: 'Монгол орны дээвэр Алтай Таван Богд, сүрлэг мөсөн голууд, казах түмний бүргэдээр ан хийх өв соёл.',
      en: 'Altai Tavan Bogd peaks, vast glaciers, and traditional eagle hunting culture.',
      ru: 'Массив Алтай Таван Богд, ледники и вековая охота с беркутами.',
      zh: '阿尔泰塔弯博格多雪山、雄伟冰川以及金雕狩猎文化。',
      ja: 'アルタイ・タワン・ボグド山脈、氷河、鷹匠文化。',
      ko: '알타이 타반 복드 산맥, 거대한 빙하, 독수리 사냥 문화.',
    },
    images: ['/bayn-ulgii1.png'],
    svgPoint: { x: 100, y: 175 },
  },
  {
    id: 'uvs',
    name: {
      mn: 'Увс аймаг',
      en: 'Uvs',
      ru: 'Увс',
      zh: '乌布苏省',
      ja: 'オブス県',
      ko: '옵스',
    },
    description: {
      mn: 'ЮНЕСКО-ийн өвд бүртгэгдсэн давст Увс нуур, Хархираа Түргэний уулс, Бөөрөг Дэл элсэн манхан.',
      en: 'UNESCO Heritage Uvs Lake Basin, snow peaks, and majestic dunes.',
      ru: 'Соленое озеро Увс Нуур, вершины Хархираа и песчаные барханы.',
      zh: '联合国教科文组织世界遗产乌布苏湖与壮阔沙丘。',
      ja: '世界遺産ウヴス・ヌール湖と雄大な砂丘群。',
      ko: '유네스코 세계유산 오브스 누르 호수와 광활한 모래 언덕.',
    },
    images: ['/uvs1.png'],
    svgPoint: { x: 215, y: 145 },
  },
  {
    id: 'khovd',
    name: {
      mn: 'Ховд аймаг',
      en: 'Khovd',
      ru: 'Ховд',
      zh: '科布多省',
      ja: 'ホブド県',
      ko: '홉드',
    },
    description: {
      mn: 'Олон ястны өлгий нутаг, Хар-Ус нуур, Цамбагарав хайрхан, хөөмийн өлгий.',
      en: 'Home of diverse ethnic groups, Khar-Us Lake, and throat singing.',
      ru: 'Многонациональный край, озеро Хар-Ус и горловое пение.',
      zh: '多民族摇篮、黑水湖与呼麦故乡。',
      ja: '多様な民族の故郷、ハル・ウス湖、ホーミー発祥の地。',
      ko: '다양한 민족의 고향, 하르우스 호수와 후미 창법.',
    },
    images: ['/hovd1.png'],
    svgPoint: { x: 175, y: 245 },
  },
  {
    id: 'zavkhan',
    name: {
      mn: 'Завхан аймаг',
      en: 'Zavkhan',
      ru: 'Завхан',
      zh: '扎布汗省',
      ja: 'ザブハン県',
      ko: '자브항',
    },
    description: {
      mn: 'Отгонтэнгэр хайрхан, Мухартын гол, Улаагчны хар нуурын гайхамшигт байгалийн тогтоц.',
      en: 'Otgon Tenger peak, Mukhart River, and Ulaagchinii Khar Lake.',
      ru: 'Священная гора Отгонтенгер и первозданное озеро Улаагчны Хар.',
      zh: '鄂特冈腾格日峰、木哈尔特河与乌拉格琴黑湖。',
      ja: 'オトゴンテンゲル山、ムハルト川、ウラーグチーン・ハル湖。',
      ko: '오트공 텡게르 봉우리와 울락치니 하르 호수.',
    },
    images: ['/zavhan1.png'],
    svgPoint: { x: 305, y: 185 },
  },
  {
    id: 'govi-altai',
    name: {
      mn: 'Говь-Алтай аймаг',
      en: 'Govi-Altai',
      ru: 'Говь-Алтай',
      zh: '戈壁阿尔泰省',
      ja: 'ゴビ・アルタイ県',
      ko: '고비알타이',
    },
    description: {
      mn: 'Алтайн сүрлэг нуруу ба говь хосолсон нутаг, Ээж хайрхан уул, мазаалайн өлгий.',
      en: 'Where Altai ranges meet the Gobi, home to the Gobi bear Mazaalai.',
      ru: 'Место встречи Алтая и Гоби, родина медведя мазаалая.',
      zh: '阿尔泰山脉与戈壁交汇地，戈壁熊的栖息地。',
      ja: 'アルタイ山脈とゴビ砂漠が交わる地、ゴビヒグマの生息地。',
      ko: '알타이 산맥과 고비가 만나는 곳, 고비곰의 고향.',
    },
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 285, y: 310 },
  },

  // 2. ХАНГАЙ БА ХОЙД БҮС
  {
    id: 'hovsgol',
    name: {
      mn: 'Хөвсгөл аймаг',
      en: 'Khuvsgul',
      ru: 'Хубсугул',
      zh: '库苏古尔省',
      ja: 'フブスグル県',
      ko: '홉스골',
    },
    description: {
      mn: 'Цэнхэр сувд Хөвсгөл далай, тайгын цаатан ардын ахуй амьдрал, Дархадын хотгор.',
      en: 'Lake Khuvsgul, taiga wilderness, and nomadic reindeer herders.',
      ru: 'Синяя жемчужина Хубсугул, тайга и быт оленеводов.',
      zh: '库苏古尔湖、泰加森林与驯鹿部落。',
      ja: 'フブスグル湖、タイガの森、トナカイ遊牧民。',
      ko: '홉스골 호수와 타이가 숲, 순록 유목민의 삶.',
    },
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 415, y: 115 },
  },
  {
    id: 'arkhangai',
    name: {
      mn: 'Архангай аймаг',
      en: 'Arkhangai',
      ru: 'Архангай',
      zh: '后杭爱省',
      ja: 'アルハンガイ県',
      ko: '아르항가이',
    },
    description: {
      mn: 'Тэрхийн Цагаан нуур, Хоргын тогоо галт уул, Тамирын хөндийн рашаанууд.',
      en: 'Terkhiin Tsagaan Lake, Khorgo volcano, and natural hot springs.',
      ru: 'Озеро Тэрхийн Цагаан, вулкан Хорго и горячие источники.',
      zh: '特尔金白湖、霍尔戈火山与天然温泉。',
      ja: 'テルヒーン・ツァガーン湖、ホルゴ火山、温泉地帯。',
      ko: '테르힝 차강 호수, 호르고 화산, 천연 온천.',
    },
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 440, y: 215 },
  },
  {
    id: 'bulgan',
    name: {
      mn: 'Булган аймаг',
      en: 'Bulgan',
      ru: 'Булган',
      zh: '布尔干省',
      ja: 'ボルガン県',
      ko: '불강',
    },
    description: {
      mn: 'Уран тогоо унтарсан галт уул, айргийн өлгий Сайхан сум, ногоон ой хөвч.',
      en: 'Uran Togoo extinct volcano and home of legendary airag (kumis).',
      ru: 'Потухший вулкан Уран тогоо и знаменитый кумыс.',
      zh: '乌兰托果休眠火山与传统马奶酒故乡。',
      ja: 'ウラン・トゴー休火山と馬乳酒の産地。',
      ko: '우랑 토고 휴화산과 아이락의 고향.',
    },
    images: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 505, y: 165 },
  },
  {
    id: 'orkhon',
    name: {
      mn: 'Орхон аймаг',
      en: 'Orkhon',
      ru: 'Орхон',
      zh: '鄂尔浑省',
      ja: 'オルホン県',
      ko: '오르홍',
    },
    description: {
      mn: 'Монгол улсын аж үйлдвэрийн төв, цэвэрхэн тохилог Эрдэнэт хот.',
      en: 'Erdenet industrial hub and peaceful modern city life.',
      ru: 'Промышленный центр Монголии — город Эрдэнэт.',
      zh: '工业枢纽城市额尔登特。',
      ja: 'モンゴル第二の工業都市エルデネット。',
      ko: '몽골의 산업 중심지 에르데네트 시.',
    },
    images: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 520, y: 150 },
  },
  {
    id: 'selenge',
    name: {
      mn: 'Сэлэнгэ аймаг',
      en: 'Selenge',
      ru: 'Сэлэнгэ',
      zh: '色楞格省',
      ja: 'セレンゲ県',
      ko: '셀렝게',
    },
    description: {
      mn: 'Сэлэнгэ мөрний сав газар, Амарбаясгалант хийд, үржил шимт тариалангийн хөндий.',
      en: 'Selenge River basin, Amarbayasgalant Monastery, and fertile valleys.',
      ru: 'Бассейн реки Селенга и монастырь Амарбаясгалант.',
      zh: '色楞格河流域与阿玛尔巴亚斯嘎朗特修道院。',
      ja: 'セレンゲ川流域とアマルバヤスパラント寺院。',
      ko: '셀렝게 강 유역과 아마르바야스갈란트 사원.',
    },
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 575, y: 115 },
  },
  {
    id: 'darkhan-uul',
    name: {
      mn: 'Дархан-Уул аймаг',
      en: 'Darkhan-Uul',
      ru: 'Дархан-Уул',
      zh: '达尔汗乌拉省',
      ja: 'ダルハン・オール県',
      ko: '다르항올',
    },
    description: {
      mn: 'Залуусын хот Дархан, бүтээн байгуулалтын уудам төв.',
      en: 'The city of youth, modern architecture, and scenic hills.',
      ru: 'Город молодежи Дархан и культурные памятники.',
      zh: '达尔汗市——青年之城与工业基地。',
      ja: 'ダルハン市、若者の街と美しいモニュメント。',
      ko: '청춘의 도시 다르항과 현대적인 기념비.',
    },
    images: [
      'https://images.unsplash.com/photo-1578922746465-3a80a228f223?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 565, y: 135 },
  },

  // 3. ТӨВИЙН БҮС
  {
    id: 'ulaanbaatar',
    name: {
      mn: 'Улаанбаатар хот',
      en: 'Ulaanbaatar',
      ru: 'Улан-Батор',
      zh: '乌兰巴托',
      ja: 'ウランバートル',
      ko: '울란바토르',
    },
    description: {
      mn: 'Орчин үе ба нүүдлийн соёл хосолсон нийслэл хот, Чингисийн талбай, Гандан хийд.',
      en: 'Capital city where modern life blends with nomadic heritage.',
      ru: 'Столица Монголии: современный ритм и кочевые традиции.',
      zh: '传统与现代交相辉映的首都乌兰巴托。',
      ja: '伝統と現代が息づくモンゴルの首都。',
      ko: '전통과 현대가 공존하는 몽골의 수도.',
    },
    images: ['/ulaanbaatar.png'],
    svgPoint: { x: 595, y: 195 },
  },
  {
    id: 'tuv',
    name: {
      mn: 'Төв аймаг',
      en: 'Tuv',
      ru: 'Төв',
      zh: '中央省',
      ja: 'トゥブ県',
      ko: '티브',
    },
    description: {
      mn: 'Чингис хааны морьт хөшөө, Тэрэлж байгалийн цогцолбор газар, Хустайн нуруу.',
      en: 'Genghis Khan equestrian statue, Terelj Park, and wild takhi horses in Khustai.',
      ru: 'Конная статуя Чингисхана, парк Тэрэлж и дикие лошади тахи.',
      zh: '成吉思汗骑马巨像、特日勒吉公园与哈斯台国家公园。',
      ja: 'チンギスハーン騎馬像、テレルジ国立公園、野生馬タヒ。',
      ko: '칭기즈칸 기마상, 테를지 국립공원, 야생마 타키의 서식지.',
    },
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 585, y: 225 },
  },
  {
    id: 'uvurkhangai',
    name: {
      mn: 'Өвөрхангай аймаг',
      en: 'Uvurkhangai',
      ru: 'Уверхангай',
      zh: '前杭爱省',
      ja: 'ウブルハンガイ県',
      ko: '우부르항가이',
    },
    description: {
      mn: 'Эртний нийслэл Хархорум, Эрдэнэзуу хийд, Улаан цутгалан хүрхрээ.',
      en: 'Ancient capital Kharkhorin, Erdene Zuu, and Orkhon Waterfall.',
      ru: 'Древний Каракорум, монастырь Эрдэнэ-Зуу и водопад Орхон.',
      zh: '古都哈拉和林、额尔德尼召修道院与红色瀑布。',
      ja: '古都カラコルム、エルデネ・ゾー、オルホン滝。',
      ko: '고도 하르호린, 에르데네 주 사원, 오르홍 폭포.',
    },
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 470, y: 275 },
  },

  // 4. ГОВИЙН БҮС
  {
    id: 'bayankhongor',
    name: {
      mn: 'Баянхонгор аймаг',
      en: 'Bayankhongor',
      ru: 'Баянхонгор',
      zh: '巴彦洪戈尔省',
      ja: 'バヤンホンゴル県',
      ko: '바얀홍고르',
    },
    description: {
      mn: 'Шаргалжуутын 108 халуун рашаан, Их Богд уул, Цагаан агуй.',
      en: 'Shargaljuut hot springs, Ikh Bogd Mountain, and prehistoric caves.',
      ru: '108 горячих источников Шаргалжуут и пещера Цагаан агуй.',
      zh: '夏日勒珠特温泉与伊赫博格多山。',
      ja: 'シャルガルジュート温泉とツァガーン洞窟。',
      ko: '샤르갈주트 천연 온천과 이흐 복드 산.',
    },
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 385, y: 295 },
  },
  {
    id: 'dundgovi',
    name: {
      mn: 'Дундговь аймаг',
      en: 'Dundgovi',
      ru: 'Дундговь',
      zh: '中戈壁省',
      ja: 'ドンドゴビ県',
      ko: '둔드고비',
    },
    description: {
      mn: 'Их, Бага газрын чулууны өвөрмөц тогтоц, уртын дууны өлгий нутаг.',
      en: 'Granite formations of Ikh and Baga Gazriin Chuluu.',
      ru: 'Гранитные скалы Их и Бага Газрын Чулуу.',
      zh: '大、小地石花岗岩奇石景观。',
      ja: 'イフ・ガズリーン・チョローの花崗岩群。',
      ko: '이흐, 바가 가즈링 촐로의 기암괴석 군락지.',
    },
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 575, y: 285 },
  },
  {
    id: 'omnogovi',
    name: {
      mn: 'Өмнөговь аймаг',
      en: 'Umnugovi',
      ru: 'Южное Гоби',
      zh: '南戈壁省',
      ja: '南ゴビ県',
      ko: '옴노고비',
    },
    description: {
      mn: 'Хонгорын элсэн манхан, Баянзаг үлэг гүрвэлийн нутаг, Ёлын ам хавцал.',
      en: 'Khongor singing dunes, Bayanzag flaming cliffs, and Yol Valley.',
      ru: 'Пески Хонгорын Элс, Баянзаг и ущелье Ёлын Ам.',
      zh: '洪戈林鸣沙、巴彦扎格与尤林安峡谷。',
      ja: 'ホンゴル砂丘、バヤンザグ、ヨリーン・アム。',
      ko: '홍고린 엘스 사구, 바얀작, 욜린 암 협곡.',
    },
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 495, y: 375 },
  },
  {
    id: 'dornogovi',
    name: {
      mn: 'Дорноговь аймаг',
      en: 'Dornogovi',
      ru: 'Восточное Гоби',
      zh: '东戈壁省',
      ja: '東ゴビ県',
      ko: '도르노고비',
    },
    description: {
      mn: 'Хамарын хийд, Дэлхийн энергийн төв Шамбал, Ханбаянзүрх хайрхан.',
      en: 'Khamar Monastery, Shambhala energy center, and sacred mountains.',
      ru: 'Монастырь Хамарын хийд и энергетический центр Шамбала.',
      zh: '哈玛尔寺与香巴拉能量中心。',
      ja: 'ハマリーン寺院とシャンバラ・エネルギーセンター。',
      ko: '하마린 사원과 샴발라 에너지 센터.',
    },
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 675, y: 325 },
  },
  {
    id: 'govisumber',
    name: {
      mn: 'Говьсүмбэр аймаг',
      en: 'Govisumber',
      ru: 'Говьсумбэр',
      zh: '戈壁苏木贝尔省',
      ja: 'ゴビスムベル県',
      ko: '고비스음베르',
    },
    description: {
      mn: 'Чойрын богд уул, далангийн боржин хад, төмөр замын дагуух говийн гарц.',
      en: 'Choir Bogd Mountain, scenic cliffs, and gateway along the Trans-Mongolian rail.',
      ru: 'Гора Чойрын Богд и ворота в степной Гоби.',
      zh: '乔伊尔博格多山与草原铁路枢纽。',
      ja: 'チョイル・ボグド山と鉄道の結節点。',
      ko: '초이르 복드 산과 몽골 종단 철도의 길목.',
    },
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 635, y: 250 },
  },

  // 5. ЗҮҮН БҮС
  {
    id: 'khentii',
    name: {
      mn: 'Хэнтий аймаг',
      en: 'Khentii',
      ru: 'Хэнтий',
      zh: '肯特省',
      ja: 'ヘンティー県',
      ko: '헹티',
    },
    description: {
      mn: 'Чингис хааны мэндэлсэн Дэлүүн болдог, Бурхан Халдун хайрхан.',
      en: 'Birthplace of Genghis Khan, Deluun Boldog, and Burkhan Khaldun.',
      ru: 'Родина Чингисхана, Дэлюн-Болдок и гора Бурхан-Халдун.',
      zh: '成吉思汗诞生地迭里温孛勒达克与不儿罕合勒敦山。',
      ja: 'チンギスハーン生誕の地と世界遺産ブルハン・カルドゥン山。',
      ko: '칭기즈칸 탄생지 델룬 볼독과 부르한 할둔 산.',
    },
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 695, y: 185 },
  },
  {
    id: 'sukhbaatar',
    name: {
      mn: 'Сүхбаатар аймаг',
      en: 'Sukhbaatar',
      ru: 'Сүхбаатар',
      zh: '苏赫巴托尔省',
      ja: 'スフバートル県',
      ko: '수흐바타르',
    },
    description: {
      mn: 'Шилийн Богд хайрхан, Талын агуй, Ганга нуур, хунгийн чуулган.',
      en: 'Shiliin Bogd volcano, Taliin Cave, and Ganga Lake swan sanctuary.',
      ru: 'Гора Шилийн Богд, Талын агуй и лебединое озеро Ганга.',
      zh: '西林博格多山与天鹅栖息的冈嘎湖。',
      ja: 'シリーン・ボグド山と白鳥が集うガンガ湖。',
      ko: '실링 복드 화산, 탈링 동굴, 백조의 호수 강가 누르.',
    },
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 775, y: 265 },
  },
  {
    id: 'dornod',
    name: {
      mn: 'Дорнод аймаг',
      en: 'Dornod',
      ru: 'Дорнод',
      zh: '东方省',
      ja: 'ドルノド県',
      ko: '도르노드',
    },
    description: {
      mn: 'Уудам цэлийх Мэнэнгийн тал, Буйр нуур, зээрийн сүрэг бэлчсэн уудам нутаг.',
      en: 'Boundless Menen Steppe, Buir Lake, and grazing gazelle herds.',
      ru: 'Бескрайняя степь Мэнэн, озеро Буйр и стада антилоп.',
      zh: '辽阔的门嫩大草原与贝尔湖。',
      ja: '果てしないメネン草原とブイル湖。',
      ko: '광활한 메넹 평원과 부이르 호수.',
    },
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop',
    ],
    svgPoint: { x: 835, y: 175 },
  },
];

export default function RegionMap() {
  const { locale, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeProvince = PROVINCES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? PROVINCES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === PROVINCES.length - 1 ? 0 : prev + 1));
  };

  const localizedName = activeProvince.name[locale] || activeProvince.name.mn;
  const localizedDesc =
    activeProvince.description[locale] || activeProvince.description.mn;

  // Текстийн уртад тохируулан шошгоны өргөнийг хангалттай урт тооцно
  const badgeWidth = Math.max(160, localizedName.length * 15 + 40);

  return (
    <section
      id="places"
      className="overflow-hidden py-24 bg-[#f8f9fa] border-t border-gray-200"
    >
      <div className="px-6 mx-auto max-w-7xl sm:px-10 lg:px-16">
        <div className="mb-12">
          <span className="block mb-2 text-xs font-semibold tracking-[0.2em] text-[#15803d] uppercase">
            {t.heroTag}
          </span>
          <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-5xl">
            {t.mapTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-12">
          {/* ЗҮҮН ТАЛ */}
          <div className="flex overflow-hidden relative flex-col justify-between text-white bg-neutral-900 rounded-3xl shadow-2xl lg:col-span-5">
            <div className="relative w-full h-64 bg-black sm:h-72">
              {activeProvince.images.length === 1 ? (
                <Image
                  src={activeProvince.images[0]}
                  alt={localizedName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-all duration-500"
                />
              ) : (
                <div className="grid grid-cols-2 gap-1 p-1 w-full h-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={activeProvince.images[0]}
                      alt={localizedName}
                      fill
                      sizes="25vw"
                      className="object-cover rounded-l-2xl transition-all duration-500"
                    />
                  </div>
                  <div className="relative w-full h-full">
                    <Image
                      src={activeProvince.images[1]}
                      alt={localizedName}
                      fill
                      sizes="25vw"
                      className="object-cover rounded-r-2xl transition-all duration-500"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handlePrev}
                aria-label="Өмнөх"
                className="flex absolute top-1/2 left-4 z-10 justify-center items-center w-10 h-10 text-white bg-black/60 hover:bg-[#15803d] rounded-full shadow-lg backdrop-blur-sm transition-all -translate-y-1/2 cursor-pointer"
              >
                ‹
              </button>
              <button
                onClick={handleNext}
                aria-label="Дараах"
                className="flex absolute top-1/2 right-4 z-10 justify-center items-center w-10 h-10 text-white bg-black/60 hover:bg-[#15803d] rounded-full shadow-lg backdrop-blur-sm transition-all -translate-y-1/2 cursor-pointer"
              >
                ›
              </button>
            </div>

            <div className="p-8">
              <h3 className="mt-2 mb-4 font-sans text-3xl font-bold tracking-normal sm:text-4xl">
                {localizedName}
              </h3>
              <p className="min-h-[72px] text-sm leading-relaxed text-neutral-300 sm:text-base">
                {localizedDesc}
              </p>

              <div className="mt-4">
                <Link
                  href={`/province/${PROVINCES[currentIndex].id}`}
                  className="inline-flex gap-1.5 items-center text-sm font-semibold text-[#15803d] hover:text-red-400 transition-colors"
                >
                  <span>Дэлгэрэнгүй үзэх</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="flex justify-between items-center pt-4 mt-6 text-xs text-neutral-400 border-t border-neutral-800">
                <span className="font-semibold text-neutral-300">
                  {currentIndex + 1 < 10
                    ? `0${currentIndex + 1}`
                    : currentIndex + 1}{' '}
                  / {PROVINCES.length}
                </span>
                <span className="text-neutral-500">21 аймаг</span>
              </div>
            </div>
          </div>

          {/* БАРУУН ТАЛ */}
          <div className="flex flex-col justify-center items-center p-4 bg-white rounded-3xl border border-gray-200/80 shadow-sm sm:p-8 lg:col-span-7">
            <div className="relative w-full max-w-[700px]">
              <svg
                viewBox="0 0 1000 520"
                className="w-full h-auto drop-shadow-md select-none"
              >
                <image
                  href="/mongolia-map.svg"
                  x="0"
                  y="0"
                  width="1000"
                  height="520"
                  preserveAspectRatio="xMidYMid meet"
                  opacity="0.8"
                />

                <g
                  className="transition-all duration-500 ease-out pointer-events-none"
                  transform={`translate(${activeProvince.svgPoint.x}, ${activeProvince.svgPoint.y})`}
                >
                  <circle
                    r="26"
                    fill="#15803d"
                    opacity="0.3"
                    className="animate-ping"
                  />
                  <circle
                    r="10"
                    fill="#15803d"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                  />

                  <g transform="translate(18, -20)">
                    <rect
                      x="-8"
                      y="-16"
                      width={badgeWidth}
                      height="40"
                      rx="20"
                      fill="#0f172a"
                      stroke="#15803d"
                      strokeWidth="2"
                      opacity="0.95"
                    />
                    <text
                      x="12"
                      y="9"
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="700"
                      fontFamily="Roboto, sans-serif"
                    >
                      📍 {localizedName}
                    </text>
                  </g>
                </g>
              </svg>
            </div>

            {/* Бүх 21 аймгийн товчлуурууд */}
            <div className="flex overflow-y-auto flex-wrap gap-1.5 justify-center p-1 mt-6 max-h-36">
              {PROVINCES.map((prov, idx) => (
                <button
                  key={prov.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                    prov.id === activeProvince.id
                      ? 'bg-[#15803d] text-white shadow-md scale-105 font-bold'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {prov.name[locale] || prov.name.mn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
