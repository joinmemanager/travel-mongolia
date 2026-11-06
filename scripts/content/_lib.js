// Контентын шинжилгээний туслах: snapshot уншиx, текст гаргах, үг тоолох, хаяг тодорхойлох.
// lib/seo.ts, lib/indexNow.ts, app/sitemap.ts-ийн дүрмийг давтана.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SNAP = path.join(ROOT, 'backups', 'contentful-snapshot-2026-11-06');
const L = 'mn';
const SITE = 'https://www.travelhubmongolia.com';

const load = (f) => JSON.parse(fs.readFileSync(path.join(SNAP, f), 'utf8'));

function plain(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (node.nodeType === 'text') return node.value || '';
  if (Array.isArray(node.content)) {
    const sep = /^(paragraph|heading-\d|list-item|blockquote|table-cell)$/.test(node.nodeType) ? '\n' : ' ';
    return node.content.map(plain).join(node.nodeType === 'document' ? '\n' : ' ') + (sep === '\n' ? '' : '');
  }
  return '';
}
// lib/seo.ts wordCount-тэй ижил
const words = (t) => String(t || '').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const fv = (e, k) => e.fields?.[k]?.[L];

// Төрөл бүрийн гол бичвэрийн талбар (rich text эсвэл text)
const TEXT_FIELDS = {
  province: ['description2', 'description', 'intro', 'whyVisit', 'attractions', 'thingsToDo', 'bestTimeToVisit', 'gettingThere', 'whereToStay', 'suggestedItineraries', 'heritageFeatures', 'localPeople'],
  destination: ['description', 'intro', 'whyVisit', 'attractions', 'thingsToDo', 'bestTimeToVisit', 'gettingThere', 'whereToStay', 'suggestedItineraries', 'heritageFeatures', 'localPeople'],
  heritagePlace: ['description', 'heritageFeatures', 'localPeople'],
  soum: ['body'],
  place: ['body'],
  historyArticle: ['body'],
  cultureArticle: ['body'],
  species: ['summary', 'body'],
  story: ['body'],
  localProvider: ['story', 'communityParticipation'],
  event: ['culturalMeaning'],
  recommendation: [],
  cultureHeritage: ['description'],
  heritageCategory: [],
  communityExperience: ['whatYouDo', 'culturalGuidance', 'community'],
  localProduct: ['story', 'whereToBuy'],
  visitorGuidance: ['culturalEtiquette', 'natureGuidance', 'safety', 'source'],
  faqItem: ['question', 'answer'],
};
// noindex/sitemap шалгуурт ашигладаг талбар (isThinContent)
const THIN_FIELD = { heritagePlace: 'description', place: 'body', species: 'body', cultureArticle: 'body', story: 'body', localProvider: 'story', soum: 'body' };

const textOf = (e) => {
  const ct = e.sys.contentType.sys.id;
  return (TEXT_FIELDS[ct] || []).map((k) => { const v = fv(e, k); return Array.isArray(v) ? v.join('\n') : plain(v); }).filter(Boolean).join('\n');
};
const titleOf = (e) => fv(e, 'title') || fv(e, 'name') || fv(e, 'question') || fv(e, 'slug') || e.sys.id;
const key = (e) => fv(e, 'slug') || e.sys.id;

const CULTURE = { 'ethnic-groups': '/about/culture/ethnic-groups', people: '/about/history/people', religion: '/about/culture/religion', traditions: '/about/traditions' };
const PLACE_BASE = { 'strictly-protected': '/destination/protected', 'national-park': '/destination/protected', 'nature-reserve': '/destination/protected', 'natural-monument': '/destination/protected', museum: '/things-to-do/museums', theatre: '/things-to-do/museums', 'culture-center': '/things-to-do/museums', sanatorium: '/things-to-do/wellness', landscape: '/destination/landscapes' };
const SPECIES = { mammal: 'wildlife', invertebrate: 'wildlife', fish: 'wildlife', reptile: 'wildlife', bird: 'birds', plant: 'plants' };
const ARTICLE = { local: '/local/articles', respect: '/respect/articles', impact: '/impact/articles' };

function urlOf(e, byId) {
  const ct = e.sys.contentType.sys.id;
  const k = key(e);
  switch (ct) {
    case 'province': return `/province/${k}`;
    case 'destination': return `/destination/${k}`;
    case 'heritagePlace': return `/destination/heritage/place/${k}`;
    case 'heritageCategory': return `/destination/heritage/${k}`;
    case 'historyArticle': return `/about/history/${k}`;
    case 'recommendation': case 'event': return `/recommendation/${k}`;
    case 'cultureArticle': return CULTURE[fv(e, 'section')] ? `${CULTURE[fv(e, 'section')]}/${k}` : '';
    case 'localProvider':
      if (fv(e, 'providerType') === 'accommodation' && /touristinfocenter/.test(String(fv(e, 'sourceUrl') || ''))) return `/plan/accommodation/${k}`;
      return `/local/${k}`;
    case 'story': {
      const t = fv(e, 'topic');
      if (t === 'news') return `/stories/news/${k}`;
      if (ARTICLE[t]) return `${ARTICLE[t]}/${k}`;
      if (t === 'international') return `/impact/examples/${k}`;
      return `/stories/${k}`;
    }
    case 'place': return PLACE_BASE[fv(e, 'category')] ? `${PLACE_BASE[fv(e, 'category')]}/${k}` : '';
    case 'species': {
      const s = SPECIES[fv(e, 'group')] || 'wildlife';
      return fv(e, 'ownPage') === true ? `/about/nature/${s}/${k}` : `/about/nature/${s}#${k}`;
    }
    case 'soum': {
      const p = byId.get(fv(e, 'province')?.sys?.id);
      const ps = p ? fv(p, 'slug') : '';
      if (!ps) return '';
      return fv(e, 'ownPage') === true ? `/province/${ps}/${k}` : `/province/${ps}#${k}`;
    }
    case 'communityExperience': return `/local/experiences/${k}`;
    case 'localProduct': return '/local/products';
    default: return '';
  }
}

const status = (e) => (e.sys.archivedVersion ? 'archived' : !e.sys.publishedVersion ? 'draft' : e.sys.version > e.sys.publishedVersion + 1 ? 'changed' : 'published');

module.exports = { ROOT, SNAP, SITE, L, load, plain, words, fv, textOf, titleOf, key, urlOf, status, TEXT_FIELDS, THIN_FIELD, CULTURE, PLACE_BASE, SPECIES };
