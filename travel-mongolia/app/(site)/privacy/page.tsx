import React from 'react';

import GuidePage from '@/components/GuidePage';
import { LEGAL_NOTICE, PRIVACY as doc } from '@/lib/legalData';
import { metaFor } from '@/lib/pageMeta';

// НООРОГ (soft төлөв, lib/navigation.ts FOOTER_LEGAL): хуулийн хяналтын дараа live болгоно.
export const metadata = metaFor('/privacy');

export default function Page() {
  return (
    <GuidePage
      crumbs={[
        { label: 'Нүүр', href: '/' },
        { label: doc.title, href: '/privacy' },
      ]}
      kicker={doc.kicker}
      kickerEn={doc.kickerEn}
      title={doc.title}
      intro={doc.intro}
      notice={LEGAL_NOTICE}
      sections={doc.sections}
      related={[{ label: 'Үйлчилгээний нөхцөл', href: '/terms' }]}
    />
  );
}
