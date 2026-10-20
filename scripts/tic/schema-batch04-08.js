// TIC 4, 7, 8-р багцын Contentful schema өөрчлөлт (дахин ажиллуулахад аюулгүй, зөвхөн нэмнэ):
//   place.category  — `landscape` (cate1 байгалийн газар, /destination/landscapes/<slug>)
//   event, localProvider — sourceUrl, needsReplacement, needsVerification (+ event.dateText)
//   story.topic — `news`; story — sourceUrl, needsReplacement, publishedDate
const { cma } = require('./_cma');

const DRY = process.argv.includes('--dry');

async function addInValues(typeId, fieldId, values) {
  const ct = await cma('GET', `/content_types/${typeId}`);
  const field = ct.fields.find((f) => f.id === fieldId);
  const v = field.validations.find((x) => x.in);
  const missing = values.filter((x) => !v.in.includes(x));
  if (!missing.length) return console.log(`${typeId}.${fieldId}: бэлэн`);
  if (DRY) return console.log(`[dry] ${typeId}.${fieldId} += ${missing}`);
  v.in.push(...missing);
  const { name, description, displayField, fields } = ct;
  const upd = await cma('PUT', `/content_types/${typeId}`, { version: ct.sys.version, body: { name, description, displayField, fields } });
  await cma('PUT', `/content_types/${typeId}/published`, { version: upd.sys.version });
  console.log(`${typeId}.${fieldId} += ${missing}`);
}

async function addFields(typeId, newFields) {
  const ct = await cma('GET', `/content_types/${typeId}`);
  const add = newFields.filter((x) => !ct.fields.some((y) => y.id === x.id));
  if (!add.length) return console.log(`${typeId}: талбар бэлэн`);
  if (DRY) return console.log(`[dry] ${typeId} += ${add.map((x) => x.id)}`);
  const { name, description, displayField } = ct;
  const upd = await cma('PUT', `/content_types/${typeId}`, { version: ct.sys.version, body: { name, description, displayField, fields: [...ct.fields, ...add] } });
  await cma('PUT', `/content_types/${typeId}/published`, { version: upd.sys.version });
  console.log(`${typeId} += ${add.map((x) => x.id)}`);
}

const f = (id, name, type, extra = {}) => ({ id, name, type, localized: false, required: false, disabled: false, omitted: false, validations: [], ...extra });

module.exports = { addInValues, addFields, f };

if (require.main === module) {
  (async () => {
    await addInValues('place', 'category', ['landscape']);
    // 7-р багц: event (TIC cate20), localProvider (cate21 буудал, cate22 бааз = providerType accommodation)
    const tic = [
      f('sourceUrl', 'TIC эх URL (сайтад харагдахгүй)', 'Symbol'),
      f('needsReplacement', 'Солих шаардлагатай (сайтад харагдахгүй)', 'Boolean'),
      f('needsVerification', 'TIC-ээс авсан, шалгах (утас, үнэ, огноо)', 'Boolean'),
    ];
    await addFields('event', [...tic, f('dateText', 'Огноо (TIC-ийн бичвэрээр)', 'Symbol')]);
    await addFields('localProvider', tic);
    // 8-р багц: мэдээ = story, topic «news» (consentObtained=false, /stories/news/<slug>)
    await addInValues('story', 'topic', ['news']);
    await addFields('story', [...tic.slice(0, 2), f('publishedDate', 'Анх нийтэлсэн огноо (TIC)', 'Date')]);
    console.log('schema бэлэн');
  })().catch((e) => { console.error(e.message); process.exit(1); });
}
