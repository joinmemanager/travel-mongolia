'use client';

import React, { useEffect, useMemo, useState } from 'react';

import ServiceCard from '@/components/services/ServiceCard';
import ServiceSources from '@/components/services/ServiceSources';
import { loadAimagServices } from '@/lib/serviceLoaders';
import { isGenericService, SERVICE_LABEL, type ServiceRow, type ServiceType } from '@/lib/serviceTypes';

export interface AimagSummary {
  slug: string;
  name: string;
  counts: Partial<Record<ServiceType, number>>;
}

const PAGE_SIZE = 60;
const TYPES = Object.keys(SERVICE_LABEL) as ServiceType[];

// /plan/useful-services: аймаг, төрлөөр шүүнэ. ?aimag=<slug>&type=<төрөл> нь ?cat=-ийн адил хуудас доторх шүүлтүүр.
// Эхний мөрүүд (`initial`) server-ээс; бусдыг аймгийн JSON-оос хэрэгтэй үед нь ачаална (lib/serviceLoaders.ts).
export default function ServicesDirectory({ initial, aimags }: { initial: ServiceRow[]; aimags: AimagSummary[] }) {
  const [aimag, setAimag] = useState('');
  const [type, setType] = useState<ServiceType | ''>('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [loaded, setLoaded] = useState<Record<string, ServiceRow[]>>({});
  const [loading, setLoading] = useState('');
  const [failed, setFailed] = useState(false);

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
    setFailed(false);
  };
  const chooseAimag = (v: string) => { setAimag(v); syncUrl(v, type); };
  const chooseType = (v: ServiceType | '') => { setType(v); syncUrl(aimag, v); };

  // Шүүлтүүрт харагдах мөрүүд. «Бүх аймаг»: эхний мөрүүд → ачаалсан аймгуудын нэртэй газрууд;
  // ерөнхий нэртэйг бүх аймаг ачаалагдсаны дараа хамгийн сүүлд (өмнө нь гарсан мөрийн байр өөрчлөгдөхгүй).
  const available = useMemo(() => {
    const ofType = (rows: ServiceRow[]) => (type ? rows.filter((x) => x.type === type) : rows);
    if (aimag) return ofType(loaded[aimag] || initial.filter((x) => x.aimag === aimag));
    const seen = new Set(initial.map((x) => x.id));
    const more = aimags.flatMap((a) => loaded[a.slug] || []).filter((x) => !seen.has(x.id));
    const allLoaded = aimags.every((a) => loaded[a.slug]);
    return ofType([
      ...initial,
      ...more.filter((x) => !isGenericService(x.name)),
      ...(allLoaded ? more.filter((x) => isGenericService(x.name)) : []),
    ]);
  }, [aimag, type, loaded, initial, aimags]);

  const scope = aimag ? aimags.filter((a) => a.slug === aimag) : aimags;
  const countOf = (t: ServiceType) => scope.reduce((n, a) => n + (a.counts[t] || 0), 0);
  const scopeTotal = TYPES.reduce((n, t) => n + countOf(t), 0);
  const total = type ? countOf(type) : scopeTotal;

  // Хэрэгтэй аймгийн JSON: сонгосон аймаг, эсвэл харуулах мөр дутвал дараагийн аймаг
  useEffect(() => {
    if (loading || failed) return;
    const next = aimag
      ? (loaded[aimag] ? undefined : aimag)
      : available.length < Math.min(limit, total)
        ? aimags.find((a) => !loaded[a.slug])?.slug
        : undefined;
    if (!next) return;
    setLoading(next);
    loadAimagServices(next)
      .then((rows) => setLoaded((prev) => ({ ...prev, [next]: rows })))
      .catch(() => setFailed(true))
      .finally(() => setLoading(''));
  }, [aimag, available.length, limit, total, loaded, loading, failed, aimags]);

  const shown = available.slice(0, limit);
  const nameOf = (slug: string) => aimags.find((x) => x.slug === slug)?.name || '';
  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
      active ? 'bg-[#15803d] border-[#15803d] text-white' : 'bg-white border-neutral-200 text-neutral-700 hover:border-[#15803d]'
    }`;

  return (
    <section id="directory" className="scroll-mt-28">
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <button type="button" className={chip(type === '')} onClick={() => chooseType('')}>
          Бүгд ({scopeTotal})
        </button>
        {TYPES.filter((t) => countOf(t) > 0).map((t) => (
          <button key={t} type="button" className={chip(type === t)} onClick={() => chooseType(t)}>
            {SERVICE_LABEL[t]} ({countOf(t)})
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
      <p className="mb-4 text-xs text-neutral-500">{total} газар</p>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((x) => (
          <ServiceCard key={`${x.aimag}-${x.id}`} item={x} aimag={aimag ? undefined : nameOf(x.aimag)} />
        ))}
      </ul>
      {failed && <p className="mt-6 text-sm text-center text-red-700">Мэдээллийг ачаалж чадсангүй. Хуудсаа дахин ачаална уу.</p>}
      {!failed && shown.length < total && (
        <p className="mt-6 text-center">
          <button type="button" disabled={!!loading} className={chip(false)} onClick={() => setLimit((n) => n + PAGE_SIZE)}>
            {loading ? 'Ачаалж байна…' : `Дахин үзэх (${total - shown.length} үлдсэн)`}
          </button>
        </p>
      )}
      <ServiceSources joinme osm className="mt-8 text-xs text-neutral-500" />
    </section>
  );
}
