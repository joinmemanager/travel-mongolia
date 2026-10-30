// lib/shorts.ts-ийн YouTube хариу задлах функцуудыг жишээ (mock) өгөгдлөөр шалгана. API дуудахгүй.
//   node scripts/shorts/test-parse.js   (travel-mongolia хавтаснаас)
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// lib/shorts.ts-ийг CommonJS болгон хөрвүүлж ачаална
const src = fs.readFileSync(path.join(__dirname, '../../lib/shorts.ts'), 'utf8');
const { outputText } = ts.transpileModule(src, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const mod = { exports: {} };
new Function('module', 'exports', 'require', outputText)(mod, mod.exports, require);
const shorts = mod.exports;

const item = (position, videoId, title, videoPublishedAt, publishedAt) => ({
  snippet: { position, title, publishedAt, resourceId: { kind: 'youtube#video', videoId } },
  contentDetails: { videoId, ...(videoPublishedAt && { videoPublishedAt }) },
});

// playlistItems.list-ийн 2 хуудас (nextPageToken-оор нийлүүлсэн), дараалал холилдсон
const items = [
  item(2, 'ccc', 'Гурав', '2026-09-03T00:00:00Z', '2026-10-03T00:00:00Z'),
  item(0, 'aaa', '  Нэг  ', '2026-09-01T00:00:00Z', '2026-10-01T00:00:00Z'),
  item(1, 'prv', 'Private video', undefined, '2026-10-02T00:00:00Z'),
  item(3, 'del', 'Deleted video', undefined, '2026-10-04T00:00:00Z'),
  item(4, 'sch', 'Товлосон бичлэг', undefined, '2026-10-05T00:00:00Z'),
  item(5, 'aaa', 'Нэг (давхар)', '2026-09-01T00:00:00Z', '2026-10-06T00:00:00Z'),
  item(6, 'emb', 'Embed хаасан', '2026-09-07T00:00:00Z', '2026-10-07T00:00:00Z'),
  item(7, 'unl', 'Unlisted', '2026-09-08T00:00:00Z', '2026-10-28T00:00:00Z'),
  { snippet: { position: 8, title: 'ID-гүй' }, contentDetails: {} },
];

const parsed = shorts.parsePlaylistItems(items);
assert.deepStrictEqual(parsed.map((v) => v.id), ['aaa', 'ccc', 'emb', 'unl'], 'дараалал, Private/Deleted/давхар хасагдсан');
assert.strictEqual(parsed[0].title, 'Нэг', 'гарчиг trim');
assert.strictEqual(parsed[0].uploadDate, '2026-09-01T00:00:00Z');
assert.strictEqual(parsed[0].addedAt, '2026-10-01T00:00:00Z');
assert.deepStrictEqual(shorts.parsePlaylistItems([]), [], 'хоосон playlist');
assert.deepStrictEqual(shorts.parsePlaylistItems(undefined), [], 'items байхгүй');

// videos.list (part=status): устсан бичлэг хариунд ирдэггүй
const playable = shorts.playableIds([
  { id: 'aaa', status: { privacyStatus: 'public', embeddable: true, uploadStatus: 'processed' } },
  { id: 'ccc', status: { privacyStatus: 'public', embeddable: true, uploadStatus: 'processed' } },
  { id: 'emb', status: { privacyStatus: 'public', embeddable: false, uploadStatus: 'processed' } },
  { id: 'unl', status: { privacyStatus: 'unlisted', embeddable: true, uploadStatus: 'processed' } },
  { id: 'prv', status: { privacyStatus: 'private', embeddable: true, uploadStatus: 'processed' } },
  { id: 'upl', status: { privacyStatus: 'public', embeddable: true, uploadStatus: 'uploaded' } },
]);
const videos = parsed.filter((v) => playable.has(v.id));
assert.deepStrictEqual(videos.map((v) => v.id), ['aaa', 'ccc', 'unl'], 'embed хаасан хасагдсан');

// Индексийн дүрэм, lastmod, «Бүгд»
const topic = (slug, n) => ({ slug, videos: Array.from({ length: n }, (_, i) => ({ id: `${slug}${i}`, title: 't', addedAt: `2026-10-${String(10 + i).padStart(2, '0')}T00:00:00Z` })) });
assert.strictEqual(shorts.isTopicIndexable(topic('a', 4)), false);
assert.strictEqual(shorts.isTopicIndexable(topic('a', 5)), true);
assert.strictEqual(shorts.isAllIndexable([topic('a', 5), topic('b', 4)]), false);
assert.strictEqual(shorts.isAllIndexable([topic('a', 5), topic('b', 5), topic('c', 0)]), true);
assert.strictEqual(shorts.lastAdded(videos), '2026-10-28T00:00:00Z');
assert.strictEqual(shorts.lastAdded([{ id: 'x', title: 'fallback' }]), undefined);
assert.strictEqual(shorts.allShorts([{ videos: [{ id: 'x' }, { id: 'y' }] }, { videos: [{ id: 'x' }] }]).length, 2, '«Бүгд» давхардалгүй');

// JSON-LD: fallback (uploadDate-гүй) бичлэг орохгүй, «<» escape
const ld = shorts.shortsJsonLd([{ id: 'aaa', title: 'A </script>', uploadDate: '2026-09-01T00:00:00Z' }, { id: 'fb', title: 'fallback' }]);
assert.ok(!ld.includes('</script>'), '</script> escape');
const graph = JSON.parse(ld)['@graph'];
assert.strictEqual(graph.length, 1);
assert.deepStrictEqual(Object.keys(graph[0]).sort(), ['@type', 'embedUrl', 'inLanguage', 'name', 'thumbnailUrl', 'uploadDate']);
assert.strictEqual(graph[0].inLanguage, 'mn', 'lang-гүй бичлэг монгол');

// Хэл: JSON-LD-д зөвхөн хуудасны хэлний бичлэг, inLanguage нь бичлэгийн хэл
const enLd = JSON.parse(shorts.shortsJsonLd([
  { id: 'e1', title: 'E', uploadDate: '2026-09-01T00:00:00Z', lang: 'en' },
  { id: 'm1', title: 'M', uploadDate: '2026-09-01T00:00:00Z', lang: 'mn' },
], 'en'))['@graph'];
assert.deepStrictEqual(enLd.map((v) => [v.name, v.inLanguage]), [['E', 'en']]);

// Индекс: fallback (өөр хэлний) бичлэг хуудасны хэлний тоонд орохгүй
const langTopic = (n, lang) => ({ slug: 'x', videos: Array.from({ length: n }, (_, i) => ({ id: `${lang}${i}`, title: 't', lang })) });
assert.strictEqual(shorts.isTopicIndexable(langTopic(5, 'mn'), 'mn'), true);
assert.strictEqual(shorts.isTopicIndexable(langTopic(5, 'mn'), 'en'), false, 'en хуудсанд монгол fallback');
assert.strictEqual(shorts.isTopicIndexable(langTopic(5, 'en'), 'en'), true);
assert.strictEqual(shorts.isAllIndexable([langTopic(5, 'ru'), { slug: 'y', videos: langTopic(5, 'en').videos.map((v) => ({ ...v, id: `y${v.id}` })) }], 'ru'), false, '«Бүгд»: ru 5 + en 5 → ru 5 < 10');

// Сонголтын дараалал: тухайн хэл → англи → монгол
assert.deepStrictEqual(shorts.langChain('ru'), ['ru', 'en', 'mn']);
assert.deepStrictEqual(shorts.langChain('en'), ['en', 'mn']);
assert.deepStrictEqual(shorts.langChain('mn'), ['mn', 'en']);
assert.deepStrictEqual([...shorts.SHORTS_LANGS], ['mn', 'en', 'zh-CN', 'ru', 'ko', 'ja']);
assert.ok(shorts.isShortsLang('zh-CN') && !shorts.isShortsLang('zh') && !shorts.isShortsLang(undefined));

// Playlist ID: шууд ID, холбоосоос list=, хоосон/буруу утга
const ID = 'PLIMfWmpU8Ivs_a-B';
assert.strictEqual(shorts.playlistIdFrom(ID), ID);
assert.strictEqual(shorts.playlistIdFrom(`  ${ID} `), ID);
assert.strictEqual(shorts.playlistIdFrom(`https://www.youtube.com/playlist?list=${ID}`), ID);
assert.strictEqual(shorts.playlistIdFrom(`https://www.youtube.com/watch?v=abc123&list=${ID}&index=2`), ID);
assert.strictEqual(shorts.playlistIdFrom(`https://youtube.com/playlist?list=${ID}&si=xyz`), ID);
assert.strictEqual(shorts.playlistIdFrom(''), '');
assert.strictEqual(shorts.playlistIdFrom(undefined), '');
assert.strictEqual(shorts.playlistIdFrom('https://www.youtube.com/@travelhubmongolia'), '', 'list-гүй холбоос');
// YouTube-ийн шинэ богино хэлбэр (PL + 11 тэмдэгт, «-», «_»-тай) болон хуучин урт (PL + 32) хоёулаа
for (const id of ['PLf5oM-3fIIA8', 'PLK99Vp_4tke8', 'PLN-ZAwnOtUVk', 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf']) {
  assert.strictEqual(shorts.playlistIdFrom(id), id, `ID ${id}`);
  assert.strictEqual(shorts.playlistIdFrom(`https://www.youtube.com/playlist?list=${id}`), id, `холбоос ${id}`);
}

// Статик fallback: 7 сэдэв, хоосон playlist-тай сэдэвт fallback-гүй
assert.strictEqual(shorts.SHORTS_CATEGORIES.length, 7);
assert.strictEqual(shorts.SHORTS_CATEGORIES.filter((c) => c.fallback).length, 6, 'түүхэн эрхмүүдээс бусад нь fallback-тай');

// lib/shortsData.ts-ийн SHORTS_PLAYLISTS: 6 хэл бүрд 7 сэдэв бүгд бий, монголынх бүгд бөглөгдсөн
const dataSrc = fs.readFileSync(path.join(__dirname, '../../lib/shortsData.ts'), 'utf8');
const block = dataSrc.slice(dataSrc.indexOf('SHORTS_PLAYLISTS'), dataSrc.indexOf('export const playlistFor'));
const langBlocks = block.split(/\n  (?='?[\w-]+'?: \{)/).slice(1);
assert.strictEqual(langBlocks.length, 6, '6 хэл');
const seenIds = new Map();
for (const lb of langBlocks) {
  const name = lb.match(/^'?([\w-]+)'?/)[1];
  for (const c of shorts.SHORTS_CATEGORIES) {
    const m = lb.match(new RegExp(`\\n\\s+'?${c.slug}'?: '([^']*)'`));
    assert.ok(m, `${name}: ${c.slug} мөр байхгүй`);
    if (name === 'mn') assert.ok(shorts.playlistIdFrom(m[1]), `mn: ${c.slug} playlist хоосон`);
    else assert.ok(m[1] === '' || shorts.playlistIdFrom(m[1]), `${name}: ${c.slug} утга танигдсангүй`);
    // Нэг playlist хоёр газар орсон бол хуулахдаа алдсан байх магадлалтай
    const id = shorts.playlistIdFrom(m[1]);
    if (id) {
      assert.ok(!seenIds.has(id), `${name}: ${c.slug} playlist ${id} давхардсан (${seenIds.get(id)})`);
      seenIds.set(id, `${name}/${c.slug}`);
    }
  }
}

// Сэдвийн нэр, UI бичвэр: 6 хэл бүрд (lib/shortsI18n.ts)
const i18nSrc = fs.readFileSync(path.join(__dirname, '../../lib/shortsI18n.ts'), 'utf8');
const i18nMod = { exports: {} };
new Function('module', 'exports', 'require', ts.transpileModule(i18nSrc, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText)(i18nMod, i18nMod.exports, require);
const { shortsName, shortsText } = i18nMod.exports;
for (const lang of shorts.SHORTS_LANGS) {
  const s = shortsText(lang);
  assert.ok(s && s.viewAll && s.count(3) && s.play('x').includes('x'), `${lang}: UI бичвэр`);
  for (const c of shorts.SHORTS_CATEGORIES) {
    const n = shortsName(c, lang);
    assert.ok(n.tab && n.title, `${lang}: ${c.slug} нэр`);
    if (lang !== 'mn') assert.notStrictEqual(n.tab, c.tab, `${lang}: ${c.slug} орчуулаагүй`);
  }
}
assert.strictEqual(shortsName(shorts.SHORTS_CATEGORIES[0], 'mn').tab, 'Уламжлалт ёс заншил');
assert.strictEqual(shortsName(shorts.SHORTS_CATEGORIES[0], 'en').tab, 'Traditions');

console.log('OK: shorts задлалт, шүүлтүүр, хэл, playlist ID, индексийн дүрэм, JSON-LD бүгд зөв');
