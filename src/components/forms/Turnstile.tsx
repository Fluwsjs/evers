"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          language?: string;
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Of de Turnstile-widget in formulieren getoond wordt. */
export const turnstileEnabled = Boolean(SITE_KEY);

/**
 * Cloudflare Turnstile. Rendert niets zolang NEXT_PUBLIC_TURNSTILE_SITE_KEY niet is ingesteld.
 * Het script wordt pas geladen op pagina's met een formulier.
 */
export function Turnstile({ onToken }: { onToken: (token: string | undefined) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!SITE_KEY || !scriptReady || !container || !window.turnstile) return;

    const widgetId = window.turnstile.render(container, {
      sitekey: SITE_KEY,
      language: "nl",
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(undefined),
      "error-callback": () => onToken(undefined),
    });
    return () => window.turnstile?.remove(widgetId);
  }, [scriptReady, onToken]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="min-h-[65px]" />
    </>
  );
}
