// 4, 7, 8-р багцын гарчгийн том/жижиг үсгийг засна (Draft entry дээр, slug хөндөхгүй).
//   node scripts/tic/fix-titles.js          # dry: өөрчлөлтийг хэвлэнэ, title-review.md бичнэ
//   node scripts/tic/fix-titles.js --apply  # Contentful-д бичнэ (Draft хэвээр)
// Дүрэм:
//   1) TIC-ийн эх гарчиг ТОМ үсгээр биш (жижиг үсэг холилдсон) бол эх бичлэгийг нь сэргээнэ (мэдээ г.м.).
//   2) Инициал (Ц.дамдинсүрэн → Ц.Дамдинсүрэн), ром тоо (ii → II), товчлол (Мнт-Ны → МНТ-ны).
//   3) Гараар шалгасан оноосон нэр: TITLE_FIX (итгэлтэй). Эргэлзээтэй нь REVIEW → docs/plan/title-review.md.
// Idempotent: гарчиг аль хэдийн зөв бол алгасна.
const fs = require('fs');
const path = require('path');
const { cma, fv, LOCALE, ROOT } = require('./_cma');
const { decode } = require('./_html');

const APPLY = process.argv.includes('--apply');
const CACHE = path.join(ROOT, 'backups', 'tic-cache');
const L = (v) => ({ [LOCALE]: v });

// Итгэлтэй засвар (entry id → шинэ гарчиг). Үг, үсэг TIC-тэй ижил, зөвхөн том/жижиг үсэг, зураас.
const TITLE_FIX = {
  'tic-c1-228': 'Зэд-Хантай-Бүтээлийн нуруу',
  'tic-c1-65': 'Бага Ойгор, Цагаан Салаагийн хадны сүг зураг',
  'tic-c1-5': 'Байбалык хот буюу Бийбулаг',
  'tic-c1-67': 'Батхаан уул МУ-ын байгалийн нөөц газар',
  'tic-c1-418': 'Гол мод II (Хүннү булш)',
  'tic-c1-255': 'Орхон VII палеолитын буудал, Дарханы газар',
  'tic-c1-280': 'Гэр чулуу, Бага газрын чулууны хадны зураг',
  'tic-c1-472': 'Зотол хан, Матад хан, Дархан хан',
  'tic-c1-492': 'Нарату шитүэн, Хусуту шитүэн (МНТ-ны 133)',
  'tic-c1-493': 'Оршуун гол (МНТ-ны 53)',
  'tic-c1-490': 'Цэгцэрийн шар тал (МНТ-ны 61, 67, 94)',
  'tic-c1-498': 'Бунхан толгой, Зөвлөлтийн Улаан армийн нисэгчдийн дурсгалын хөшөө',
  'tic-c1-154': 'Нэмэгт уул, Нэмэгтийн их хонгил',
  'tic-c1-467': 'Хан уул, Хутаг уул, Өвгөн овоо',
  'tic-c1-229': 'Тэнгис, Шишгэдийн ай сав',
  'tic-c1-390': 'Чулуут, Тээлийн голын бэлчирийн буган хөшөө',
  'tic-c1-553': 'Хүлэг Боорчи - Андлалын өргөө цогцолбор',
  'tic-c1-539': 'Сарьдагийн хийд буюу Цагаан хот',
  'tic-c1-528': 'Шанхын хийд буюу Баруун хүрээ',
  'tic-c1-484': 'Хүүхдийн овоо буюу Толгойтын овооны цогцолбор',
  'tic-c1-295': 'Морин толгойн буюу Молор толгойн хадны зураг',
  'tic-c1-118': 'Чойр уул - Цагаан Дарь эхийн хөрөг',
  'tic-c1-37': 'Хар зүрхний Хөх нуур',
  'tic-c1-231': 'Биндэръяа Хөх нуур',
  'tic-c1-53': 'Ширээт Цагаан нуур',
  'tic-c1-188': 'Хагийн Хар нуур',
  'tic-c1-116': 'Хэрлэн Барс хотын туурь',
  'tic-c1-473': 'Ц.Дамдинсүрэнгийн хөшөө',
  'tic-c1-503': 'Халхгол - Г.М.Куропаткины дурсгалын хөшөө',
  'tic-c1-502': 'Халхгол - Комиссар А.Н.Загриковын хөшөө',
  'tic-c1-496': 'Халхгол - М.П.Яковлевын хөшөө',
  'tic-c1-512': 'Халхгол - Ш.Гонгор баатрын алдрын багана',
  'tic-c1-249': 'Дулааны говийн шинэ чулуун зэвсгийн дурсгал',
  'tic-c1-363': 'Дээд улаан говийн амны буган хөшөө',
  'tic-c20-96': 'Улаанбаатар - Аялал жуулчлалын үзэсгэлэн',
  'tic-c22-222': 'Төв - XIII зуун цогцолбор',
  'tic-c22-173': 'Хэнтий - Хар зүрхний Хөх нуур бааз',
  'tic-c22-1346': 'Улаанбаатар - Мөнхтэнгэр-2 Богд бааз',
  'tic-c21-2': 'Амарбаясгалант (Amarbayasgalant Hotel)',
  'tic-c21-102': 'H9 - УБ (H9 - UB Hotel)',
  'tic-c21-119': 'H9 - Сэлэнгэ (H9 Selenge)',
  'tic-c21-83': 'УБ сити (UB City Hotel)',
  'tic-c21-60': 'Улаанбаатар-2 (UB-2 Hotel)',
  'tic-c21-23': 'Жи Ди Эл (JDL Hotel)',
  'tic-c21-1146': 'Их хорум (Ikh Khorum)',
  'tic-c22-20': 'Тэрэлж - UB-2 бааз',
  'tic-n-6437': 'Joinme: Энэ сард онцолж буй Тэрэлжийн 5 амралтын газар',
  'tic-n-6443': '13 Буддагийн нэг м...',
  'tic-n-3333': '“Happy Camper – 2018” бартаат замын дугуйн аялал',
};

