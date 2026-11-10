import Script from "next/script";

/**
 * Bezoekersstatistieken met Plausible: zonder cookies en zonder bezoekers individueel te
 * volgen, dus zonder cookiemelding. Staat uit zolang NEXT_PUBLIC_PLAUSIBLE_DOMAIN leeg is.
 *
 * NEXT_PUBLIC_PLAUSIBLE_SRC is alleen nodig bij een zelf gehoste Plausible.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <Script
      src={process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js"}
      data-domain={domain}
      strategy="afterInteractive"
    />
  );
}
