// «Бидний тухай» (/about-us)-ийн хүмүүс: CMS_SOURCE=payload үед Payload-ийн `team` collection-оос (нийтлэгдсэн),
// эс бөгөөс (эсвэл collection хоосон/алдаатай үед) data/team.ts-ийн жишээ өгөгдөл. Зөвхөн серверт.

import { CMS_SOURCE } from '@/lib/contentful';
import { TEAM, type TeamGroup, type TeamMember } from '@/data/team';

const GROUPS: TeamGroup[] = ['advisor', 'team', 'creator'];

async function fromPayload(): Promise<TeamMember[]> {
  const [{ getPayload }, { default: config }] = await Promise.all([import('payload'), import('@payload-config')]);
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: 'team' as any,
    where: { _status: { equals: 'published' } },
    sort: 'order',
    limit: 300,
    depth: 1,
    locale: 'mn',
    overrideAccess: true,
  });
  return res.docs
    .filter((d: any) => GROUPS.includes(d.group) && d.name)
    .map((d: any) => ({
      id: String(d.slug || d.id),
      name: d.name,
      group: d.group,
      role: d.role || '',
      bio: d.bio || '',
      photo: (typeof d.photo === 'object' && (d.photo?.sizes?.w480?.url || d.photo?.url)) || undefined,
      order: Number(d.order ?? 100),
    }));
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (CMS_SOURCE === 'payload') {
    try {
      const members = await fromPayload();
      if (members.length) return members;
    } catch (err) {
      console.error('team: Payload-аас уншиж чадсангүй, жишээ өгөгдлийг харуулна', err);
    }
  }
  return TEAM;
}

export const teamOf = (all: TeamMember[], group: TeamGroup) =>
  all.filter((m) => m.group === group).sort((a, b) => a.order - b.order);
