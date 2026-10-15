// TIC 1-р багцын Contentful schema өөрчлөлт (дахин ажиллуулахад аюулгүй):
//  - province төрөлд sourceUrl, needsReplacement талбар (сайтад харагдахгүй, зөвхөн Contentful-д)
//  - шинэ soum төрөл (/province/<aimag>/<sum>)
// Ажиллуулахаас өмнө backup: scripts/contentful/00-backup.ps1
const { cma } = require('./_cma');

const SLUG_RE = '^[a-z0-9]+(?:-[a-z0-9]+)*$';

const f = (id, name, type, extra = {}) => ({
  id, name, type, localized: false, required: false, disabled: false, omitted: false, validations: [], ...extra,
});

// Шилжүүлэлтийн тэмдэг: бүх TIC-ээс импортлох төрөлд ижил
const MIGRATION_FIELDS = [
  f('sourceUrl', 'TIC эх URL (сайтад харагдахгүй)', 'Symbol'),
  f('needsReplacement', 'Солих шаардлагатай (сайтад харагдахгүй)', 'Boolean'),
];

const HELP = {
  sourceUrl: 'Touristinfocenter.mn-ийн эх нийтлэлийн хаяг. Сайт дээр харагдахгүй.',
  needsReplacement:
    'Тийм = «Монгол орны лавлах», «Улаан ном»-оос авсан текст эсвэл гуравдагч сайтын зурагтай. Нийтлэхээс өмнө солих/эрх тодруулах. Сайт дээр харагдахгүй.',
  ownPage: 'Тийм = /province/<аймаг>/<сум> тусдаа хуудастай (150-аас дээш үгтэй). Үгүй = аймгийн хуудсанд товч жагсаалтад харагдана.',
};

const SOUM_FIELDS = [
  f('title', 'Нэр', 'Symbol', { localized: true, required: true }),
  f('slug', 'Slug', 'Symbol', { required: true, validations: [{ regexp: { pattern: SLUG_RE } }] }),
  f('province', 'Аймаг', 'Link', { required: true, linkType: 'Entry', validations: [{ linkContentType: ['province'] }] }),
  f('ownPage', 'Тусдаа хуудастай', 'Boolean'),
  f('image', 'Зураг', 'Link', { linkType: 'Asset', validations: [{ linkMimetypeGroup: ['image'] }] }),
  f('center', 'Сумын төв', 'Symbol', { localized: true }),
  f('population', 'Хүн ам', 'Symbol', { localized: true }),
  f('area', 'Нутаг дэвсгэр', 'Symbol', { localized: true }),
  f('body', 'Танилцуулга', 'RichText', { localized: true }),
  f('seoTitle', 'SEO гарчиг', 'Symbol', { localized: true, validations: [{ size: { max: 60 } }] }),
  f('seoDescription', 'SEO тайлбар', 'Text', { localized: true, validations: [{ size: { max: 160 } }] }),
  ...MIGRATION_FIELDS,
  f('reviewedBy', 'Шалгасан', 'Symbol'),
  f('lastUpdated', 'Сүүлд шинэчилсэн', 'Date'),
];

async function activate(id) {
  const ct = await cma('GET', `/content_types/${id}`);
  if (ct.sys.publishedVersion && ct.sys.version === ct.sys.publishedVersion + 1) return ct;
  return cma('PUT', `/content_types/${id}/published`, { version: ct.sys.version });
}

async function setHelp(ctId, ids) {
  const ei = await cma('GET', `/content_types/${ctId}/editor_interface`);
  let changed = false;
  for (const id of ids) {
    const c = ei.controls.find((x) => x.fieldId === id);
    if (!c) continue;
    if (c.settings?.helpText === HELP[id]) continue;
    c.settings = { ...(c.settings || {}), helpText: HELP[id] };
    if (id === 'needsReplacement' || id === 'ownPage') c.widgetId = c.widgetId || 'boolean';
    changed = true;
  }
  if (changed) {
    await cma('PUT', `/content_types/${ctId}/editor_interface`, {
      version: ei.sys.version,
      body: { controls: ei.controls, sidebar: ei.sidebar, editorLayout: ei.editorLayout, groupControls: ei.groupControls },
    });
  }
}

(async () => {
  // 1. province: шилжүүлэлтийн талбарууд
  const prov = await cma('GET', '/content_types/province');
  const missing = MIGRATION_FIELDS.filter((mf) => !prov.fields.some((x) => x.id === mf.id));
  if (missing.length) {
    await cma('PUT', '/content_types/province', {
      version: prov.sys.version,
      body: { name: prov.name, description: prov.description, displayField: prov.displayField, fields: [...prov.fields, ...missing] },
    });
    console.log('province: талбар нэмэв', missing.map((x) => x.id).join(', '));
  }
  await activate('province');
  await setHelp('province', ['sourceUrl', 'needsReplacement']);

  // 2. soum төрөл
  let soum = await cma('GET', '/content_types/soum');
  if (!soum) {
    soum = await cma('PUT', '/content_types/soum', {
      body: {
        name: 'Сум (soum)',
        description: 'Аймгийн сум, дүүрэг. 150-аас дээш үгтэй нь /province/<аймаг>/<сум> хуудастай, бусад нь аймгийн хуудсанд жагсаалтаар.',
        displayField: 'title',
        fields: SOUM_FIELDS,
      },
    });
    console.log('soum төрөл үүсгэв');
  } else {
    const add = SOUM_FIELDS.filter((sf) => !soum.fields.some((x) => x.id === sf.id));
    if (add.length) {
      await cma('PUT', '/content_types/soum', {
        version: soum.sys.version,
        body: { name: soum.name, description: soum.description, displayField: soum.displayField, fields: [...soum.fields, ...add] },
      });
      console.log('soum: талбар нэмэв', add.map((x) => x.id).join(', '));
    }
  }
  await activate('soum');
  await setHelp('soum', ['sourceUrl', 'needsReplacement', 'ownPage']);
  console.log('schema бэлэн');
})().catch((e) => { console.error(e.message); process.exit(1); });
