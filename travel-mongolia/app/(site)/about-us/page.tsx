import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import AboutHeroSentence from '@/components/about/AboutHeroSentence';
import TeamGrid from '@/components/about/TeamGrid';
import { type TeamGroup } from '@/data/team';
import { IMAGES, type SiteImage } from '@/lib/images';
import { getTeamMembers, teamOf } from '@/lib/team';
import { SITE_LANGUAGES } from '@/lib/languages';
import { metaFor } from '@/lib/pageMeta';
import { PROVINCE_NAMES } from '@/lib/provinceNames';
import { getSiteStats } from '@/lib/siteStats';

// «Бидний тухай». Production дээр SHOW_ABOUT_US (lib/navigation.ts) false үед noindex, sitemap-гүй
// (PAGE_STATUS draft → metaFor), footer-ийн холбоос нуугдана. Хүмүүс: Payload-ийн «Бидний тухай: хүмүүс» (lib/team.ts), хоосон бол data/team.ts-ийн жишээ.
export const metadata = metaFor('/about-us');

// Коллаж: Монголынх нь шалгагдсан зургууд (lib/images.ts, docs/plan/images.md). Зүүн талд том, баруун талд 4 жижиг.
const COLLAGE: SiteImage[] = [IMAGES.whiteHorse, IMAGES.herderBoy, IMAGES.eagleHunter, IMAGES.chinggisStatue, IMAGES.camels];

// Tooltip-ийн хэлний жагсаалт (lib/languages.ts-ийн дарааллаар)
const LANGUAGE_LIST = 'MN · EN · 中文 · РУ · 한국어 · 日本語';

const SECTIONS: { group: TeamGroup; title: string; intro: string }[] = [
  { group: 'advisor', title: 'Зөвлөхүүд', intro: 'Чиглэл, чанарыг тодорхойлоход тусалдаг салбарын мэргэжилтнүүд.' },
  { group: 'team', title: 'Гүйцэтгэх баг', intro: 'Сайтыг өдөр бүр хөгжүүлж, мэдээллийг шинэчилдэг баг.' },
  { group: 'creator', title: 'Уран бүтээлчид', intro: 'Зураг, бичлэг, нийтлэлээрээ Монголыг харуулдаг уран бүтээлчид.' },
];

export default async function AboutUsPage() {
  // Тоонууд footer-ийн статистиктай нэг эх сурвалжаас (өдөрт 1 кэш). Олдохгүй бол аймаг: lib/provinceNames.ts
  // (21 аймаг + нийслэл), сум: тоогүй бичнэ.
  const [stats, members] = await Promise.all([getSiteStats(), getTeamMembers()]);
  const raw = (key: string) => stats.content.find((s) => s.key === key)?.raw;
  const provinces = raw('provinces') || PROVINCE_NAMES.length - 1;
  const soums = raw('soums') ?? null;

  return (
    <main className="bg-white text-neutral-900">
      {/* 1. Коллаж + бараан ногоон бүрхүүл + өгүүлбэр. Өндөр тогтмол, зургууд fill тул CLS 0 */}
      <section className="relative h-[480px] overflow-hidden md:h-[560px]">
        <div className="grid absolute inset-0 grid-cols-4 grid-rows-3 gap-1 md:grid-rows-2">
          {COLLAGE.map((img, i) => (
            <div
              key={img.src}
              className={`relative ${i === 0 ? 'col-span-4 row-span-2 md:col-span-2 md:row-span-2' : 'md:col-span-1'}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={i === 0}
                sizes={i === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 25vw'}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[#14532d]/80" />
        <div className="flex absolute inset-0 flex-col justify-center items-center px-5 sm:px-10">
          <h1 className="mb-5 text-xs font-bold tracking-[0.25em] text-[#D7F0B0] uppercase sm:text-sm">Бидний тухай</h1>
          <AboutHeroSentence
            provinces={provinces}
            soums={soums}
            languages={SITE_LANGUAGES.length}
            languageList={LANGUAGE_LIST}
          />
        </div>
        <p className="absolute right-3 bottom-2 text-[10px] text-white/70">Зураг: Unsplash, Travel Hub Mongolia</p>
      </section>

      {/* 2–4. Зөвлөхүүд, гүйцэтгэх баг, уран бүтээлчид */}
      {SECTIONS.map((s, i) => (
        <section
          key={s.group}
          aria-labelledby={`about-${s.group}`}
          className={`py-14 md:py-20 ${i % 2 ? 'bg-[#f6f7f4]' : 'bg-white'}`}
        >
          <div className="px-6 mx-auto max-w-7xl sm:px-10 lg:px-16">
            <div className="mb-10 text-center md:mb-12">
              <h2 id={`about-${s.group}`} className="text-2xl font-extrabold tracking-tight text-neutral-900 md:text-3xl">
                {s.title}
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-neutral-600">{s.intro}</p>
            </div>
            <TeamGrid members={teamOf(members, s.group)} group={s.group} />
          </div>
        </section>
      ))}

      {/* 5. Нэгдэх урилга */}
      <section className="py-16 text-center bg-white border-t border-neutral-100 md:py-20">
        <div className="px-6 mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold text-neutral-900 md:text-3xl">Бидэнтэй нэгдэх үү?</h2>
          <Link
            href="/impact#donors"
            className="inline-flex items-center mt-7 py-3 px-7 text-base font-bold text-white bg-[#15803d] hover:bg-[#166534] rounded-full transition-colors"
          >
            Хамтран ажиллах <span aria-hidden="true">&nbsp;→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
