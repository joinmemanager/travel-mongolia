import React from 'react';

import DarkPanel from '@/components/design/DarkPanel';
import LinkCard from '@/components/design/LinkCard';
import PatternBand from '@/components/design/PatternBand';
import HubHeader from '@/components/HubHeader';
import LocalHubClient, { type HubSection } from '@/components/LocalHubClient';
import { LOCAL_PAGES } from '@/components/templates/LocalListingPage';
import { IMAGES } from '@/lib/images';
import { getExperiences, getProviders, PROVIDER_TYPES } from '@/lib/localContent';
import { metaFor } from '@/lib/pageMeta';

// "Нутгийн Монгол" hub (Б хэсэг). Төлөв: draft (lib/navigation.ts PAGE_STATUS).
// Hub загвар: зурагтай картууд → нэг бараан ногоон самбар → холбоосны карт.
export const dynamic = 'force-dynamic';
export const metadata = metaFor('/local');

// Баримт бичгийн 9-р хэсгийн "Local & Responsible Choice" хүснэгт
const CHOICE_ITEMS = [
  { title: 'Нутгийн үйлчилгээ үзүүлэгч', text: 'Нутгийн хүн/өрх/жижиг бизнестэй шууд холбоотойг ойлгуулна.' },
  { title: 'Нутгийн иргэдэд түшиглэсэн туршлага', text: 'Орон нутгийн оролцоо, зохион байгуулагч, өгөөжийг тайлбарлана.' },
  { title: 'Хариуцлагатай дадал', text: 'Соёл, байгальд ээлтэй бодит дадлыг товч харуулна.' },
  { title: 'Хүлээн зөвшөөрөгдсөн гэрчилгээ', text: 'Байгаа тохиолдолд гаднын баталгаажсан гэрчилгээг л харуулна.' },
];

export default async function LocalHubPage() {
  const [providers, experiences] = await Promise.all([getProviders(), getExperiences()]);

  const sections: HubSection[] = [
    ...PROVIDER_TYPES.map((t) => ({
      id: t.id,
      title: t.mn,
      href: t.href,
      items: providers
        .filter((p) => p.providerType === t.id)
        .map((p) => ({
          id: p.id,
          href: p.href,
          name: p.name,
          province: p.province,
          image: p.photos[0] || IMAGES.herderBoy,
          localOwned: p.localOwned,
          community: Boolean(p.communityParticipation),
        })),
    })),
    {
      id: 'experiences',
      title: 'Нутгийн туршлага',
      href: '/local/experiences',
      // Туршлагын нутгийн өмчлөл, оролцоог зохион байгуулагчаас нь авна
      items: experiences.map((x) => {
        const host = providers.find((p) => p.id === x.hostId);
        return {
          id: x.id,
          href: x.href,
          name: x.title,
          province: x.province,
          image: x.photos[0] || IMAGES.gerCamp,
          localOwned: Boolean(host?.localOwned),
          community: Boolean(x.community || host?.communityParticipation),
        };
      }),
    },
  ];

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900">
      <HubHeader
        crumbs={[
          { label: 'Нүүр', href: '/' },
          { label: 'Нутгийн Монгол', href: '/local' },
        ]}
        kicker="НУТГИЙН МОНГОЛ"
        kickerEn="LOCAL MONGOLIA"
        title="Нутгийн Монгол"
        intro="Монголын нутгийн хүмүүс, өрхүүдийн санал болгодог туршлага, хөтөч, гар урлал, хоол, бүтээгдэхүүн. Нутгийн өгөөжтэй сонголтоо хийгээрэй."
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-12 space-y-16">
        <LocalHubClient sections={sections} emptyText="Удахгүй нэмэгдэнэ." />

        <DarkPanel
          id="local-choice"
          title="“Local & Responsible Choice” таних мэдээлэл"
          intro="Travel Hub өөрөө үйлчилгээ үзүүлэгчдийг “хамгийн ногоон” гэж эрэмбэлэхээс илүү хэрэглэгчийн шийдвэрт хэрэгтэй энгийн мэдээллийг ил тод харуулна."
          items={CHOICE_ITEMS}
        />

        <LinkCard title="Холбогдох хуудсууд" columns={3} links={LOCAL_PAGES} />
      </div>

      <div className="mt-32">
        <PatternBand />
      </div>
    </main>
  );
}
