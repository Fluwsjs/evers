import { NextResponse } from "next/server";
import { getCompanyRecipient, sendMail } from "@/lib/mail/send";
import { companyMail, confirmationMail } from "@/lib/mail/templates";
import { createReference } from "@/lib/quote/reference";
import { contactFormSchema, normalizePhone, toFieldErrors } from "@/lib/quote/schema";
import type { QuoteRequest } from "@/lib/quote/types";
import { clientIp, isRateLimited, looksLikeBot } from "@/lib/security/spam";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { routes } from "@/lib/site";

export const runtime = "nodejs";

const GENERIC_ERROR = "Het verzenden is niet gelukt. Probeer het opnieuw of bel ons.";

/**
 * Ontvangt het korte contactformulier. Werkt net als /api/terugbellen: JSON met
 * JavaScript, een gewoon formulier met redirect zonder.
 */
export async function POST(request: Request) {
  const wantsJson = (request.headers.get("content-type") ?? "").includes("application/json");

  const respond = (status: number, body: { ok: boolean; message?: string; fieldErrors?: Record<string, string>; reference?: string }) => {
    if (wantsJson) return NextResponse.json(body, { status });
    const target = body.ok ? `${routes.thanks}?type=contact` : `${routes.contact}?fout=contact`;
    return NextResponse.redirect(new URL(target, request.url), 303);
  };

  const ip = clientIp(request);
  if (isRateLimited(`contact:${ip}`)) {
    return respond(429, { ok: false, message: "U heeft kort na elkaar meerdere berichten verstuurd. Probeer het later opnieuw of bel ons." });
  }

  let raw: Record<string, unknown>;
  try {
    if (wantsJson) {
      raw = (await request.json()) as Record<string, unknown>;
    } else {
      const form = await request.formData();
      raw = Object.fromEntries([...form.entries()].filter(([, value]) => typeof value === "string"));
      delete raw.startedAt;
    }
  } catch {
    return respond(400, { ok: false, message: GENERIC_ERROR });
  }

  const parsed = contactFormSchema.safeParse(raw);
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
  const message: QuoteRequest = {
    id: createReference(now),
    createdAt: now.toISOString(),
    source: "contact",
    services: [],
    roofType: null,
    urgent: false,
    address: null,
    description: values.message,
    photos: [],
    contact: {
      name: values.name,
      phone: values.phone ? normalizePhone(values.phone) : null,
      email: values.email,
      preferredMoment: "zsm",
    },
    estimate: null,
    consent: { privacy: false, at: now.toISOString() },
  };

  try {
    await sendMail({ to: getCompanyRecipient(), replyTo: values.email, ...companyMail(message) });
  } catch {
    console.error("Contactbericht kon niet per mail worden verzonden.");
    return respond(502, { ok: false, message: GENERIC_ERROR });
  }

  try {
    await sendMail({ to: values.email, ...confirmationMail(message) });
  } catch {
    console.error("Bevestigingsmail kon niet worden verzonden.");
  }

  return respond(200, { ok: true, reference: message.id });
}
