// TIC 3, 5, 6-р сэдвийн Contentful schema (дахин ажиллуулахад аюулгүй).
//   place    (шинэ) — тусгай хамгаалалттай газар, музей/театр/соёлын төв, рашаан сувилал. Аймагт холбогдоно.
//   species  (шинэ) — ан амьтан, шувуу, ургамал. Шувууны богино нийтлэл нь каталогийн мөр (ownPage=false).
//   heritagePlace, destination — TIC-ийн хотын дурсгалт газар, нэгтгэсэн давхардлын талбарууд
//     (provinceRef, protectedCategory, sourceUrl, needsReplacement).
// Ажиллуулахаас өмнө backup: scripts/contentful/00-backup.ps1
const { cma } = require('./_cma');
const { PLACE_CATEGORIES, PROTECTED_CATEGORIES, SPECIES_GROUPS } = require('./_batch03-06');

const SLUG_RE = '^[a-z0-9]+(?:-[a-z0-9]+)*$';
const f = (id, name, type, extra = {}) => ({
  id, name, type, localized: false, required: false, disabled: false, omitted: false, validations: [], ...extra,
});
const provinceLink = (id, name) =>
  f(id, name, 'Link', { linkType: 'Entry', validations: [{ linkContentType: ['province'] }] });

const COMMON_TAIL = [
  f('seoTitle', 'SEO гарчиг', 'Symbol', { localized: true, validations: [{ size: { max: 60 } }] }),
  f('seoDescription', 'SEO тайлбар', 'Text', { localized: true, validations: [{ size: { max: 160 } }] }),
  f('sourceUrl', 'TIC эх URL (сайтад харагдахгүй)', 'Symbol'),
  f('needsReplacement', 'Солих шаардлагатай (сайтад харагдахгүй)', 'Boolean'),
  f('reviewedBy', 'Шалгасан', 'Symbol'),
  f('lastUpdated', 'Сүүлд шинэчилсэн', 'Date'),
];

const TYPES = {
  place: {
    name: 'Газар (place)',
    description:
      'TIC-ээс шилжүүлсэн газар: тусгай хамгаалалттай газар (/destination/protected/<slug>), музей, театр, соёлын төв (/things-to-do/museums/<slug>), рашаан сувилал (/things-to-do/wellness/<slug>).',
    displayField: 'title',
    fields: [
      f('title', 'Нэр', 'Symbol', { localized: true, required: true }),
      f('slug', 'Slug', 'Symbol', { required: true, validations: [{ unique: true }, { regexp: { pattern: SLUG_RE } }] }),
      f('category', 'Ангилал', 'Symbol', { required: true, validations: [{ in: PLACE_CATEGORIES }] }),
      provinceLink('province', 'Харьяалах аймаг'),
      f('soum', 'Сум, дүүрэг', 'Symbol'),
      f('image', 'Зураг', 'Link', { linkType: 'Asset', validations: [{ linkMimetypeGroup: ['image'] }] }),
      f('body', 'Танилцуулга', 'RichText', { localized: true }),
      ...COMMON_TAIL,
    ],
    help: {
      category:
        'strictly-protected (Дархан цаазат), national-park (Байгалийн цогцолборт), nature-reserve (Байгалийн нөөц), natural-monument (Байгалийн дурсгалт), museum (Музей), theatre (Театр), culture-center (Соёлын төв), sanatorium (Рашаан сувилал).',
      province: 'Аймгийн хуудсанд «Энэ аймгийн …» хэсэгт жагсаагдана.',
      sourceUrl: 'Touristinfocenter.mn-ийн эх нийтлэлийн хаяг. Сайт дээр харагдахгүй.',
      needsReplacement: 'Тийм = лавлах ном/гуравдагч сайтаас авсан текст эсвэл зурагтай. Нийтлэхээс өмнө солих/эрх тодруулах.',
    },
    dropdown: ['category'],
  },
  species: {
    name: 'Амьтан, ургамал (species)',
    description:
      '«Түүх & өв → Байгаль»: ан амьтан (/about/nature/wildlife), шувуу (/about/nature/birds), ургамал (/about/nature/plants). ownPage=false бол зөвхөн каталогийн мөр (#slug).',
    displayField: 'title',
    fields: [
      f('title', 'Монгол нэр', 'Symbol', { localized: true, required: true }),
      f('slug', 'Slug', 'Symbol', { required: true, validations: [{ unique: true }, { regexp: { pattern: SLUG_RE } }] }),
      f('latinName', 'Латин нэр', 'Symbol'),
      f('group', 'Бүлэг', 'Symbol', { required: true, validations: [{ in: SPECIES_GROUPS }] }),
      f('ownPage', 'Тусдаа хуудастай', 'Boolean'),
      f('order', 'Дараалал (TIC жагсаалтын)', 'Integer'),
      f('image', 'Зураг', 'Link', { linkType: 'Asset', validations: [{ linkMimetypeGroup: ['image'] }] }),
      f('summary', 'Товч тайлбар (каталог)', 'Text', { localized: true, validations: [{ size: { max: 600 } }] }),
      f('body', 'Нийтлэл', 'RichText', { localized: true }),
      ...COMMON_TAIL,
    ],
    help: {
      group: 'mammal (хөхтөн), bird (шувуу), reptile (хоёр нутагтан, мөлхөгч), fish (загас), invertebrate (сээр нуруугүй), plant (ургамал).',
      ownPage: 'Тийм = /about/nature/<бүлэг>/<slug> хуудастай. Үгүй = зөвхөн каталогийн мөр (/about/nature/<бүлэг>#<slug>).',
      summary: 'Каталогийн мөрөнд харагдах товч тайлбар.',
      sourceUrl: 'Touristinfocenter.mn-ийн эх нийтлэлийн хаяг. Сайт дээр харагдахгүй.',
      needsReplacement: 'Тийм = «Улаан ном», лавлах ном, гуравдагч сайтаас авсан текст/зурагтай.',
    },
    dropdown: ['group'],
  },
};

