# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Ажлын дүрэм

- **`main` руу шууд push хийхгүй.** `main` руу орсон бүх зүйл travelhubmongolia.com дээр шууд гардаг.
- Ажил бүрийг `main`-аас салгасан тусдаа branch дээр хийнэ (жишээ нь `fix/festival-images`, `feat/region-search`). Тэр branch-аа GitHub руу push хийнэ.
- Push хийсний дараа Vercel-ийн preview deploy дуусахыг хүлээгээд **preview URL-ыг хэрэглэгчид өгнө**. URL-ыг ингэж олно:
  1. Branch бүр тогтмол хаягтай: `https://travel-mongolia-ilas-git-<branch>-joinme1.vercel.app`. Branch нэр дэх `/`-г `-` болгоно. Жишээ нь `fix/festival-images` → `travel-mongolia-ilas-git-fix-festival-images-joinme1.vercel.app`. Энэ хаяг тухайн branch-ийн хамгийн сүүлийн deploy руу заана.
  2. Build амжилттай болсныг `https://api.github.com/repos/joinmemanager/travel-mongolia/commits/<sha>/status` хаягийн `Vercel – travel-mongolia-ilas` мөрөөс шалгаад, дараа нь хаягийг өгнө. JSON-д `state` талбар `context`-оос 5 мөрийн өмнө байдаг. Нэвтрээгүй үед GitHub API цагт 60 хүсэлт зөвшөөрдөг тул 40 секунд тутам эсвэл түүнээс цөөн удаа шалгана.
  3. travelhubmongolia.com-ыг **`travel-mongolia-ilas`** project serve хийдэг (2026-10-01-нд шалгасан). Тиймээс preview-г тэр project-оос өгнө. `travel-mongolia` project-ийн preview build fail болдог, `travel-mongolia.vercel.app` нь хуучин өөр сайт.
  4. Preview холбоосууд Vercel-ийн хамгаалалттай (302 → нэвтрэх хуудас). Хэрэглэгч Vercel эрхээрээ нэвтэрч байж үзнэ. Байхгүй branch-ийн хаяг 404 буцаана.
- Хэрэглэгч preview дээр шалгаад **зөвшөөрсний дараа л** `main` руу merge хийж push хийнэ. Зөвшөөрөл ажил бүрт тусдаа авна.
- **`main` руу merge хийх бүрт `staging` branch-ийг шинэчилнэ**, ингэснээр `staging` нь `main`-тэй үргэлж ижил байна: `git push origin main:staging` (fast-forward). `staging` дээр шууд ажил хийхгүй.
- **`app/layout.tsx` дахь Google tag-уудыг хэзээ ч устгах, өөрчлөхгүй.** Энэ нь `metadata.verification.google` (Search Console-ийн verification meta tag, `zRrRNy93t2vrJ0mbrdKRgk-zHX0UZazj7BHcjprmSnI`) болон `<GoogleAnalytics gaId="G-PBZBEDW93X" />` (GA4) хоёр юм. `layout.tsx` эсвэл `metadata`-г дахин бичих, merge conflict шийдэх үед энэ хоёрыг яг хэвээр нь үлдээнэ. GA-г нэг л удаа ачаалах ёстой тул өөр газар давхар GA/GTM код нэмэхгүй.
- **Төлөвлөгөө: [`docs/plan/ia-plan.md`](../docs/plan/ia-plan.md)-г дагана.** Энэ нь Travel Hub Mongolia 2.0-ийн **батлагдсан** цэс, URL бүтэц, шинэ hub хуудсууд болон хэрэгжүүлэх дарааллын төлөвлөгөө. Эзэмшигч 2026-10-02-нд баталсан. Файл repo-ийн үндсэн хавтсанд, app-ийн гадна байрладаг. Цэс, хаяг, шинэ хуудастай холбоотой ажил эхлэхийн өмнө үүнийг уншина. Эзэмшигчийн шийдвэрүүд төлөвлөгөөний 7-р хэсэгт бий. Тэнд "шийдээгүй" гэж үлдсэн асуудлаар таамаглахгүй, эхлээд асууна.

## Project

Travel Mongolia (travelhubmongolia.com) is a Mongolian-language travel guide built with Next.js 16 App Router, React 19, Tailwind v4 and Contentful. The git repo root is the parent directory (`teslatraders/`), and this app lives in `travel-mongolia/`. Run all commands from `travel-mongolia/`. UI text and code comments are in Mongolian, so keep new ones in Mongolian too.

## Commands

```bash
yarn dev      # dev server on http://localhost:3000 (yarn.lock is committed)
yarn build    # production build
yarn lint     # eslint
```

There is no test suite.

## Deployment

Pushing to `main` on GitHub (`joinmemanager/travel-mongolia`) triggers automatic Vercel production deploys, and pushing any other branch creates preview deploys. There is no manual deploy step. See "Ажлын дүрэм" above for the branch and preview workflow. Four Vercel projects build every commit. `travel-mongolia-ddf6` has been failing on every commit and is not the production site. To see deploy results, check the commit status at `https://api.github.com/repos/joinmemanager/travel-mongolia/commits/<sha>/status`.

The user's machine has no Node/npm/gh on PATH, so local builds and type checks cannot run. Vercel is the first real build. Git has no global identity configured, so commit with `git -c user.name="dashka0212" -c user.email="44989745+dashka0212@users.noreply.github.com" commit ...`.

## Config gotchas

