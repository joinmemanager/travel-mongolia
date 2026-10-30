'use client';

import { useEffect, useState } from 'react';

import { isShortsLang, type Short, type ShortsLang } from '@/lib/shorts';

import { useSiteLang } from '../useSiteLang';

// Сайтын хэл (googtrans cookie) → богино бичлэгийн хэл. Сервер үргэлж монгол хувилбарыг render хийнэ;
// өөр хэл сонгосон бол mount-ын дараа app/api/shorts/[lang]-ээс тухайн хэлний бичлэгийг татаж солино.
// Татах хүртэл, алдаа гарвал серверийн монгол бичлэг хэвээр.

type ByTopic = Record<string, Short[]>;

// Хуудас дотор нэг хэлийг нэг л удаа татна (нүүр хуудас, хэсгийн хуудас хооронд шилжихэд ч)
const loaded = new Map<ShortsLang, Promise<ByTopic | null>>();

function load(lang: ShortsLang): Promise<ByTopic | null> {
  if (!loaded.has(lang)) {
    loaded.set(
      lang,
      fetch(`/api/shorts/${lang}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => (d?.topics ? Object.fromEntries(d.topics.map((t: any) => [t.slug, t.videos || []])) : null))
        .catch(() => null)
    );
  }
  return loaded.get(lang)!;
}

export function useShortsLang(): { lang: ShortsLang; byTopic: ByTopic | null } {
  const site = useSiteLang();
  const lang: ShortsLang = isShortsLang(site) ? site : 'mn';
  const [byTopic, setByTopic] = useState<ByTopic | null>(null);

  useEffect(() => {
    if (lang === 'mn') return;
    let alive = true;
    load(lang).then((d) => {
      if (alive) setByTopic(d);
    });
    return () => {
      alive = false;
    };
  }, [lang]);

  // byTopic: татаж дуусаагүй, алдаатай бол null (серверийн монгол бичлэг үлдэнэ). UI бичвэр шууд lang-аар.
  return { lang, byTopic: lang === 'mn' ? null : byTopic };
}

// Google Translate (pageLanguage: 'mn') зөвхөн монгол бичвэрийг орчуулна: бусад хэлний бичлэгийн
// гарчиг, lib/shortsI18n.ts-ийн бичвэрийг дахин орчуулахгүй (translate="no" + notranslate).
export const NO_TRANSLATE = { translate: 'no', className: 'notranslate' } as const;
export const titleTranslate = (v: Short): { translate?: 'no'; className?: string } =>
  (v.lang || 'mn') === 'mn' ? {} : NO_TRANSLATE;
