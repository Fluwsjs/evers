import "server-only";

/**
 * Spambeveiliging naast Cloudflare Turnstile.
 *
 * - Honeypot: een verborgen veld ("website") dat mensen niet zien en bots wel invullen.
 * - Invultijd: een formulier dat binnen een paar seconden na het laden terugkomt is geen mens.
 * - Rate limit: maximaal een handvol verzendingen per IP-adres per tien minuten.
 *
 * Bij de honeypot en de invultijd doet de server alsof het verzenden is gelukt, zodat een
 * bot niet leert wat hem tegenhoudt.
 */

const MIN_FILL_TIME_MS = 3000;

export function looksLikeBot(fields: { website?: string; startedAt?: number }): boolean {
  if (fields.website && fields.website.trim() !== "") return true;
  if (fields.startedAt !== undefined && Date.now() - fields.startedAt < MIN_FILL_TIME_MS) return true;
  return false;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

/**
 * Eenvoudige rate limit in het geheugen van het proces. Voldoende voor één server;
 * bij meerdere instanties hoort dit in de reverse proxy of een gedeelde opslag.
 */
export function isRateLimited(key: string, limit = MAX_REQUESTS): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  // Voorkom dat de map eindeloos groeit.
  if (hits.size > 5000) {
    for (const [storedKey, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(storedKey);
    }
  }
  return false;
}

/** IP-adres van de bezoeker, zoals doorgegeven door de reverse proxy. Alleen gebruikt als sleutel. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "onbekend";
}
