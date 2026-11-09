import React from 'react';

import LocalListingPage, { productSpot } from '@/components/templates/LocalListingPage';
import { IMAGES } from '@/lib/images';
import { getProducts } from '@/lib/localContent';
import { metaFor } from '@/lib/pageMeta';
import { connection } from 'next/server';
import { isPreviewEnv } from '@/lib/navigation';

// Нутгийн Монгол: Нутгийн бүтээгдэхүүн (Б хэсэг, live). "Ангиллын жагсаалт" загвар.
// 2026-11-06-ноос статик/ISR: ?cat= (?style=, ?days= г.м.) параметрийг жагсаалтын Suspense доторх хэсэг уншина,
// server HTML-д «Бүгд»-ийн бүтэн агуулга орно (Vercel CPU-г хэмнэх; docs/plan/performance.md).
export const metadata = metaFor('/local/products');

export default async function Page() {
  if (isPreviewEnv()) await connection();
  const products = await getProducts();
  return (
    <LocalListingPage
      hero={IMAGES.herdSnow}
      kicker="НУТГИЙН МОНГОЛ"
      title="Нутгийн бүтээгдэхүүн"
      intro="Монголын нутгийн бүтээгдэхүүн: цагаан идээ, эсгий, гар урлал. Хэн хийдэг, хаана, хэзээ олдох, хаанаас авах."
      countLabel="бүтээгдэхүүн олдлоо"
      spots={products.map(productSpot)}
      current="/local/products"
      inviteKey="products"
    />
  );
}
