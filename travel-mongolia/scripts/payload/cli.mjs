// Payload CLI-г tsx-гүйгээр ажиллуулна (scripts/payload/ts-hooks.mjs-ийг үз).
//   node scripts/payload/cli.mjs generate:importmap | generate:types | migrate:create <нэр> | migrate | migrate:status
//   node scripts/payload/cli.mjs run scripts/payload/import.ts [...]   (Payload-ийн `payload run`-тэй адил)
import { register } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

register('./ts-hooks.mjs', import.meta.url);

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
process.env.PAYLOAD_CONFIG_PATH ||= path.join(APP, 'payload.config.ts');

if (process.argv[2] === 'run') {
  // .env-ийг Next-тэй адил ачаална (байхгүй бол зүгээр)
  // @next/env нь next-ийн dependency (pnpm-д шууд хүрэхгүй) → next-ээр дамжуулж
  const { createRequire } = await import('node:module');
  const nextRequire = createRequire(createRequire(path.join(APP, 'package.json')).resolve('next/package.json'));
  const nextEnv = nextRequire('@next/env');
  nextEnv.loadEnvConfig(APP, process.env.NODE_ENV !== 'production');
  const script = path.resolve(process.argv[3]);
  process.argv = [process.argv[0], script, ...process.argv.slice(4)];
  await import(pathToFileURL(script).href);
} else {
  const binUrl = pathToFileURL(path.join(APP, 'node_modules', 'payload', 'dist', 'bin', 'index.js')).href;
  const { bin } = await import(binUrl);
  await bin();
}
