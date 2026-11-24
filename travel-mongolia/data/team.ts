// «Бидний тухай» (/about-us) хуудасны хүмүүс. Одоогоор ЖИШЭЭ мэдээлэл: production дээр харагдахгүй
// (lib/navigation.ts SHOW_ABOUT_US = false). Жинхэнэ мэдээлэл оруулсны дараа SHOW_ABOUT_US-ийг true болгоно.
//
// Payload-ийн `team` collection (payload/collections.ts) нь эдгээр талбартай; CMS_SOURCE=payload үед lib/team.ts
// тэндээс уншина, нийтлэгдсэн хүн байхгүй бол энэ жишээ. Талбарууд:
//   id     text (unique, slug)        name   text (required)
//   group  select: advisor | team | creator
//   role   text (албан тушаал / мэргэжил)    bio  textarea (1–2 өгүүлбэр)
//   photo  upload (media), заавал биш       order  number (бүлэг доторх дараалал, бага нь эхэнд)
// Хуудас зөвхөн getTeam()-ээр уншдаг тул шилжихэд энэ функцийг Payload-ийн хүсэлтээр солиход л хангалттай.

export type TeamGroup = 'advisor' | 'team' | 'creator';

export interface TeamMember {
  id: string;
  name: string;
  group: TeamGroup;
  role: string;
  bio: string;
  // Зургийн зам эсвэл URL (public/ эсвэл images.ctfassets.net). Байхгүй бол нэрийн эхний үсэгтэй дугуй.
  photo?: string;
  order: number;
}

const sample = (group: TeamGroup, role: string, count: number): TeamMember[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${group}-${i + 1}`,
    name: 'Нэр Овог',
    group,
    role,
    bio: 'Энд 1–2 өгүүлбэр танилцуулга орно.',
    order: i + 1,
  }));

export const TEAM: TeamMember[] = [
  ...sample('advisor', 'Албан тушаал', 10),
  ...sample('team', 'Албан тушаал', 10),
  ...sample('creator', 'Мэргэжил', 10),
];

export function getTeam(group: TeamGroup): TeamMember[] {
  return TEAM.filter((m) => m.group === group).sort((a, b) => a.order - b.order);
}
