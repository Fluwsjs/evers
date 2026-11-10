import "server-only";

/**
 * Cloudflare Turnstile. Staat aan zodra TURNSTILE_SECRET_KEY is ingesteld
 * (samen met NEXT_PUBLIC_TURNSTILE_SITE_KEY voor de widget in het formulier).
 * Zonder sleutels blijven de honeypot, de invultijd en de rate limit actief.
 */
export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  if (!isTurnstileEnabled()) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY ?? "", response: token });
    if (ip !== "onbekend") body.set("remoteip", ip);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}
