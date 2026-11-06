// Headless Edge (CDP)-ээр хуудасны дээд хэсгийн дэлгэцийн зураг авна. GA/GTM-ийг блоклоно.
//   node scripts/content/screenshot.js <url> <out.png> [width=1440] [height=900]
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const [url, out, W = '1440', H = '900'] = process.argv.slice(2);
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9300 + Math.floor(Math.random() * 500);
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-shot-'));
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--no-first-run', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  let ws;
  for (let i = 0; i < 40 && !ws; i++) {
    await sleep(250);
    try { const t = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); ws = t.find((x) => x.type === 'page')?.webSocketDebuggerUrl; } catch {}
  }
  if (!ws) throw new Error('Edge CDP холбогдсонгүй');
  const sock = new WebSocket(ws);
  await new Promise((r) => (sock.onopen = r));
  let id = 0;
  const pending = new Map();
  const events = [];
  sock.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } else events.push(d); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); sock.send(JSON.stringify({ id: i, method, params })); });
  await send('Network.enable');
  await send('Network.setBlockedURLs', { urls: ['*googletagmanager.com*', '*google-analytics.com*'] });
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: Number(W), height: Number(H), deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url });
  for (let i = 0; i < 240 && !events.some((e) => e.method === 'Page.loadEventFired'); i++) await sleep(250);
  await sleep(2500); // зураг ачаалагдах
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
  console.log(out);
  sock.close();
})().catch((e) => { console.error(e.message); process.exitCode = 1; }).finally(() => { edge.kill(); });
