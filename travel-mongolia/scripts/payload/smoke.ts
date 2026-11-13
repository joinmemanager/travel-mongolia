// Payload-ийг ачаалж (dev-д схемийг push хийнэ), collection бүрийн тоог хэвлэнэ.
//   node scripts/payload/cli.mjs run scripts/payload/smoke.ts
import { getPayload } from 'payload';

import config from '@payload-config';

const payload = await getPayload({ config });
const out: Record<string, number> = {};
for (const c of payload.config.collections) {
  out[c.slug] = (await payload.count({ collection: c.slug as any, overrideAccess: true })).totalDocs;
}
console.log(JSON.stringify(out));
process.exit(0);
