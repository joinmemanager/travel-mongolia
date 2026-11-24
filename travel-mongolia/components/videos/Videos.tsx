'use client';

import { useState } from 'react';

import { formatDuration, type Video, videoEmbedUrl, videoThumb } from '@/lib/videos';

// «Монголын үзэсгэлэн»-ий 16:9 картууд (нүүр хуудас: эхний 3, /videos: бүгд). Lite embed: эхлээд зөвхөн
// нүүр зураг (lazy), дарахад л тухайн картын байранд YouTube iframe ачаалагдаж тоглоно (сайтаас гарахгүй).
// Нэг удаад нэг бичлэг: өөрийг нь дарахад өмнөх iframe устаж зогсоно. Хуудас ачаалахад YouTube-ийн
// JS татагдахгүй тул хурд, CPU хэмнэнэ.
// Google Translate: гарчиг монгол бичвэр тул орчуулагдана (key={id}-тэй, React дахин ашиглахгүй),
// үргэлжлэх хугацаа notranslate. Картын солигдох хэсэг (зураг ↔ iframe) нь гарчгаас тусдаа элемент.
// GA4: video_play (source: home / videos_page), components/Analytics.tsx-ийн data-ga-event.

function VideoCard({
  video,
  playing,
  onPlay,
  source,
  headingLevel,
}: {
  video: Video;
  playing: boolean;
  onPlay: () => void;
  source: 'home' | 'videos_page';
  headingLevel: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  const duration = formatDuration(video.duration);
  return (
    <article>
      <div className="overflow-hidden relative rounded-2xl shadow-xs aspect-video bg-neutral-900">
        {playing ? (
          <iframe
            src={videoEmbedUrl(video.id)}
            title={video.title}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={onPlay}
            aria-label={`Тоглуулах: ${video.title}`}
            data-ga-event="video_play"
            data-ga-params={JSON.stringify({ video_id: video.id, video_title: video.title, source })}
            className="group block absolute inset-0 w-full h-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#15803d]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={videoThumb(video.id)}
              alt=""
              loading="lazy"
              decoding="async"
              className="object-cover absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t to-transparent from-black/50 via-black/5" />
            <span
              aria-hidden="true"
              className="flex absolute top-1/2 left-1/2 justify-center items-center w-14 h-14 text-white rounded-full backdrop-blur-sm transition-colors -translate-x-1/2 -translate-y-1/2 bg-black/45 group-hover:bg-[#15803d] group-focus-visible:bg-[#15803d]"
            >
              <svg viewBox="0 0 24 24" className="ml-0.5 w-6 h-6" fill="currentColor">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
            {duration && (
              <span
                translate="no"
                className="absolute right-2 bottom-2 py-0.5 px-1.5 text-xs font-semibold tabular-nums text-white rounded-md notranslate bg-black/75"
              >
                {duration}
              </span>
            )}
          </button>
        )}
      </div>
      <Heading className="mt-3 text-sm font-bold leading-snug sm:text-base text-neutral-900">
        <span key={video.id} className="line-clamp-2">
          {video.title}
        </span>
      </Heading>
    </article>
  );
}

// Гар утсанд 1, компьютерт 3 багана
export function VideoGrid({
  videos,
  source,
  headingLevel = 'h3',
}: {
  videos: Video[];
  source: 'home' | 'videos_page';
  headingLevel?: 'h2' | 'h3';
}) {
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <ul className="grid grid-cols-1 gap-x-5 gap-y-7 md:grid-cols-3">
      {videos.map((v) => (
        <li key={v.id}>
          <VideoCard
            video={v}
            playing={playing === v.id}
            onPlay={() => setPlaying(v.id)}
            source={source}
            headingLevel={headingLevel}
          />
        </li>
      ))}
    </ul>
  );
}
