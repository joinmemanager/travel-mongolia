import Image from 'next/image';
import Link from 'next/link';

export interface HeritagePlace {
  id: string;
  name: string;
  region: string;
  img: string;
}

export default function HeritagePlaceCard({ place }: { place: HeritagePlace }) {
  return (
    <Link
      href={`/destination/heritage/place/${place.id}`}
      className="group relative rounded-3xl overflow-hidden bg-white border border-neutral-100/90 shadow-sm hover:shadow-xl hover:border-[#15803d]/60 transition-all duration-300 flex flex-col h-80 sm:h-96"
    >
      <div className="relative w-full flex-1 overflow-hidden">
        <Image
          src={place.img}
          alt={place.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="text-xs font-semibold text-emerald-300 block mb-1">
            {place.region}
          </span>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            {place.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
