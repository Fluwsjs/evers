import { NextResponse } from "next/server";
import { getCompanyRecipient, sendMail } from "@/lib/mail/send";
import { companyMail } from "@/lib/mail/templates";
import { createReference } from "@/lib/quote/reference";
import { callbackFormSchema, normalizePhone, toFieldErrors } from "@/lib/quote/schema";
import type { QuoteRequest } from "@/lib/quote/types";
import { clientIp, isRateLimited, looksLikeBot } from "@/lib/security/spam";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { routes } from "@/lib/site";

export const runtime = "nodejs";

const GENERIC_ERROR = "Het verzenden is niet gelukt. Probeer het opnieuw of bel ons.";

/**
 * Ontvangt het terugbelformulier.
 *
 * Met JavaScript stuurt het formulier JSON en krijgt het JSON terug. Zonder JavaScript
 * komt het als gewoon formulier binnen en volgt een redirect naar de bedankpagina
 * (of terug naar het formulier bij een fout).
 */
export async function POST(request: Request) {
  const wantsJson = (request.headers.get("content-type") ?? "").includes("application/json");

  const respond = (status: number, body: { ok: boolean; message?: string; fieldErrors?: Record<string, string>; reference?: string }) => {
    if (wantsJson) return NextResponse.json(body, { status });
    const target = body.ok ? `${routes.thanks}?type=terugbel` : `${routes.contact}?fout=terugbel`;
    return NextResponse.redirect(new URL(target, request.url), 303);
  };

  const ip = clientIp(request);
  if (isRateLimited(`terugbel:${ip}`)) {
    return respond(429, { ok: false, message: "U heeft kort na elkaar meerdere verzoeken verstuurd. Probeer het later opnieuw of bel ons." });
  }

  let raw: Record<string, unknown>;
  try {
    if (wantsJson) {
      raw = (await request.json()) as Record<string, unknown>;
    } else {
      const form = await request.formData();
      raw = Object.fromEntries([...form.entries()].filter(([, value]) => typeof value === "string"));
      // Zonder JavaScript is er geen starttijd; het veld blijft dan leeg.
      delete raw.startedAt;
    }
  } catch {
    return respond(400, { ok: false, message: GENERIC_ERROR });
  }

  const parsed = callbackFormSchema.safeParse(raw);
  if (!parsed.success) {
    return respond(422, {
      ok: false,
      message: "Niet alle velden zijn goed ingevuld. Controleer de gemarkeerde velden.",
      fieldErrors: toFieldErrors(parsed.error),
    });
  }
  const values = parsed.data;

  if (looksLikeBot(values)) {
    return respond(200, { ok: true, reference: createReference() });
  }

  if (!(await verifyTurnstile(values.turnstileToken, ip))) {
    return respond(403, { ok: false, message: "De controle tegen spam is niet gelukt. Vernieuw de pagina en probeer het opnieuw." });
  }

  const now = new Date();
  const callback: QuoteRequest = {
    id: createReference(now),
    createdAt: now.toISOString(),
    source: "terugbel",
    services: [],
    roofType: null,
    urgent: false,
    address: null,
    description: null,
    photos: [],
    contact: {
      name: values.name,
      phone: normalizePhone(values.phone),
      email: null,
      preferredMoment: values.preferredMoment,
    },
    estimate: null,
    // Het terugbelformulier vraagt geen vinkje: de bezoeker wordt bij het formulier
    // gewezen op de privacyverklaring en vraagt zelf om teruggebeld te worden.
    consent: { privacy: false, at: now.toISOString() },
  };

  try {
    await sendMail({ to: getCompanyRecipient(), ...companyMail(callback) });
  } catch {
    console.error("Terugbelverzoek kon niet per mail worden verzonden.");
    return respond(502, { ok: false, message: GENERIC_ERROR });
  }

  return respond(200, { ok: true, reference: callback.id });
}
