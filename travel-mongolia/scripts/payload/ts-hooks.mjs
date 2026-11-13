// Node 24-ийн өөрийн TypeScript type-stripping-ээр төслийн .ts файлуудыг ачаална (tsx-гүй).
// tsx нь node_modules-ийг дахин хөрвүүлж undici-г эвддэг тул (Illegal constructor) Payload CLI болон
// импортын скриптүүдийг энэ hook-оор ажиллуулна. Зөвхөн төслийн файлд: '@/…', '@payload-config',
// өргөтгөлгүй харьцангуй import-ийг .ts/.tsx/index.ts болгож шийднэ. node_modules-д хүрэхгүй.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const EXTS = ['.ts', '.tsx', '.mts', '.js', '/index.ts', '/index.tsx', '/index.js'];

const isProjectFile = (url) => {
  if (!url?.startsWith('file:')) return false;
  const p = fileURLToPath(url);
  return p.startsWith(APP) && !p.includes(`${path.sep}node_modules${path.sep}`);
};

function tryFile(base) {
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  for (const ext of EXTS) if (fs.existsSync(base + ext)) return base + ext;
  return null;
}

export async function resolve(specifier, context, next) {
  let target = null;
  if (specifier === '@payload-config') target = path.join(APP, 'payload.config.ts');
  else if (specifier.startsWith('@/')) target = tryFile(path.join(APP, specifier.slice(2)));
  else if ((specifier.startsWith('./') || specifier.startsWith('../')) && isProjectFile(context.parentURL)) {
    const base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    if (!/\.(m?[jt]sx?|json|css|scss)$/.test(specifier)) target = tryFile(base);
  }
  if (target) return { url: pathToFileURL(target).href, shortCircuit: true };
  return next(specifier, context);
}

export async function load(url, context, next) {
  // Payload-ийн үүсгэсэн migration: `import { MigrateUpArgs, MigrateDownArgs, sql }` — эхний хоёр нь зөвхөн төрөл,
  // Node-ийн type-stripping тэднийг хасдаггүй тул энд `import type` болгоно (файлыг өөрчлөхгүй).
  if (isProjectFile(url) && /[\\/]payload[\\/]migrations[\\/][^\\/]+\.ts$/.test(fileURLToPath(url))) {
    const source = fs
      .readFileSync(fileURLToPath(url), 'utf8')
      .replace(/import \{([^}]*)\} from '@payloadcms\/db-postgres'/, (_, names) => {
        const list = names.split(',').map((s) => s.trim()).filter(Boolean);
        const types = list.filter((n) => /^Migrate(Up|Down)Args$/.test(n));
        const values = list.filter((n) => !types.includes(n));
        return [
          types.length ? `import type { ${types.join(', ')} } from '@payloadcms/db-postgres'` : '',
          values.length ? `import { ${values.join(', ')} } from '@payloadcms/db-postgres'` : '',
        ].join('\n');
      });
    return { format: 'module-typescript', source, shortCircuit: true };
  }
  if (isProjectFile(url) && /\.(ts|tsx|mts)$/.test(url)) {
    // package.json-д "type": "module" байхгүй ч төслийн .ts файлууд ESM синтакстай
    return next(url, { ...context, format: 'module-typescript' });
  }
  if (isProjectFile(url) && /\.s?css$/.test(url)) return { format: 'module', source: 'export default {}', shortCircuit: true };
  return next(url, context);
}
