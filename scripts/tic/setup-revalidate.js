// On-demand revalidation-ийн тохиргоо (дахин ажиллуулахад аюулгүй):
//  1. CONTENTFUL_REVALIDATE_SECRET (санамсаргүй) болон CONTENTFUL_PREVIEW_ACCESS_TOKEN
//     («Nextjs Website» API key-ийн Preview token)-ийг travel-mongolia/.env.local-д бичнэ.
//  2. Contentful webhook: Entry publish/unpublish → https://www.travelhubmongolia.com/api/revalidate
// Token, secret дэлгэцэнд хэвлэгдэхгүй, commit хийгдэхгүй (.env*.local нь .gitignore-д).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { cma, ENV, ROOT } = require('./_cma');

const ENV_FILE = path.join(ROOT, 'travel-mongolia', '.env.local');
const WEBHOOK_NAME = 'Travel Hub — on-demand revalidate';
const WEBHOOK_URL = 'https://www.travelhubmongolia.com/api/revalidate';

function setEnv(key, value) {
  let text = fs.readFileSync(ENV_FILE, 'utf8');
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  text = re.test(text) ? text.replace(re, line) : text.replace(/\s*$/, '\n') + line + '\n';
  fs.writeFileSync(ENV_FILE, text, 'utf8');
}

(async () => {
  // 1. Secret
  const secret = ENV.CONTENTFUL_REVALIDATE_SECRET || crypto.randomBytes(32).toString('hex');
  if (!ENV.CONTENTFUL_REVALIDATE_SECRET) { setEnv('CONTENTFUL_REVALIDATE_SECRET', secret); console.log('.env.local: CONTENTFUL_REVALIDATE_SECRET нэмэв'); }

  // 2. Preview token (сайтын Delivery token-той ижил API key-ийнх)
  if (!ENV.CONTENTFUL_PREVIEW_ACCESS_TOKEN) {
    const keys = (await cma('GET', '/api_keys', { spaceLevel: true })).items;
    const key = keys.find((k) => k.accessToken === ENV.CONTENTFUL_ACCESS_TOKEN) || keys.find((k) => k.name === 'Nextjs Website');
    const pid = key?.preview_api_key?.sys?.id;
    if (!pid) throw new Error('Preview API key олдсонгүй');
    const pk = await cma('GET', `/preview_api_keys/${pid}`, { spaceLevel: true });
    setEnv('CONTENTFUL_PREVIEW_ACCESS_TOKEN', pk.accessToken);
    console.log(`.env.local: CONTENTFUL_PREVIEW_ACCESS_TOKEN нэмэв («${key.name}» API key)`);
  }

  // 3. Webhook
  const hooks = (await cma('GET', '/webhook_definitions', { spaceLevel: true })).items;
  const body = {
    name: WEBHOOK_NAME,
    url: WEBHOOK_URL,
    topics: ['Entry.publish', 'Entry.unpublish'],
    filters: [{ equals: [{ doc: 'sys.environment.sys.id' }, 'master'] }],
    headers: [{ key: 'x-revalidate-secret', value: secret, secret: true }],
  };
  const hook = hooks.find((h) => h.name === WEBHOOK_NAME);
  if (hook) {
    await cma('PUT', `/webhook_definitions/${hook.sys.id}`, { spaceLevel: true, version: hook.sys.version, body });
    console.log('webhook шинэчлэв:', WEBHOOK_URL);
  } else {
    await cma('POST', '/webhook_definitions', { spaceLevel: true, body });
    console.log('webhook үүсгэв:', WEBHOOK_URL);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
