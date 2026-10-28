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
assert.deepStrictEqual(Object.keys(graph[0]).sort(), ['@type', 'embedUrl', 'name', 'thumbnailUrl', 'uploadDate']);

// Статик fallback: 7 playlist, хоосон playlist-тай сэдэвт fallback-гүй
assert.strictEqual(shorts.SHORTS_CATEGORIES.length, 7);
assert.ok(shorts.SHORTS_CATEGORIES.every((c) => c.playlistId));
assert.strictEqual(shorts.SHORTS_CATEGORIES.filter((c) => c.fallback).length, 6, 'түүхэн эрхмүүдээс бусад нь fallback-тай');

console.log('OK: shorts задлалт, шүүлтүүр, индексийн дүрэм, JSON-LD бүгд зөв');
