// Татах: joinme.mn/Provinces болон тэндээс холбосон аймгийн хуудсуудын түүхий JSON.
// joinme.mn нь SPA; хуудас бүр https://api3.cody.mn/api/v2/dynamic/joinme/<slug> -ээс
// (OAuth client_credentials token-той) ачаалагддаг. Token-ыг repo-д хадгалахгүйн тулд
// хуудсыг headless Edge-ээр render хийж, хөтчийн өөрийн хүсэлтийн хариуг CDP-ээр барьж авна.
// Зөвхөн уншина; хуудас хооронд 3+ сек завсарлана.
//
// Ажиллуулах (node байхгүй бол VS Code-ийн Electron):
//   ELECTRON_RUN_AS_NODE=1 ".../Code.exe" scripts/joinme/fetch.js
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT = path.join(__dirname, '../../data/joinme/raw');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function capture(url, waitMs = 12000) {
  const port = 9333 + Math.floor(Math.random() * 500);
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'edgeprof-'));
  const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--no-first-run', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  try {
    let tgt;
    for (let i = 0; i < 40 && !tgt; i++) {
      try { tgt = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {}
      if (!tgt) await sleep(300);
    }
    const ws = new WebSocket(tgt.webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r));
    let id = 0; const pending = new Map(); const reqs = new Map(); const bodies = [];
    const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
    ws.addEventListener('message', async (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || m); pending.delete(m.id); return; }
      const r = m.params && m.params.request;
      if (m.method === 'Network.requestWillBeSent' && r.method === 'GET' && r.url.includes('/api/v2/dynamic/')) reqs.set(m.params.requestId, r.url);
      if (m.method === 'Network.loadingFinished' && reqs.has(m.params.requestId)) {
        const b = await send('Network.getResponseBody', { requestId: m.params.requestId });
        if (b.body) bodies.push({ url: reqs.get(m.params.requestId), body: b.body });
      }
    });
    await send('Network.enable', { maxResourceBufferSize: 50e6, maxTotalBufferSize: 200e6 });
    await send('Page.navigate', { url });
    await sleep(waitMs);
    ws.close();
    return bodies;
  } finally {
    edge.kill();
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const [idx] = await capture('https://joinme.mn/Provinces');
  fs.writeFileSync(path.join(OUT, 'Provinces.json'), JSON.stringify(JSON.parse(idx.body), null, 1));
  const links = new Set();
  for (const it of JSON.parse(idx.body).items) if (it.component === 'CategoryBlock') for (const c of it.items) if (c.link) links.add(c.link.replace(/^\//, ''));
  console.log('province pages:', [...links].join(', '));
  for (const slug of links) {
    await sleep(3000);
    const [p] = await capture(`https://joinme.mn/${slug}`);
    if (!p) { console.warn('no data:', slug); continue; }
    fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify(JSON.parse(p.body), null, 1));
    console.log('saved', slug);
  }
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
