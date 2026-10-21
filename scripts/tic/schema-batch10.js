// TIC 10-р багцын Contentful schema (дахин ажиллуулахад аюулгүй): шинэ cultureArticle төрөл.
// historyArticle-тай ижил талбар, зөвхөн `period`-ийн оронд `section`:
//   ethnic-groups → /about/culture/ethnic-groups/<slug>   (cate14 TypeID 1, угсаатан)
//   people        → /about/history/people/<slug>         (cate14 TypeID 3, түүхэн хүмүүс)
//   religion      → /about/culture/religion/<slug>       (cate15, шашин шүтлэг)
//   traditions    → /about/traditions/<slug>             (cate16, зан заншил)
// historyArticle-ийг ашиглаагүй шалтгаан: түүний /about/history/<slug> route ба үеийн жагсаалт эдгээрийг буруу хаягаар давхар гаргана.
const { cma } = require('./_cma');

const SECTIONS = ['ethnic-groups', 'people', 'religion', 'traditions'];
const SLUG_RE = '^[a-z0-9]+(?:-[a-z0-9]+)*$';
const f = (id, name, type, extra = {}) => ({
  id, name, type, localized: false, required: false, disabled: false, omitted: false, validations: [], ...extra,
});

const FIELDS = [
  f('title', 'Гарчиг', 'Symbol', { localized: true, required: true }),
  f('slug', 'Slug', 'Symbol', { required: true, validations: [{ regexp: { pattern: SLUG_RE } }] }),
  f('section', 'Хэсэг', 'Symbol', { required: true, validations: [{ in: SECTIONS }] }),
  f('order', 'Дараалал', 'Integer'),
  f('image', 'Зураг', 'Link', { linkType: 'Asset', validations: [{ linkMimetypeGroup: ['image'] }] }),
  f('body', 'Нийтлэл', 'RichText', { localized: true }),
  f('seoTitle', 'SEO гарчиг', 'Symbol', { localized: true, validations: [{ size: { max: 60 } }] }),
  f('seoDescription', 'SEO тайлбар', 'Text', { localized: true, validations: [{ size: { max: 160 } }] }),
  f('sourceUrl', 'TIC эх URL (сайтад харагдахгүй)', 'Symbol'),
  f('needsReplacement', 'Солих шаардлагатай (сайтад харагдахгүй)', 'Boolean'),
];

const HELP = {
  section: 'ethnic-groups = Угсаатнууд (/about/culture/ethnic-groups), people = Түүхэн хүмүүс (/about/history/people), religion = Шашин шүтлэг (/about/culture/religion), traditions = Зан заншил (/about/traditions).',
  slug: 'Хэсэг дотроо давтагдахгүй.',
  sourceUrl: 'Touristinfocenter.mn-ийн эх нийтлэлийн хаяг. Сайт дээр харагдахгүй.',
  needsReplacement: 'Тийм = «Монгол орны лавлах»/гуравдагч эх сурвалжийн текст эсвэл TIC-ээс өөр сайтын зурагтай. Сайт дээр харагдахгүй.',
};

(async () => {
  let ct = await cma('GET', '/content_types/cultureArticle');
  const body = {
    name: 'Соёл, түүхийн нийтлэл (cultureArticle)',
    description: 'TIC cate14 (угсаатан, түүхэн хүмүүс), cate15 (шашин), cate16 (зан заншил). Хаяг нь `section`-оос хамаарна.',
    displayField: 'title',
  };
  if (!ct) {
    ct = await cma('PUT', '/content_types/cultureArticle', { body: { ...body, fields: FIELDS } });
    console.log('cultureArticle төрөл үүсгэв');
  } else {
    const add = FIELDS.filter((x) => !ct.fields.some((y) => y.id === x.id));
    if (add.length) {
      ct = await cma('PUT', '/content_types/cultureArticle', { version: ct.sys.version, body: { ...body, fields: [...ct.fields, ...add] } });
      console.log('талбар нэмэв', add.map((x) => x.id).join(', '));
    }
  }
  ct = await cma('GET', '/content_types/cultureArticle');
  if (!(ct.sys.publishedVersion && ct.sys.version === ct.sys.publishedVersion + 1)) {
    await cma('PUT', '/content_types/cultureArticle/published', { version: ct.sys.version });
    console.log('төрлийг идэвхжүүлэв (content type publish)');
  }
  const ei = await cma('GET', '/content_types/cultureArticle/editor_interface');
  let changed = false;
  for (const c of ei.controls) {
    if (HELP[c.fieldId] && c.settings?.helpText !== HELP[c.fieldId]) {
      c.settings = { ...(c.settings || {}), helpText: HELP[c.fieldId] };
      changed = true;
    }
  }
  if (changed) await cma('PUT', '/content_types/cultureArticle/editor_interface', { version: ei.sys.version, body: { controls: ei.controls } });
  console.log('OK');
})().catch((e) => { console.error(e.message); process.exit(1); });