// Эргэлзээтэй (өмнө → санал): автоматаар засахгүй, хэрэглэгч шийднэ.
const REVIEW = {
  'tic-c1-424': 'Тэхт уул ба Анчин мундуу',
  'tic-c1-469': 'Туг уул ба Тугийн сүм',
  'tic-c1-450': 'Хөгнө Хан уул',
  'tic-c1-591': 'Ульхан Майхан уул',
  'tic-c1-43': 'Хэрлэнбаян Улаан уул',
  'tic-c1-346': 'Баянцагааны хөндийн буган хөшөө',
  'tic-c1-79': 'Дагвасүндэл бурхан',
  'tic-c1-457': 'Сангийн Далай нуур',
  'tic-c1-538': 'Сангийн Далай хийд',
  'tic-c1-543': 'Угтуул Сангийн Далай хийд',
  'tic-c1-589': 'Тал нутгийн ахан дүүс хөшөө',
  'tic-c1-151': 'Монгол түмний морины их шүтээн',
  'tic-c1-168': 'Баруун, Зүүн тайга',
  'tic-c1-18': 'Ноён, Хатан, Хүү, Бэрийн чулуу',
  'tic-c1-195': '—',
  'tic-c1-449': 'Тавь зуу (50°×100°) огтлолцол цэг',
  'tic-c1-459': 'Мухар Шивэртийн ам',
  'tic-c1-485': 'Утай Таван уул',
  'tic-c1-597': 'Дэгэн Жигэний хавцал',
  'tic-c1-2': 'Алтан-Овоо (төрийн тахилгат овоо)',
  'tic-c1-80': 'Дарь-Овоо (төрийн тахилгат овоо)',
  'tic-c1-10': 'Ёлын ам',
  'tic-c1-421': 'Мөнх цаст хамгийн өндөр оргилууд',
};
delete REVIEW['tic-c1-195'];

const isUpperish = (s) => {
  const letters = s.match(/\p{L}/gu) || [];
  const up = letters.filter((c) => c === c.toLocaleUpperCase('mn') && c !== c.toLocaleLowerCase('mn')).length;
  return letters.length > 0 && up / letters.length > 0.6;
};