// Одоо байгаа төрлүүдэд нэмэх талбарууд
const EXTRA = {
  heritagePlace: [
    provinceLink('provinceRef', 'Харьяалах аймаг (холбоос)'),
    f('protectedCategory', 'Тусгай хамгаалалтын ангилал', 'Symbol', { validations: [{ in: PROTECTED_CATEGORIES }] }),
    f('sourceUrl', 'TIC эх URL (сайтад харагдахгүй)', 'Symbol'),
    f('needsReplacement', 'Солих шаардлагатай (сайтад харагдахгүй)', 'Boolean'),
  ],
  destination: [
    provinceLink('provinceRef', 'Харьяалах аймаг (холбоос)'),
    f('protectedCategory', 'Тусгай хамгаалалтын ангилал', 'Symbol', { validations: [{ in: PROTECTED_CATEGORIES }] }),
    f('sourceUrl', 'TIC эх URL (сайтад харагдахгүй)', 'Symbol'),
    f('needsReplacement', 'Солих шаардлагатай (сайтад харагдахгүй)', 'Boolean'),
  ],
};

async function publishType(id) {
  const ct = await cma('GET', `/content_types/${id}`);
  if (!(ct.sys.publishedVersion && ct.sys.version === ct.sys.publishedVersion + 1)) {
    await cma('PUT', `/content_types/${id}/published`, { version: ct.sys.version });
  }
}

async function editorHelp(id, help, dropdown = []) {
  const ei = await cma('GET', `/content_types/${id}/editor_interface`);
  for (const c of ei.controls) {
    if (help[c.fieldId]) c.settings = { ...(c.settings || {}), helpText: help[c.fieldId] };
    if (dropdown.includes(c.fieldId)) c.widgetId = 'dropdown';
  }
  await cma('PUT', `/content_types/${id}/editor_interface`, {
    version: ei.sys.version,
    body: { controls: ei.controls, sidebar: ei.sidebar, editorLayout: ei.editorLayout, groupControls: ei.groupControls },
  });
}

(async () => {
  for (const [id, t] of Object.entries(TYPES)) {
    let ct = await cma('GET', `/content_types/${id}`);
    const body = { name: t.name, description: t.description, displayField: t.displayField };
    if (!ct) {
      await cma('PUT', `/content_types/${id}`, { body: { ...body, fields: t.fields } });
      console.log(id, 'төрөл үүсгэв');
    } else {
      const add = t.fields.filter((x) => !ct.fields.some((y) => y.id === x.id));
      if (add.length) {
        await cma('PUT', `/content_types/${id}`, { version: ct.sys.version, body: { ...body, fields: [...ct.fields, ...add] } });
        console.log(id, 'талбар нэмэв', add.map((x) => x.id).join(', '));
      }
    }
    await publishType(id);
    await editorHelp(id, t.help, t.dropdown);
  }
  for (const [id, fields] of Object.entries(EXTRA)) {
    const ct = await cma('GET', `/content_types/${id}`);
    const add = fields.filter((x) => !ct.fields.some((y) => y.id === x.id));
    if (add.length) {
      const { name, description, displayField } = ct;
      await cma('PUT', `/content_types/${id}`, { version: ct.sys.version, body: { name, description, displayField, fields: [...ct.fields, ...add] } });
      console.log(id, 'талбар нэмэв', add.map((x) => x.id).join(', '));
    }
    await publishType(id);
    await editorHelp(id, { protectedCategory: 'Тусгай хамгаалалттай газрын жагсаалтад (/destination/protected …) оруулах ангилал.', provinceRef: 'Аймгийн хуудсанд жагсаагдах аймаг.' });
  }
  console.log('schema бэлэн');
})().catch((e) => { console.error(e.message); process.exit(1); });
