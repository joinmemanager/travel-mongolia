import React from 'react';

import LocalListingPage, { productSpot } from '@/components/templates/LocalListingPage';
import { IMAGES } from '@/lib/images';
import { getProducts } from '@/lib/localContent';
import { metaFor } from '@/lib/pageMeta';

// Нутгийн Монгол: Нутгийн бүтээгдэхүүн (Б хэсэг, soft). "Ангиллын жагсаалт" загвар.
export const dynamic = 'force-dynamic';
export const metadata = metaFor('/local/products');

export default async function Page() {
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
