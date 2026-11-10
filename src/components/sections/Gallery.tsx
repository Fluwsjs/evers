"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import type { SiteImage } from "@content/images.generated";
import { Icon } from "@/components/ui/Icon";

const controlClasses =
  "grid size-12 place-items-center rounded-full bg-white text-ink shadow-card hover:bg-sand-200 disabled:opacity-40";

/**
 * Fotogalerij met lightbox.
 *
 * Elke foto is een gewone link naar het beeldbestand; met JavaScript opent de klik
 * een <dialog> met de grote foto. De browser regelt daarbij de focus-trap, Escape en
 * het terugzetten van de focus. Met de pijltjestoetsen bladert u door de foto's.
 * De alt-tekst staat ook als bijschrift onder elke foto.
 */
export function Gallery({ photos, label }: { photos: SiteImage[]; label: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = openIndex === null ? undefined : photos[openIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openIndex !== null && !dialog.open) dialog.showModal();
    if (openIndex === null && dialog.open) dialog.close();
  }, [openIndex]);

  const open = (event: MouseEvent, index: number) => {
    // Met ctrl/cmd/shift of de middelste muisknop blijft het gewone linkgedrag werken.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    setOpenIndex(index);
  };

  const step = (delta: number) =>
    setOpenIndex((index) => (index === null ? index : (index + delta + photos.length) % photos.length));

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  return (
    <>
      <ul aria-label={label} className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {photos.map((photo, index) => (
          <li key={photo.src}>
            <figure>
              <a
                href={photo.src}
                onClick={(event) => open(event, index)}
                aria-label={`Foto ${index + 1} van ${photos.length} vergroten: ${photo.alt}`}
                className="group block overflow-hidden rounded-card"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  placeholder="blur"
                  blurDataURL={photo.blurDataURL}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </a>
              <figcaption className="mt-2 text-sm text-muted">{photo.alt}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={`${label}, vergrote foto`}
        onClose={() => setOpenIndex(null)}
        onKeyDown={onKeyDown}
        onClick={(event) => {
          // Klik op de donkere achtergrond (het dialog-element zelf) sluit de lightbox.
          if (event.target === event.currentTarget) setOpenIndex(null);
        }}
        className="on-dark m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-on-dark backdrop:bg-ink/80"
      >
        {current && openIndex !== null ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 p-4">
              <p aria-live="polite" className="font-semibold">
                Foto {openIndex + 1} van {photos.length}
              </p>
              <button type="button" onClick={() => setOpenIndex(null)} aria-label="Sluiten" className={controlClasses}>
                <Icon name="close" />
              </button>
            </div>

            <div className="relative flex min-h-0 grow items-center justify-center px-4">
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="100vw"
                className="max-h-full w-auto max-w-full rounded-lg object-contain"
              />
              {photos.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Vorige foto"
                    className={`${controlClasses} absolute top-1/2 left-3 -translate-y-1/2`}
                  >
                    <Icon name="arrow-right" className="rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Volgende foto"
                    className={`${controlClasses} absolute top-1/2 right-3 -translate-y-1/2`}
                  >
                    <Icon name="arrow-right" />
                  </button>
                </>
              ) : null}
            </div>

            <p className="p-4 text-center text-on-dark-muted">{current.alt}</p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
