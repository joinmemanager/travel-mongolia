# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Ажлын дүрэм

- **`main` руу шууд push хийхгүй.** `main` руу орсон бүх зүйл travelhubmongolia.com дээр шууд гардаг.
- Ажил бүрийг `main`-аас салгасан тусдаа branch дээр хийнэ (жишээ нь `fix/festival-images`, `feat/region-search`). Тэр branch-аа GitHub руу push хийнэ.
- Push хийсний дараа Vercel-ийн preview deploy дуусахыг хүлээгээд **preview URL-ыг хэрэглэгчид өгнө**. URL-ыг ингэж олно:
  1. Branch бүр тогтмол хаягтай: `https://travel-mongolia-web-git-<branch>-joinme1.vercel.app`. Branch нэр дэх `/`-г `-` болгоно. Жишээ нь `fix/festival-images` → `travel-mongolia-web-git-fix-festival-images-joinme1.vercel.app`. Энэ хаяг тухайн branch-ийн хамгийн сүүлийн deploy руу заана.
  2. Build амжилттай болсныг `https://api.github.com/repos/joinmemanager/travel-mongolia/commits/<sha>/status` хаягийн `Vercel – travel-mongolia-web` мөрөөс шалгаад, дараа нь хаягийг өгнө. Нэвтрээгүй үед GitHub API цагт 60 хүсэлт зөвшөөрдөг тул 20 секунд тутам эсвэл түүнээс цөөн удаа шалгана.
  3. `Preview – travel-mongolia` project-ийн preview build fail болдог (2026-10-01-ний байдлаар). Тиймээс `-web` project-ийн preview-г өгнө.
  4. Preview холбоосууд Vercel-ийн хамгаалалттай (302 → нэвтрэх хуудас). Хэрэглэгч Vercel эрхээрээ нэвтэрч байж үзнэ. Байхгүй branch-ийн хаяг 404 буцаана.
- Хэрэглэгч preview дээр шалгаад **зөвшөөрсний дараа л** `main` руу merge хийж push хийнэ. Зөвшөөрөл ажил бүрт тусдаа авна.

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
- `app/layout.tsx` sets `dynamic = 'force-dynamic'`, so all pages render per request.
- Env vars (`.env.local`): `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN` (Delivery API, server-only), `GEMINI_API_KEY`.

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

- The mega-menu lives in `components/Navbar.tsx`. Its links must point at routes that exist. Unknown `/destination/<x>` paths fall through to the `[id]` page and show "not found" instead of a 404. Travel regions are one page, `/destination/region?region=<id>`, with ids defined in `REGION_CAROUSEL` in `components/RegionDirectory.tsx`: `central`, `khangai`, `gobi`, `altai-west`, `eastern`, `khuvsgul-north`, `ulaanbaatar`.
- Search: `lib/searchIndex.ts` (`SITE_SEARCH_INDEX`) is a hand-maintained list of site pages with keywords. `lib/searchText.ts` holds Mongolian-aware matching, which normalizes ү/у, ө/о and ь/й/и and matches on word stems so that case endings like "говийн" still match "говь".
- Language switching uses the Google Translate widget through the `googtrans` cookie (see `Navbar.tsx`). Wrap elements that must not be translated in `translate="no"` / `className="notranslate"`.
- `lib/seo.ts` and `lib/pageMeta.ts` hold per-page metadata. `app/sitemap.ts` and `app/robots.ts` generate SEO files.
- `app/api/chat/route.ts` (used by `AiAdvisor`) is currently a stub that returns a fixed reply. `@google/genai` is installed but not wired up.
