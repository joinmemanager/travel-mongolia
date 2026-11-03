import Link from 'next/link';
import { connection } from 'next/server';
import React from 'react';

import HubHeader from '@/components/HubHeader';
import { getInternationalReports, SOURCE_TYPE_LABEL } from '@/lib/internationalReports';
import { isPreviewEnv } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';

// «Үр өгөөж & түншлэл» › «Олон улсын жишиг ба тайлан»: тайлангуудын жагсаалт. Төлөв: live.
export const metadata = metaFor('/impact/examples');
export const revalidate = 604800;

// Эх: docs/content/esg-international-examples.md, «Нэгдсэн дүгнэлт»
const TAKEAWAYS = [
  { title: 'Стандартаас эхлэх.', text: 'GSTC, Green Destinations зэрэг олон улсын шалгуурыг суурь болгож, дээр нь улсынхаа онцлогийг нэмэх (Словени).' },
  { title: 'Аялагчдын тоогоор бус, үр өгөөжөөр хэмжих.', text: 'Оршин суугчдын ашиг, байгальд үзүүлэх нөлөөг амжилтын үзүүлэлт болгох (OECD, Нидерланд).' },
  { title: 'Маркетингаас удирдлага руу.', text: 'Аялагчдыг татахаас гадна тараах, улирал тэнцвэржүүлэх (ЕП, Барселон).' },
  { title: 'Оршин суугчдын дуу хоолой.', text: 'Шийдвэр гаргахад иргэд, малчдын суваг байлгах (GSTC A5, ЕП).' },
  { title: 'Баталгаажсан мэдээлэл, нээлттэй тайлагнал.', text: 'Бие даасан гэрчилгээ, хоцролтоо ч илэрхийлсэн тайлан (Booking, Marriott).' },
];

export default async function InternationalReportsPage() {
  if (isPreviewEnv()) await connection();
  const reports = await getInternationalReports();

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900">
      <HubHeader
        crumbs={[
          { label: 'Нүүр', href: '/' },
          { label: 'Үр өгөөж & түншлэл', href: '/impact' },
          { label: 'Олон улсын жишиг ба тайлан', href: '/impact/examples' },
        ]}
        kicker="ОЛОН УЛСЫН ЖИШИГ"
        kickerEn="INTERNATIONAL EXAMPLES"
        title="Олон улсын жишиг ба тайлан"
        intro="Тогтвортой аялал жуулчлал, ESG-ийн чиглэлээр дэлхийн тэргүүн байгууллага, улс, компаниудын сайн жишээг монгол уншигчдад танилцуулна. Нийтлэл бүр нэг эх тайланд тулгуурласан бөгөөд гол санаа, тоо баримт, Монголд хэрэгжүүлэх сургамжийг агуулна."
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-12">
        {reports.length === 0 ? (
          <p className="flex items-center justify-center p-6 min-h-24 rounded-2xl border border-dashed border-neutral-300 text-sm text-neutral-500">
            Нийтлэлүүд удахгүй нэмэгдэнэ.
          </p>
        ) : (
          <>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((r) => (
                <li key={r.id}>
                  <Link
                    href={r.href}
                    className="flex flex-col h-full p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-sm hover:border-[#15803d] transition-colors"
                  >
                    <span className="mb-3 text-xs font-bold text-[#15803d]">
                      {[r.sourceType && SOURCE_TYPE_LABEL[r.sourceType], r.publisher, r.year].filter(Boolean).join(' · ')}
                    </span>
                    <span className="mb-3 text-lg font-black leading-snug text-neutral-900">{r.title}</span>
                    {r.seoDescription && <span className="mb-4 text-sm leading-relaxed text-neutral-600">{r.seoDescription}</span>}
                    <span className="mt-auto text-sm font-semibold text-[#15803d]">Дэлгэрэнгүй →</span>
                  </Link>
                </li>
              ))}
            </ul>

            <section className="mt-12 max-w-3xl">
              <h2 className="mb-4 text-2xl font-black text-neutral-900">Зургаан жишээний нийтлэг санаа</h2>
              <ol className="space-y-2 list-decimal pl-6 text-neutral-700">
                {TAKEAWAYS.map((t) => (
                  <li key={t.title}>
                    <strong>{t.title}</strong> {t.text}
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
