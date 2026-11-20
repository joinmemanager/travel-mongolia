// «Байгалийн өв» хэсгийн шинэ 4 хуудас (цэс v2, 2026-11-20): /nature/geology, /nature/paleontology,
// /nature/unesco, /nature/international-sites. Шинэ контент бичээгүй: сайтад аль хэдийн байгаа хуудас,
// хэсгүүд рүү холбосон, тайлбар нь тэдгээр хуудасны өөрийнх. Контент хангалтгүй тул цэсэнд soft
// (production дээр харагдана, noindex, sitemap-д орохгүй; lib/navigation.ts). Контент нэмэгдвэл live болгоно.

export interface NatureLink {
  label: string;
  href: string;
  desc: string;
}

export interface NatureGroup {
  title: string;
  // Ангиллын ерөнхий тайлбар (холбоосгүй байж болно)
  desc?: string;
  links: NatureLink[];
}

export interface NatureHeritagePageData {
  title: string;
  kickerEn: string;
  intro: string;
  groups: NatureGroup[];
}

export type NaturePath = '/nature/geology' | '/nature/paleontology' | '/nature/unesco' | '/nature/international-sites';

export const NATURE_HERITAGE: Record<NaturePath, NatureHeritagePageData> = {
  '/nature/geology': {
    title: 'Геологийн өв',
    kickerEn: 'Geological Heritage',
    intro:
      'Монгол орны газрын гадаргад олон сая жилийн геологийн үйл явцын ул мөр хадгалагдан үлджээ. Энэ хуудсанд сайтад байгаа галт уул, агуй, хад цохио, хавцал зэрэг геологийн тогтоцын тухай мэдээллийг нэг дор цуглуулав. Контент цаашид нэмэгдэнэ.',
    groups: [
      {
        title: 'Сайтад байгаа мэдээлэл',
        links: [
          {
            label: 'Геологи',
            href: '/about/nature#geology',
            desc: 'Унтарсан галт уулс, байгалийн халуун рашаанууд, эрдэс баялгийн бүсүүд.',
          },
          {
            label: 'Агуй, геологийн тогтоц',
            href: '/destination/landscapes#caves-geology',
            desc: 'Цагаан суварга, Даян дээрхийн агуй, Хоргын галт уулын тогоо.',
          },
          {
            label: 'Хавцал, хөндий',
            href: '/destination/landscapes#canyons',
            desc: 'Монголын байгалийн хавцал, хөндийнүүд.',
          },
          {
            label: 'Байгалийн дурсгалт газрууд',
            href: '/destination/natural-monuments',
            desc: 'Байгалийн хосгүй өвөрмөц тогтоц, сонин хачин хад чулуу, хүрхрээ.',
          },
        ],
      },
    ],
  },
  '/nature/paleontology': {
    title: 'Палеонтологийн өв',
    kickerEn: 'Paleontological Heritage',
    intro:
      'Монголын говь нь үлэг гүрвэлийн олдвороороо дэлхийд алдартай. Энэ хуудсанд сайтад байгаа палеонтологийн ач холбогдолтой газар, сэдвүүдийг нэг дор цуглуулав. Контент цаашид нэмэгдэнэ.',
    groups: [
      {
        title: 'Сайтад байгаа мэдээлэл',
        links: [
          {
            label: 'Палеонтологи, үлэг гүрвэл',
            href: '/about/nature#paleontology',
            desc: 'Тарбозавр, үлэг гүрвэлийн өндөг, Хэрмэн цав ба Нэмэгтийн хөндий.',
          },
          {
            label: 'Говь, цөл',
            href: '/destination/landscapes#gobi',
            desc: 'Баянзаг (Улаан хэрэм), Нэмэгтийн хөндий, Хэрмэн цав.',
          },
          {
            label: 'Байгалийн дурсгалт газрууд',
            href: '/destination/natural-monuments',
            desc: 'Баянзаг, Цагаан суварга зэрэг үлэг гүрвэлийн өлгий газрууд.',
          },
          {
            label: 'Нууц үзэсгэлэнт газрууд',
            href: '/inspiration/hidden',
            desc: 'Нэмэгтийн хөндийн үлэг гүрвэлийн оршуулга.',
          },
        ],
      },
    ],
  },
  '/nature/unesco': {
    title: 'ЮНЕСКО-гийн байгалийн өв',
    kickerEn: 'UNESCO Natural Heritage',
    intro:
      'ЮНЕСКО-гийн Дэлхийн өвийн жагсаалтад байгалийн онцгой үнэ цэнэтэй газрууд бүртгэгддэг. Энэ хуудсанд Монголын байгалийн өвийн тухай сайтад байгаа мэдээллийг цуглуулав. Контент цаашид нэмэгдэнэ.',
    groups: [
      {
        title: 'Сайтад байгаа мэдээлэл',
        links: [
          {
            label: 'Увс нуурын хотгор',
            href: '/about/nature#lakes-rivers',
            desc: 'Давстай их нуур, ЮНЕСКО-гийн дэлхийн байгалийн өвд бүртгэгдсэн шувуудын чуулган.',
          },
          {
            label: 'Тусгай хамгаалалттай газрууд',
            href: '/destination/protected',
            desc: 'Дархан цаазат, байгалийн цогцолборт, нөөц болон дурсгалт газрууд.',
          },
        ],
      },
    ],
  },
  '/nature/international-sites': {
    title: 'Олон улсын ач холбогдолтой газрууд',
    kickerEn: 'Sites of International Importance',
    intro:
      'Намгархаг газар, шувуу, биологийн олон янз байдлын хувьд онцгой газруудыг олон улсын конвенц, хөтөлбөрүүд тус тусдаа тодорхойлдог. Энэ хуудсанд эдгээр ангиллыг товч тайлбарлаж, сайтад байгаа холбогдох мэдээлэл рүү холбов. Контент цаашид нэмэгдэнэ.',
    groups: [
      {
        title: 'Рамсарын газар (Ramsar)',
        desc: 'Рамсарын конвенцоор олон улсын ач холбогдолтой гэж бүртгэгдсэн намгархаг газар, нуур.',
        links: [
          {
            label: 'Зэрлэг амьтан, шувуу ажиглах',
            href: '/things-to-do/wildlife',
            desc: 'Өгий нуур: Рамсарын конвенцод бүртгэлтэй, нүүдлийн шувуудын чуулган.',
          },
        ],
      },
      {
        title: 'Биосферийн нөөц газар (MAB)',
        desc: 'ЮНЕСКО-гийн «Хүн ба шим мандал» хөтөлбөрийн сүлжээнд багтсан газрууд.',
        links: [],
      },
      {
        title: 'Шувууны чухал газар (IBA)',
        desc: 'Шувууд болон тэдний амьдрах орчныг хамгаалахад чухал гэж тодорхойлсон газрууд.',
        links: [
          {
            label: 'Шувууд',
            href: '/about/nature/birds',
            desc: 'Монголын шувуудын лавлах.',
          },
        ],
      },
      {
        title: 'Биологийн олон янз байдлын түлхүүр газар (KBA)',
        desc: 'Дэлхийн биологийн олон янз байдлыг хадгалахад онцгой үүрэгтэй газрууд.',
        links: [],
      },
      {
        title: 'Нүүдлийн шувуудын нислэгийн зам (Flyway)',
        desc: 'Нүүдлийн шувуудын олон улсын нислэгийн замын дагуух газруудын сүлжээ.',
        links: [
          {
            label: 'Ан амьтан',
            href: '/about/nature/wildlife',
            desc: 'Монголын зэрлэг амьтдын лавлах.',
          },
        ],
      },
    ],
  },
};
