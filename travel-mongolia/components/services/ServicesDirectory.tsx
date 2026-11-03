'use client';

import React, { useEffect, useMemo, useState } from 'react';

import ServiceCard from '@/components/services/ServiceCard';
import ServiceSources from '@/components/services/ServiceSources';
import { type ProvinceService, SERVICE_LABEL, type ServiceType } from '@/lib/serviceTypes';

export interface ServiceRow extends ProvinceService {
  aimag: string;
}

const PAGE_SIZE = 60;
const TYPES = Object.keys(SERVICE_LABEL) as ServiceType[];

// /plan/useful-services: аймаг, төрлөөр шүүнэ. ?aimag=<slug>&type=<төрөл> нь ?cat=-ийн адил хуудас доторх шүүлтүүр.
// useSearchParams биш: хуудас статик, эхний мөрүүд server HTML-д үлдэнэ.
export default function ServicesDirectory({ rows, aimags }: { rows: ServiceRow[]; aimags: { slug: string; name: string }[] }) {
  const [aimag, setAimag] = useState('');
  const [type, setType] = useState<ServiceType | ''>('');
  const [limit, setLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const a = q.get('aimag');
    const t = q.get('type') as ServiceType | null;
    if (a && aimags.some((x) => x.slug === a)) setAimag(a);
    if (t && TYPES.includes(t)) setType(t);
  }, [aimags]);

  const syncUrl = (nextAimag: string, nextType: string) => {
    const url = new URL(window.location.href);
    if (nextAimag) url.searchParams.set('aimag', nextAimag);
    else url.searchParams.delete('aimag');
    if (nextType) url.searchParams.set('type', nextType);
    else url.searchParams.delete('type');
    window.history.replaceState(window.history.state, '', url);
    setLimit(PAGE_SIZE);
  };
  const chooseAimag = (v: string) => { setAimag(v); syncUrl(v, type); };
  const chooseType = (v: ServiceType | '') => { setType(v); syncUrl(aimag, v); };

  const inAimag = useMemo(() => (aimag ? rows.filter((x) => x.aimag === aimag) : rows), [rows, aimag]);
  const shown = useMemo(() => (type ? inAimag.filter((x) => x.type === type) : inAimag), [inAimag, type]);
  const nameOf = (slug: string) => aimags.find((x) => x.slug === slug)?.name || '';
  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
      active ? 'bg-[#15803d] border-[#15803d] text-white' : 'bg-white border-neutral-200 text-neutral-700 hover:border-[#15803d]'
    }`;

  return (
    <section id="directory" className="scroll-mt-28">
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <button type="button" className={chip(type === '')} onClick={() => chooseType('')}>
          Бүгд ({inAimag.length})
        </button>
        {TYPES.filter((t) => inAimag.some((x) => x.type === t)).map((t) => (
          <button key={t} type="button" className={chip(type === t)} onClick={() => chooseType(t)}>
            {SERVICE_LABEL[t]} ({inAimag.filter((x) => x.type === t).length})
          </button>
        ))}
        <label className="flex gap-2 items-center ml-auto text-xs font-bold text-neutral-600">
          Аймаг
          <select
            value={aimag}
            onChange={(e) => chooseAimag(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-800"
          >
            <option value="">Бүх аймаг</option>
            {aimags.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mb-4 text-xs text-neutral-500">{shown.length} газар</p>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.slice(0, limit).map((x) => (
          <ServiceCard key={`${x.aimag}-${x.id}`} item={x} aimag={aimag ? undefined : nameOf(x.aimag)} />
        ))}
      </ul>
      {shown.length > limit && (
        <p className="mt-6 text-center">
          <button type="button" className={chip(false)} onClick={() => setLimit((n) => n + PAGE_SIZE)}>
            Дахин үзэх ({shown.length - limit} үлдсэн)
          </button>
        </p>
      )}
      <ServiceSources
        joinme={shown.some((x) => !x.source)}
        osm={shown.some((x) => x.source === 'osm')}
        className="mt-8 text-xs text-neutral-500"
      />
    </section>
  );
}
