'use client';

import React, { useState } from 'react';

import ServiceCard from '@/components/services/ServiceCard';
import { loadAimagServices } from '@/lib/serviceLoaders';
import type { ServiceRow, ServiceType } from '@/lib/serviceTypes';

// Аймгийн хуудасны олон мөртэй төрөл: нээх үед л тухайн аймгийн JSON-ыг ачаална.
export default function LazyServiceGroup({ slug, type, label, count }: { slug: string; type: ServiceType; label: string; count: number }) {
  const [items, setItems] = useState<ServiceRow[] | null>(null);
  const [failed, setFailed] = useState(false);
  const onToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    if (!e.currentTarget.open || items) return;
    setFailed(false);
    loadAimagServices(slug)
      .then((rows) => setItems(rows.filter((x) => x.type === type)))
      .catch(() => setFailed(true));
  };
  return (
    <details onToggle={onToggle} className="group">
      <summary className="flex gap-2 items-center py-2 text-lg font-bold list-none cursor-pointer text-neutral-900">
        <span aria-hidden="true" className="text-neutral-400 transition-transform group-open:rotate-90">›</span>
        {label} <span className="text-neutral-400">({count})</span>
      </summary>
      {items ? (
        <ul className="grid grid-cols-1 gap-3 mt-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((x) => (
            <ServiceCard key={x.id} item={x} />
          ))}
        </ul>
      ) : (
        <p className="py-3 text-sm text-neutral-500">{failed ? 'Ачаалж чадсангүй. Хураагаад дахин нээнэ үү.' : 'Ачаалж байна…'}</p>
      )}
    </details>
  );
}
