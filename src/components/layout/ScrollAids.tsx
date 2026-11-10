"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { MAIN_CONTENT_ID } from "./SkipLink";

/** Vanaf hoeveel pixels scrollen de knop "Naar boven" verschijnt. */
const SHOW_AFTER = 900;

/**
 * Twee hulpjes op lange pagina's: een dunne voortgangsbalk bovenaan en een knop terug
 * naar boven. De balk is puur decoratief (verborgen voor schermlezers). Zonder JavaScript
 * verschijnt geen van beide; de pagina werkt dan gewoon.
 */
export function ScrollAids() {
  const bar = useRef<HTMLSpanElement>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      setShowButton(window.scrollY > SHOW_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const toTop = () => {
    // Rustig of direct scrollen volgt de instelling in globals.css (prefers-reduced-motion).
    window.scrollTo({ top: 0 });
    // De focus gaat mee, zodat Tab daarna bovenaan verdergaat in plaats van onderaan.
    document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
  };

  return (
    <>
      <span aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50 block h-1">
        <span ref={bar} className="block h-full origin-left bg-brand" style={{ transform: "scaleX(0)" }} />
      </span>
      {showButton ? (
        <button
          type="button"
          onClick={toTop}
          className="fixed right-4 bottom-20 z-30 grid size-12 place-items-center rounded-full bg-ink text-white shadow-card hover:bg-ink-700 md:right-6 md:bottom-6"
        >
          <Icon name="chevron-down" className="rotate-180" />
          <span className="sr-only">Naar boven</span>
        </button>
      ) : null}
    </>
  );
}
