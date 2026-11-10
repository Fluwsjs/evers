"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { SiteImage } from "@content/images.generated";

interface BeforeAfterSliderProps {
  before: SiteImage;
  after: SiteImage;
  caption?: string;
}

/**
 * Voor/na-vergelijking met een schuif.
 *
 * De bediening is een gewone <input type="range">: werkt met muis, aanraking en
 * toetsenbord (pijltjes, Home, End) en wordt door schermlezers als schuifregelaar herkend.
 * Alleen gebruiken met twee echte foto's vanuit hetzelfde standpunt.
 */
export function BeforeAfterSlider({ before, after, caption }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const id = useId();

  return (
    <figure>
      <div className="relative isolate aspect-4/3 overflow-hidden rounded-card bg-sand-200 select-none">
        <Image
          src={after.src}
          alt={`Na: ${after.alt}`}
          fill
          sizes="(min-width: 1024px) 48rem, 100vw"
          placeholder="blur"
          blurDataURL={after.blurDataURL}
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image
            src={before.src}
            alt={`Voor: ${before.alt}`}
            fill
            sizes="(min-width: 1024px) 48rem, 100vw"
            placeholder="blur"
            blurDataURL={before.blurDataURL}
            className="object-cover"
          />
        </div>

        <span aria-hidden="true" className="absolute top-3 left-3 rounded-full bg-ink px-3 py-1 text-sm font-semibold text-white">
          Voor
        </span>
        <span aria-hidden="true" className="absolute top-3 right-3 rounded-full bg-brand px-3 py-1 text-sm font-semibold text-ink">
          Na
        </span>

        {/* Scheidslijn met greep */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-white" style={{ left: `${position}%` }}>
          <span className="absolute top-1/2 left-1/2 grid size-11 -translate-1/2 place-items-center rounded-full bg-white text-ink shadow-card">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 7-5 5 5 5m6-10 5 5-5 5" />
            </svg>
          </span>
        </span>

        <label htmlFor={id} className="sr-only">
          Schuif om de situatie voor en na te vergelijken
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-valuetext={`${position}% van de voor-foto zichtbaar`}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0 focus-visible:opacity-100 focus-visible:[&::-webkit-slider-runnable-track]:bg-transparent"
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted">{caption ?? "Schuif om het verschil te zien."}</figcaption>
    </figure>
  );
}
