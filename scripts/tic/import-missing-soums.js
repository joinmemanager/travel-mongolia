// TIC-д нийтлэлгүй 8 сум → Contentful soum (Draft, publish хийхгүй).
// Эх текст: docs/plan/missing-soums-texts.md (эзэмшигчийн өгсөн, Travel Hub өөрөө бичсэн).
//   node scripts/tic/import-missing-soums.js --dry   # Contentful-д бичихгүй, тайлан
//   node scripts/tic/import-missing-soums.js         # импорт + docs/plan/missing-soums-todo.md
//
// Дүрэм:
//  - Бүтэц: Танилцуулга (догол мөр) → дугаартай хэсэг бүр heading-3 → «Нэр: утга» мөр бүр догол мөр (нэр нь тод).
//  - «[нэмэх: …]» мөрийг сайтад гаргахгүй, missing-soums-todo.md-д жагсаана. Агуулгагүй үлдсэн хэсгийг (гарчиг) хасна.
//  - slug: 1б багцын адил аймаг доторх сумын нэр (хаяг /province/<аймаг>/<сум> тул өөр аймгийн ижил нэртэй сумтай
//    давхцахгүй). Аймаг дотроо давхцвал зогсоно.
//  - Баянхонгор сумын entry аль хэдийн (гараар, Draft) бий: түүнийг бөглөнө, slug-ийг өөрчлөхгүй.
//  - sourceUrl хоосон, needsReplacement=false. ownPage: 1б багцын адил 150-аас дээш үг.
//  - Idempotent: entry id тогтмол (th-soum-<аймаг>-<сум>).
const fs = require('fs');
const path = require('path');
const { cma, fv, ROOT, LOCALE, callCount } = require('./_cma');
const { checkBudget } = require('./_budget');
const { seoTitle } = require('./_seo');
const { wordCount, plainText } = require('./_html');

const DRY = process.argv.includes('--dry');
const L = (v) => ({ [LOCALE]: v });
const SRC = path.join(ROOT, 'docs', 'plan', 'missing-soums-texts.md');
const TODO = path.join(ROOT, 'docs', 'plan', 'missing-soums-todo.md');

// Аймгийн нэр → slug
const PROVINCE = { Баянхонгор: 'bayankhongor', Дорноговь: 'dornogov', Увс: 'uvs', 'Баян-Өлгий': 'bayan-ulgii', Хөвсгөл: 'khuvsgul' };

// Гараар бичсэн тоо баримт (текстээс) ба SEO тайлбар (120–155 тэмдэгт)
const META = {
  bayankhongor: {
    existingId: 'sSy2hhvn66fJfGagZeRKL',
    population: '33,000 орчим',
    seo: 'Баянхонгор сум — Хангай ба Говийн заагт, Туйн голын эрэгт орших аймгийн төв: түүх, газар зүй, хүн ам, өмнөд Монголын аялалын түшиц газар.',
  },
  'bayan-ovoo': {
    population: '2,400 орчим',
    area: '3,244 км²',
    seo: 'Баянхонгор аймгийн Баян-Овоо сум: аймгийн төвөөс 26 км, Хангайн өндөр уулс, хөндий, говийн шинж хосолсон 3,244 км² нутаг, 4 баг, мал аж ахуй.',
  },
  sainshand: {
    population: '28,000 орчим (2022)',
    seo: 'Сайншанд — Дорноговь аймгийн төв, Трансмонголын төмөр замын дагуух говийн хот: Данзанравжаагийн өв, Хамрын хийд, Шамбалын орон руу аялах үүд.',
  },
  ulaangom: {
    population: '39,000 орчим (2024)',
    seo: 'Улаангом — Хархираа уулын бэлд, Увс нуурын ойролцоо орших Увс аймгийн төв: 1686 оноос суурьшсан түүх, эрс тэс уур амьсгал, үзэх газрууд.',
  },
  ulgii: {
    population: '50,000 орчим (2024)',
    seo: 'Өлгий — Ховд голын эрэгт орших Баян-Өлгий аймгийн төв, казах соёлын төв: бүргэдийн баяр, гар урлал, Алтай Таван Богд руу аялах эхлэл.',
  },
  rashaant: {
    population: '3,600 орчим',
    area: '1,980 орчим км²',
    seo: 'Хөвсгөл аймгийн Рашаант сум: Хялганатын хийдийн дэргэд үүссэн түүх, Мөрөнгөөс 154 км, 5 баг, 3,600 орчим хүн, мал аж ахуй ба газар тариалан.',
  },
  renchinlkhumbe: {
    center: 'Зөөлөн',
    population: '4,900 орчим',
    area: '8,400–8,850 км²',
    seo: 'Хөвсгөлийн Рэнчинлхүмбэ сум — Дархадын хотгорын алслагдсан, онгон нутаг: Зөөлөнгийн хүрээ, дархад угсаатан, бөөгийн уламжлал, мөнх цэвдэг.',
  },
  tsetserleg: {
    center: 'Халбан',
    area: '7,480 км²',
    seo: 'Хөвсгөл аймгийн Цэцэрлэг сум: Тэсийн хүрээний түүх, Халбан төв, 7,480 км² бэлчээр, ой тайга бүхий нутаг, Могойн голын нүүрсний уурхай.',
  },
};

