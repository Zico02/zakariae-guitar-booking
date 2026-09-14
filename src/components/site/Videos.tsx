import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { PlayIcon } from "@/components/icons";
import cover1 from "@/assets/video-1.jpg";
import cover2 from "@/assets/video-2.jpg";
import cover3 from "@/assets/video-3.jpg";

// Drop your own files in src/assets and set `src` (e.g. import video from "@/assets/lesson-1.mp4")
const ITEMS: { cover: string; src: string | null }[] = [
  { cover: cover1, src: null },
  { cover: cover2, src: null },
  { cover: cover3, src: null },
  { cover: cover2, src: null },
  { cover: cover3, src: null },
  { cover: cover1, src: null },
];

export function Videos() {
  const { t } = useI18n();
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <section id="videos" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-3xl sm:text-4xl">{t("videos.title")}</h2>
      <p className="mt-2 text-muted-foreground">{t("videos.subtitle")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            {playing === i && item.src ? (
              <video src={item.src} controls autoPlay className="aspect-video w-full bg-black" />
            ) : (
              <button
                type="button"
                onClick={() => item.src && setPlaying(i)}
                className="group relative block aspect-video w-full"
              >
                <img
                  src={item.cover}
                  alt=""
                  loading="lazy"
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-walnut-deep/30" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e6c7]/90 text-walnut-deep">
                    <PlayIcon />
                  </span>
                </span>
                {!item.src ? (
                  <span className="absolute bottom-2 start-3 text-xs text-[#f3e6c7]/90">
                    {t("videos.empty")}
                  </span>
                ) : null}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
