// Локал Contentful экспортыг (export-contentful.js) уншина. Contentful руу хүсэлт илгээхгүй.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');

// Хамгийн сүүлийн бүрэн экспорт (meta.json-той) хавтас
function latestExportDir() {
  const base = path.join(ROOT, 'backups');
  const dirs = fs
    .readdirSync(base)
    .filter((d) => d.startsWith('contentful-export-') && fs.existsSync(path.join(base, d, 'meta.json')))
    .sort();
  if (!dirs.length) throw new Error('Экспорт олдсонгүй: эхлээд scripts/payload/export-contentful.js');
  return path.join(base, dirs[dirs.length - 1]);
}

function loadExport(dir) {
  dir = dir ? path.resolve(dir) : process.env.CF_EXPORT_DIR ? path.resolve(process.env.CF_EXPORT_DIR) : latestExportDir();
  const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const ex = {
    dir,
    meta: read('meta.json'),
    locales: read('locales.json'),
    contentTypes: read('content_types.json'),
    entries: read('entries.cma.json'),
    assets: read('assets.cma.json'),
    publishedEntries: read('entries.cda.json'),
    publishedAssets: read('assets.cda.json'),
  };
  ex.entryById = new Map(ex.entries.map((e) => [e.sys.id, e]));
  ex.assetById = new Map(ex.assets.map((a) => [a.sys.id, a]));
  ex.publishedEntryById = new Map(ex.publishedEntries.map((e) => [e.sys.id, e]));
  ex.publishedAssetById = new Map(ex.publishedAssets.map((a) => [a.sys.id, a]));
  ex.contentTypeById = new Map(ex.contentTypes.map((c) => [c.sys.id, c]));
  return ex;
}

// Contentful entry-ийн төлөв
const statusOf = (sys) =>
  sys.archivedVersion ? 'archived' : !sys.publishedVersion ? 'draft' : sys.version > sys.publishedVersion + 1 ? 'changed' : 'published';

module.exports = { loadExport, latestExportDir, statusOf, ROOT };
