// TIC 2-р багцын Contentful schema (дахин ажиллуулахад аюулгүй): шинэ historyArticle төрөл.
// «Монголын тухай → Монголын түүх» (/about/history) хуудасны үеүдэд (period = хэсгийн anchor id)
// жагсаагдаж, /about/history/<slug> тусдаа хуудастай нийтлэл.
// Ажиллуулахаас өмнө backup: scripts/contentful/00-backup.ps1
const { cma } = require('./_cma');
const { PERIODS } = require('./_batch02');

const SLUG_RE = '^[a-z0-9]+(?:-[a-z0-9]+)*$';
const f = (id, name, type, extra = {}) => ({
  id, name, type, localized: false, required: false, disabled: false, omitted: false, validations: [], ...extra,
});

const FIELDS = [
  f('title', 'Гарчиг', 'Symbol', { localized: true, required: true }),
  f('slug', 'Slug', 'Symbol', { required: true, validations: [{ unique: true }, { regexp: { pattern: SLUG_RE } }] }),
  f('period', 'Үе (түүхийн хуудасны хэсэг)', 'Symbol', { required: true, validations: [{ in: PERIODS }] }),
  f('order', 'Үе доторх дараалал', 'Integer'),
  f('image', 'Зураг', 'Link', { linkType: 'Asset', validations: [{ linkMimetypeGroup: ['image'] }] }),
  f('body', 'Нийтлэл', 'RichText', { localized: true }),
  f('seoTitle', 'SEO гарчиг', 'Symbol', { localized: true, validations: [{ size: { max: 60 } }] }),
  f('seoDescription', 'SEO тайлбар', 'Text', { localized: true, validations: [{ size: { max: 160 } }] }),
  f('sourceUrl', 'TIC эх URL (сайтад харагдахгүй)', 'Symbol'),
  f('needsReplacement', 'Солих шаардлагатай (сайтад харагдахгүй)', 'Boolean'),
  f('reviewedBy', 'Шалгасан', 'Symbol'),
  f('lastUpdated', 'Сүүлд шинэчилсэн', 'Date'),
];

const HELP = {
  period:
    'Түүхийн хуудасны аль хэсэгт жагсаах: ancient-land (Эртний), hunnu-empires (Хүннү ба эртний төрт улсууд), great-mongol (Их Монгол Улс), mongol-empire (Монголын эзэнт гүрэн), xvii-xix-century, xx-century, modern-mongolia, themes (Сэдэвчилсэн түүх).',
  order: 'Тухайн үеийн жагсаалт дахь байр (бага нь эхэнд).',
  sourceUrl: 'Touristinfocenter.mn-ийн эх нийтлэлийн хаяг. Сайт дээр харагдахгүй.',
  needsReplacement:
    'Тийм = «Монгол орны лавлах»-аас авсан текст эсвэл гуравдагч сайтын зурагтай. Нийтлэхээс өмнө солих/эрх тодруулах. Сайт дээр харагдахгүй.',
};

(async () => {
  let ct = await cma('GET', '/content_types/historyArticle');
  const body = {
    name: 'Түүхийн нийтлэл (historyArticle)',
    description: '«Монголын тухай → Монголын түүх»: /about/history хуудасны үеүдэд жагсаагдах, /about/history/<slug> хуудастай нийтлэл (TIC cate14).',
    displayField: 'title',
  };
  if (!ct) {
    ct = await cma('PUT', '/content_types/historyArticle', { body: { ...body, fields: FIELDS } });
    console.log('historyArticle төрөл үүсгэв');
  } else {
    const add = FIELDS.filter((x) => !ct.fields.some((y) => y.id === x.id));
    if (add.length) {
      ct = await cma('PUT', '/content_types/historyArticle', { version: ct.sys.version, body: { ...body, fields: [...ct.fields, ...add] } });
      console.log('талбар нэмэв', add.map((x) => x.id).join(', '));
    }
  }
  ct = await cma('GET', '/content_types/historyArticle');
  if (!(ct.sys.publishedVersion && ct.sys.version === ct.sys.publishedVersion + 1)) {
    await cma('PUT', '/content_types/historyArticle/published', { version: ct.sys.version });
  }
  const ei = await cma('GET', '/content_types/historyArticle/editor_interface');
  for (const c of ei.controls) {
    if (HELP[c.fieldId]) c.settings = { ...(c.settings || {}), helpText: HELP[c.fieldId] };
    if (c.fieldId === 'period') c.widgetId = 'dropdown';
  }
  await cma('PUT', '/content_types/historyArticle/editor_interface', {
    version: ei.sys.version,
    body: { controls: ei.controls, sidebar: ei.sidebar, editorLayout: ei.editorLayout, groupControls: ei.groupControls },
  });
  console.log('schema бэлэн');
})().catch((e) => { console.error(e.message); process.exit(1); });