const text = (value, marks = []) => ({ nodeType: 'text', value, marks: marks.map((type) => ({ type })), data: {} });
const para = (...content) => ({ nodeType: 'paragraph', data: {}, content });
const h3 = (value) => ({ nodeType: 'heading-3', data: {}, content: [text(value)] });
const TODO_RE = /\s*\[нэмэх:\s*([^\]]+)\]\s*/g;

function parse(md) {
  // «1. Баянхонгор сум (Баянхонгор) · bayankhongor» — сумын толгой
  const HEAD = /^\d+\.\s+(.+?)\s+\((.+?)\)\s+·\s+([a-z0-9-]+)\s*$/;
  const lines = md.split(/\r?\n/);
  const soums = [];
  let cur = null;
  for (const raw of lines) {
    const line = raw.trim();
    const h = HEAD.exec(line);
    if (h && /сум$/.test(h[1])) {
      cur = { title: h[1], aimag: h[2], slug: h[3], sections: [{ heading: null, lines: [] }], todo: [] };
      soums.push(cur);
      continue;
    }
    if (!cur || !line || line.startsWith('>') || line.startsWith('#')) continue;
    if (line === 'Танилцуулга') continue;
    const sec = /^\d+\.\s+(.+)$/.exec(line);
    if (sec) { cur.sections.push({ heading: sec[1], lines: [] }); continue; }
    const section = cur.sections[cur.sections.length - 1];
    for (const m of line.matchAll(TODO_RE)) cur.todo.push({ section: section.heading || 'Танилцуулга', item: m[1].trim() });
    const clean = line.replace(TODO_RE, ' ').trim();
    if (clean) section.lines.push(clean);
  }
  return soums;
}

function toRichText(s) {
  const content = [];
  for (const sec of s.sections) {
    if (!sec.lines.length) continue; // зөвхөн «[нэмэх]» байсан хэсэг
    if (sec.heading) content.push(h3(sec.heading));
    for (const line of sec.lines) {
      const m = /^([^:]{2,40}):\s+(.+)$/.exec(line);
      content.push(m ? para(text(`${m[1]}: `, ['bold']), text(m[2])) : para(text(line)));
    }
  }
  return { nodeType: 'document', data: {}, content };
}