- `next.config.js` is the only Next config (do not add `.mjs`/`.ts` variants, since Next would load `.js` first and silently ignore them). It sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`, so type errors do not fail a deploy. `images.remotePatterns` allows `images.ctfassets.net` and `images.unsplash.com`. Any other remote host used with `next/image` must be added there or use `unoptimized`.
- `app/layout.tsx` sets `revalidate = 240` (ISR, Contentful changes show within 5 minutes). Pages that read URL params with `useSearchParams` (things-to-do, inspiration, `/local/*` categories, festivals) set `force-dynamic` in their own layout or page so their content stays in the server HTML. See `docs/plan/performance.md`.
- Env vars (`.env.local`): `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN` (Delivery API, server-only), `GEMINI_API_KEY`, `CONTENTFUL_MANAGEMENT_TOKEN` (`scripts/contentful/*.ps1` only; never commit or print it).

## Content architecture

Most pages are **static**. Their content is hardcoded in page files, components, or `lib/*Data.ts` (for example `natureData.ts`, `cultureData.ts`). Adding an entry in Contentful only shows up on the site where code explicitly fetches that content type:

| Content type | Where it's rendered |
|---|---|
| `destination` | Home "top destinations" slider (`app/page.tsx` → `TopDestinations`) |
| `recommendation` | Home seasonal section, `/recommendation/[id]` |
| `cultureHeritage` | Home Naadam/festival section (`CultureFestivals`) |
| `heritageCategory` → linked `heritagePlace` entries (`places` field) | `/destination/heritage`, `/destination/heritage/[category]`, `/destination/heritage/place/[id]` |
| `province` (matched by `slug`) | `/province/[id]` |
| `heritagePlace`, `province` | Search suggestions on `/destination/region` |

Rules for Contentful code:
- Always query with `content_type`. Never fetch all entries and filter by content-type-id substrings. That approach once leaked `heritagePlace` entries into the festival section, because `cultureHeritage` and `heritagePlace` share the substring "heritage".
- Field names differ per type. For example, `heritagePlace` uses `name` and `region`, while most other types use `title`. Rich-text fields are rendered by small hand-written recursive renderers in each file.
- Fetching happens in server components through `lib/contentful.ts`. Pass the data down as props to `'use client'` components. The access token is not exposed to the browser.

`/destination/[id]` renders a `destination` entry by Contentful entry id (home slider cards link there) and calls `notFound()` for unknown ids.

## Navigation and routing

- Menu and footer links live in one config, `lib/navigation.ts` (`MAIN_NAVIGATION`, `FOOTER_NAVIGATION`, `FOOTER_LEGAL`). Each item has `mn`, `en`, `href` and `status`. `app/layout.tsx` filters it server-side: see the next bullet for how `status` is rendered; in production sections with no live items are dropped. `Navbar.tsx` and `Footer.tsx` only render what they are given. All dropdown panels stay in the server HTML and are hidden with CSS so crawlers see the links. Six sections must fit in one row at 1280px: the desktop nav starts at 1200px, uses 13px text below `xl`, and the search/language buttons are icon-only on desktop. Links must point at routes that exist; unknown `/destination/<x>` paths now 404. Travel regions are one page, `/destination/region?region=<id>`, with ids defined in `REGION_CAROUSEL` in `components/RegionDirectory.tsx`: `central`, `khangai`, `gobi`, `altai-west`, `eastern`, `khuvsgul-north`, `ulaanbaatar`.
- Every menu/footer item has `status: "live" | "draft" | "planned"` (`lib/navigation.ts`), which also gates whole pages via `isPageLive(path)` / `isUnpublishedPage(path)`. Previews (`isPreviewEnv()`, i.e. `VERCEL_ENV !== "production"`) show everything: draft items are clickable with a blue "Ноорог" badge, planned items are unlinked with an amber "Тун удахгүй" badge. In production only `live` items render; a page whose entry is not live gets `robots: noindex` (via `metaFor` in `lib/pageMeta.ts`) and is left out of `app/sitemap.ts`, but still renders with 200 so links to it do not break. New pages are merged as `draft` and set to `live` once the owner approves the content (docs/plan/ia-plan.md principle 7). Pages outside the menu take their status from `PAGE_STATUS` in the same file (e.g. `/stories`), otherwise they count as live. Any in-page button or link to a page must go through `liveHref(href)`, which returns `undefined` in production when the target is not live, so those buttons disappear automatically (used by the `moreHref` buttons, `GuidePage`, `Breadcrumbs`, the hubs). `isPreviewEnv()` reads `SITE_ENV`, which `next.config.js` sets from `VERCEL_ENV` at build time so client components get it too.
- Search: `lib/searchIndex.ts` (`SITE_SEARCH_INDEX`) is a hand-maintained list of site pages with keywords. `lib/searchText.ts` holds Mongolian-aware matching, which normalizes ү/у, ө/о and ь/й/и and matches on word stems so that case endings like "говийн" still match "говь".
- Language switching uses the Google Translate widget through the `googtrans` cookie (see `Navbar.tsx`). Wrap elements that must not be translated in `translate="no"` / `className="notranslate"`.
- `lib/seo.ts` and `lib/pageMeta.ts` hold per-page metadata. `app/sitemap.ts` and `app/robots.ts` generate SEO files.
- `app/api/chat/route.ts` (used by `AiAdvisor`) is currently a stub that returns a fixed reply. `@google/genai` is installed but not wired up.
