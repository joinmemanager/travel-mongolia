// scripts/hero/build-hero-flight.sh үүсгэсэн, гараар засахгүй.
// Нэрэнд агуулгын hash байгаа тул /hero/* нь immutable кэштэй (next.config.js).
export const HERO_ASSETS = {
  light: '/hero/hero-flight-light.e6b4ff7066.mp4',
  desktop: '/hero/hero-flight-desktop.2735fcc80f.mp4',
  mobile: '/hero/hero-flight-mobile.f10e27a0de.mp4',
  poster: '/hero/hero-flight-poster.53406c3f55.webp',
  frames: '/hero/frames-6a58c209c9',
  frameCount: 205,
} as const;