(async () => {
  const soums = parse(fs.readFileSync(SRC, 'utf8'));
  if (soums.length !== 8) throw new Error(`8 сум хүлээсэн, ${soums.length} олдов`);
  await checkBudget(soums.length, '8 сум');

  const provinces = (await cma('GET', '/entries?content_type=province&limit=100')).items;
  const provinceId = Object.fromEntries(provinces.map((p) => [fv(p, 'slug'), p.sys.id]));
  const existing = (await cma('GET', '/entries?content_type=soum&limit=1000')).items;

  const report = [];
  for (const s of soums) {
    const pslug = PROVINCE[s.aimag];
    const pid = provinceId[pslug];
    if (!pid) throw new Error(`${s.title}: аймаг олдсонгүй (${s.aimag})`);
    const meta = META[s.slug];
    const id = meta.existingId || `th-soum-${pslug}-${s.slug}`;
    // Аймаг дотроо slug давхцахгүй (энэ entry-ээс бусад)
    const clash = existing.find((e) => e.sys.id !== id && fv(e, 'province')?.sys.id === pid && fv(e, 'slug') === s.slug);
    if (clash) throw new Error(`${s.title}: ${pslug}/${s.slug} slug аль хэдийн ${clash.sys.id}-д бий`);

    const body = toRichText(s);
    const words = wordCount(plainText(body.content));
    const ownPage = words > 150;
    const parent = `${s.aimag} аймаг`;
    const title = seoTitle(s.title, parent);
    if (title.length > 60) throw new Error(`${s.title}: seoTitle ${title.length}`);
    if (meta.seo.length < 120 || meta.seo.length > 155) throw new Error(`${s.title}: seoDescription ${meta.seo.length} тэмдэгт`);

    const fields = {
      title: L(s.title),
      slug: L(s.slug),
      province: L({ sys: { type: 'Link', linkType: 'Entry', id: pid } }),
      ownPage: L(ownPage),
      body: L(body),
      seoTitle: L(title),
      seoDescription: L(meta.seo),
      needsReplacement: L(false),
    };
    for (const k of ['center', 'population', 'area']) if (meta[k]) fields[k] = L(meta[k]);

    if (!DRY) {
      const cur = await cma('GET', `/entries/${id}`);
      if (cur && fv(cur, 'slug') && fv(cur, 'slug') !== s.slug) throw new Error(`${id}: одоогийн slug «${fv(cur, 'slug')}» өөр — өөрчлөхгүй`);
      // sourceUrl-ийг хоосон үлдээнэ (талбарыг огт бичихгүй)
      if (cur) await cma('PUT', `/entries/${id}`, { version: cur.sys.version, body: { fields: { ...cur.fields, ...fields } } });
      else await cma('PUT', `/entries/${id}`, { contentType: 'soum', body: { fields } });
    }
    const path_ = ownPage ? `/province/${pslug}/${s.slug}` : `/province/${pslug}#${s.slug}`;
    report.push({ id, title: s.title, aimag: s.aimag, path: path_, words, ownPage, todo: s.todo, seoTitle: title, seoDescription: meta.seo, existing: !!meta.existingId });
    console.log(`${DRY ? '[dry] ' : ''}${id} ${path_} ${words} үг ${ownPage ? 'ХУУДАС' : 'жагсаалт'} todo ${s.todo.length} [${title.length}/${meta.seo.length}]`);
  }

  // [нэмэх] жагсаалт
  const md = [
    '# 8 сумын нөхөж бичих зүйлс',
    '',
    '> 2026-10-20. [missing-soums-texts.md](missing-soums-texts.md)-ийн «[нэмэх: …]» мөрүүд. Сайт дээр гараагүй.',
    '> Бөглөсний дараа `node scripts/tic/import-missing-soums.js`-ийг дахин ажиллуулахад entry шинэчлэгдэнэ.',
    '> Мөн 8 сумын тоо баримтыг (хүн ам, талбай, зай, он) албан эх сурвалжаар шалгах.',
    '',
  ];
  for (const r of report) {
    md.push(`## ${r.title} (${r.aimag}) — \`${r.path}\``, '');
    if (!r.todo.length) md.push('- (нэмэх зүйлгүй)');
    for (const t of r.todo) md.push(`- [ ] **${t.section}:** ${t.item}`);
    md.push('');
  }
  if (!DRY) fs.writeFileSync(TODO, md.join('\n'), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'backups', 'tic-cache', 'missing-soums-result.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log(`сум ${report.length}, CMA ${callCount()}`);
})().catch((e) => { console.error(e.message); process.exit(1); });
