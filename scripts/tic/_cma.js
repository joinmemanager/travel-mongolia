// Contentful Management API-ийн туслах (Node / Electron-as-Node).
// Token-ийг travel-mongolia/.env.local-аас уншина. Token хэзээ ч хэвлэгдэхгүй.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const ENV_FILE = path.join(ROOT, 'travel-mongolia', '.env.local');

function readEnv() {
  const env = {};
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^"|"$/g, '');
  }
  return env;
}

const ENV = readEnv();
const SPACE = ENV.CONTENTFUL_SPACE_ID;
const TOKEN = ENV.CONTENTFUL_MANAGEMENT_TOKEN;
const LOCALE = 'mn';
const BASE = `https://api.contentful.com/spaces/${SPACE}/environments/master`;
const SPACE_BASE = `https://api.contentful.com/spaces/${SPACE}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let calls = 0;

// CMA хүсэлт. GET 404 → null. 429 → дахин оролдоно. Алдааны мэдээнд token орохгүй.
async function cma(method, p, { body, version, contentType, raw, spaceLevel } = {}) {
  const headers = { Authorization: `Bearer ${TOKEN}` };
  if (version !== undefined && version !== null) headers['X-Contentful-Version'] = String(version);
  if (contentType) headers['X-Contentful-Content-Type'] = contentType;
  let payload;
  if (raw) {
    payload = raw;
    headers['Content-Type'] = 'application/octet-stream';
  } else if (body !== undefined) {
    payload = JSON.stringify(body);
    headers['Content-Type'] = 'application/vnd.contentful.management.v1+json';
  }
  const url = p.startsWith('https://') ? p : (spaceLevel ? SPACE_BASE : BASE) + p;
  for (let attempt = 1; attempt <= 6; attempt++) {
    calls++;
    const res = await fetch(url, { method, headers, body: payload });
    if (res.status === 429) { await sleep(1500 * attempt); continue; }
    if (res.status === 404 && method === 'GET') return null;
    const text = await res.text();
    if (!res.ok) throw new Error(`Contentful ${method} ${p} алдаа (${res.status}): ${text.slice(0, 800)}`);
    await sleep(160); // 7 хүсэлт/сек хязгаараас доогуур
    return text ? JSON.parse(text) : null;
  }
  throw new Error(`Contentful ${method} ${p}: 429 давтагдсан`);
}

const fv = (entry, id) => entry?.fields?.[id]?.[LOCALE];

module.exports = { cma, fv, ENV, SPACE, LOCALE, ROOT, sleep, callCount: () => calls };