// Ерөнхий дүрэм (ТОМ үсгийн эх гарчигт)
function rules(t) {
  return t
    .replace(/(^|[\s(«"“-])([А-ЯЁӨҮ])\.([а-яёөү])/gu, (m, p, a, b) => `${p}${a}.${b.toLocaleUpperCase('mn')}`)
    .replace(/(^|[\s(«"“-])([А-ЯЁӨҮ])\.([А-ЯЁӨҮ])\.([а-яёөү])/gu, (m, p, a, b, c) => `${p}${a}.${b}.${c.toLocaleUpperCase('mn')}`)
    .replace(/\b(ii|iii|iv|vi|vii|viii|xiii)\b/g, (m) => m.toUpperCase());
}

// TIC хуудасны <title> таг гарчгийг жинхэнэ бичлэгээр нь агуулдаг (lName span нь ТОМ үсгээр).
function titleTag(html) {
  const m = /<title>([\s\S]*?)<\/title>/i.exec(html);
  return m ? decode(m[1]).replace(/::\s*www\.touristinfocenter\.mn\s*$/i, '').replace(/\s+/g, ' ').trim() : '';
}

// TIC-ийн онцлох ТОМ үсгийн үг («ХУАНДИ ШАНЬЮЙ-гийн», «УЙГАР-ын») → эхний үсэг том. Товчлол (≤3 үсэг) хэвээр.
const KEEP_UPPER = new Set(['ЮНЕСКО', 'ЖАЙКА', 'ХААИС', 'МУИС', 'ШУТИС', 'ЭМШУИС', 'ХЗДХЯ', 'БОАЖЯ', 'ЗДТГ', 'ИТХ', 'ХХААЯ', 'ГХЯ', 'ЗГХЭГ', 'АЖЯ', 'МҮОНРТ']);
function unshout(t) {
  return t.replace(/[А-ЯЁӨҮ]{4,}/gu, (w, i) => {
    if (KEEP_UPPER.has(w)) return w;
    return w[0] + w.slice(1).toLocaleLowerCase('mn');
  });
}

// Одоогийн гарчгийн үсэг бүрийн том/жижгийг эх гарчгаас авна (цэг таслал, зай одоогийнх хэвээр).
// Үсгүүд таарахгүй бол null. raiseOnly: зөвхөн кирилл жижиг үсгийг томруулна (4, 7-р багц: TIC-ийн
// бичлэг заримдаа «Арц богд уул», «Amure hotel» гэх мэт муу тул томыг жижиг болгохгүй, латиныг хөндөхгүй).
function borrowCase(cur, orig, raiseOnly) {
  const isL = (c) => /\p{L}|\p{N}/u.test(c);
  let j = 0, out = '';
  for (const c of cur) {
    if (!isL(c)) { out += c; continue; }
    while (j < orig.length && !isL(orig[j])) j++;
    if (j >= orig.length) return null;
    const o = orig[j++];
    if (o.toLocaleLowerCase('mn') !== c.toLocaleLowerCase('mn')) return null;
    if (raiseOnly) out += /[а-яёөү]/.test(c) && o !== c ? o : c;
    else if (/[a-z]/i.test(c)) out += /[a-z]/.test(c) && o !== c ? o : c; // латиныг жижиг болгохгүй
    else out += o;
  }
  return out;
}

// Эх гарчиг «Үг Бүрийг Томоор» эсвэл ТОМ үсгээр онцолсон бол түүнээс бичлэг авахгүй
function titleCaseStyle(tag) {
  const words = tag.split(/[\s"“”«»()–:.,-]+/).filter((w) => /^[А-ЯЁӨҮа-яёөү]{2,}/.test(w)).slice(1);
  if (!words.length) return false;
  const shout = words.some((w) => /^[А-ЯЁӨҮ]{2,3}$/.test(w) && !/^(УБ|МУ|ХХК|ТББ|НҮБ|ХК|ТӨХК|ААН|ЗГ|УИХ|ЕБС)$/.test(w));
  const caps = words.filter((w) => /^[А-ЯЁӨҮ]/.test(w)).length;
  return shout || caps / words.length >= 0.4;
}

function loadItems() {
  const items = [];
  for (const file of ['batch04-result.json', 'batch07-result.json', 'batch08-result.json']) {
    const r = JSON.parse(fs.readFileSync(path.join(CACHE, file), 'utf8'));
    for (const e of r.entries) {
      if (e.existing || !e.id) continue;
      const html = path.join(CACHE, 'batch04-08', `${e.key}.html`);
      const tag = fs.existsSync(html) ? titleTag(fs.readFileSync(html, 'utf8')) : '';
      items.push({ ...e, tag });
    }
  }
  return items;
}

function proposed(it) {
  if (TITLE_FIX[it.id]) return TITLE_FIX[it.id];
  let t = it.title;
  const suffix = / \(\d{4}\.\d{2}\.\d{2}\)$/.exec(t)?.[0] || '';
  const base = t.slice(0, t.length - suffix.length);
  const news = it.id.startsWith('tic-n-');
  const b = it.tag && !(news && titleCaseStyle(it.tag)) && borrowCase(base, it.tag, !news);
  if (b) {
    t = (news ? unshout(b) : b) + suffix;
    t = t[0].toLocaleUpperCase('mn') + t.slice(1);
  }
  if (news) t = t.replace(/^(\d+)([А-ЯЁӨҮ])(?=[а-яёөү])/u, (m, n, c) => `${n} ${c.toLocaleLowerCase('mn')}`);
  return rules(t);
}

function replaceText(node, from, to) {
  if (!node || typeof node !== 'object') return 0;
  let n = 0;
  if (node.nodeType === 'text' && node.value === from) { node.value = to; n++; }
  for (const c of node.content || []) n += replaceText(c, from, to);
  return n;
}

(async () => {
  const items = loadItems();
  const changes = items.map((it) => ({ it, to: proposed(it) })).filter((c) => c.to !== c.it.title);
  const byKind = {};
  for (const c of changes) {
    const k = c.it.id.replace(/^tic-(c\d+|n).*$/, '$1');
    byKind[k] = (byKind[k] || 0) + 1;
  }
  for (const c of changes) console.log(`${c.it.id}: «${c.it.title}» → «${c.to}»`);
  console.log('өөрчлөлт', changes.length, byKind);

  // title-review.md
  const titleOf = Object.fromEntries(items.map((it) => [it.id, it]));
  const md = [
    '# Гарчгийн эргэлзээтэй засвар (шийдэх)',
    '',
    '> 2026-10-21. TIC-ийн ТОМ үсгийн гарчгийг өгүүлбэрийн бичлэгт шилжүүлэхэд оноосон нэр эсэх нь тодорхойгүй гарчгууд.',
    '> Итгэлтэй засварууд (`scripts/tic/fix-titles.js` TITLE_FIX, инициал, ром тоо, мэдээний эх бичлэг) Contentful-д орсон.',
    '> Доорх саналыг зөвшөөрвөл `REVIEW`-ээс `TITLE_FIX` руу зөөж `--apply` ажиллуулна.',
    '',
    '| Entry | Хаяг | Одоо (өмнө) | Санал |',
    '|---|---|---|---|',
    ...Object.entries(REVIEW).filter(([id, s]) => titleOf[id] && proposed(titleOf[id]) !== s).map(([id, s]) => `| \`${id}\` | ${titleOf[id]?.path || ''} | ${titleOf[id] ? proposed(titleOf[id]) : ''} | ${s} |`),
    '',
  ];
  fs.writeFileSync(path.join(ROOT, 'docs', 'plan', 'title-review.md'), md.join('\n'), 'utf8');

  if (!APPLY) return;
  let done = 0, skip = 0, err = 0;
  for (const { it, to } of changes) {
    try {
      const e = await cma('GET', `/entries/${it.id}`);
      if (!e) { err++; console.log('алга', it.id); continue; }
      const nameField = e.fields.name ? 'name' : 'title';
      const cur = fv(e, nameField);
      if (cur === to) { skip++; continue; }
      if (cur !== it.title) { skip++; console.log('гараар өөрчилсөн тул алгасав', it.id, cur); continue; }
      e.fields[nameField] = L(to);
      for (const f of ['seoTitle', 'seoDescription']) {
        const v = fv(e, f);
        if (v && v.includes(cur)) e.fields[f] = L(v.split(cur).join(to));
      }
      for (const f of ['body', 'description']) if (fv(e, f)) replaceText(fv(e, f), cur, to);
      await cma('PUT', `/entries/${it.id}`, { body: { fields: e.fields }, version: e.sys.version });
      done++;
    } catch (x) {
      err++;
      console.log('алдаа', it.id, x.message.slice(0, 200));
    }
  }
  console.log({ done, skip, err });
})().catch((e) => { console.error(e.message); process.exit(1); });
