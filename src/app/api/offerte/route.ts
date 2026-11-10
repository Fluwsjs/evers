import { NextResponse } from "next/server";
import { OTHER_SERVICE } from "@content/quote-options";
import { getCompanyRecipient, sendMail } from "@/lib/mail/send";
import { companyMail, confirmationMail } from "@/lib/mail/templates";
import { processPhotos } from "@/lib/quote/photos.server";
import { createReference } from "@/lib/quote/reference";
import { normalizePhone, normalizePostcode, quoteFormSchema, toFieldErrors } from "@/lib/quote/schema";
import type { QuoteRequest } from "@/lib/quote/types";
import { clientIp, isRateLimited, looksLikeBot } from "@/lib/security/spam";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { getActiveServices } from "@/lib/site";

export const runtime = "nodejs";

/** 5 foto's van 10 MB plus wat ruimte voor de overige velden. */
const MAX_BODY_BYTES = 52 * 1024 * 1024;

const GENERIC_ERROR = "Het verzenden is niet gelukt. Probeer het opnieuw of bel ons.";

function fail(status: number, message: string, fieldErrors?: Record<string, string>) {
  return NextResponse.json({ ok: false, message, fieldErrors }, { status });
}

/**
 * Ontvangt het offerteformulier (multipart: `payload` als JSON plus `photos`).
 * Er wordt niets opgeslagen en niets gelogd; de aanvraag gaat per mail naar het bedrijf
 * en de klant krijgt een bevestiging.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  if (isRateLimited(`offerte:${ip}`)) {
    return fail(429, "U heeft kort na elkaar meerdere aanvragen verstuurd. Probeer het over tien minuten opnieuw of bel ons.");
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return fail(413, "De foto's zijn samen te groot. Stuur maximaal 5 foto's van elk maximaal 10 MB.");
  }

  let form: FormData;
  let raw: unknown;
  try {
    form = await request.formData();
    raw = JSON.parse(String(form.get("payload") ?? ""));
  } catch {
    return fail(400, GENERIC_ERROR);
  }

  const parsed = quoteFormSchema.safeParse(raw);
  if (!parsed.success) {
    return fail(422, "Niet alle velden zijn goed ingevuld. Controleer de gemarkeerde velden.", toFieldErrors(parsed.error));
  }
  const values = parsed.data;

  // Bots krijgen een "gelukt" terug zonder dat er iets wordt verstuurd.
  if (looksLikeBot(values)) {
    return NextResponse.json({ ok: true, reference: createReference() });
  }

  if (!(await verifyTurnstile(values.turnstileToken, ip))) {
    return fail(403, "De controle tegen spam is niet gelukt. Vernieuw de pagina en probeer het opnieuw.", {
      turnstile: "De controle tegen spam is niet gelukt. Probeer het opnieuw.",
    });
  }

  const allowedServices = new Set<string>([...getActiveServices().map((service) => service.slug), OTHER_SERVICE.value]);
  if (!values.services.every((slug) => allowedServices.has(slug))) {
    return fail(422, "Een van de gekozen diensten bestaat niet (meer). Kies opnieuw.", {
      services: "Kies een dienst uit de lijst.",
    });
  }

  const files = form.getAll("photos").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const photoResult = await processPhotos(files);
  if (!photoResult.ok) {
    return fail(422, photoResult.message, { photos: photoResult.message });
  }
  const { attachments, omitted } = photoResult.photos;

  const now = new Date();
  const quote: QuoteRequest = {
    id: createReference(now),
    createdAt: now.toISOString(),
    source: "offerte",
    services: values.services,
    roofType: values.roofType,
    urgent: values.urgent,
    address: {
      postcode: normalizePostcode(values.postcode),
      houseNumber: values.houseNumber,
      street: values.street || null,
      city: values.city,
    },
    description: values.description,
    photos: attachments.map((attachment) => ({
      filename: attachment.filename,
      contentType: attachment.contentType,
      size: attachment.content.length,
    })),
    contact: {
      name: values.name,
      phone: normalizePhone(values.phone),
      email: values.email,
      preferredMoment: values.preferredMoment,
    },
    estimate: null,
    consent: { privacy: values.privacyConsent, at: now.toISOString() },
  };

  try {
    await sendMail({
      to: getCompanyRecipient(),
      replyTo: quote.contact.email ?? undefined,
      attachments,
      ...companyMail(quote, omitted),
    });
  } catch {
    // Bewust geen details: in de log mogen geen gegevens van de aanvrager komen.
    console.error("Offerteaanvraag kon niet per mail worden verzonden.");
    return fail(502, GENERIC_ERROR);
  }

  // De aanvraag is binnen; een mislukte bevestiging mag dat niet meer tegenhouden.
  if (quote.contact.email) {
    try {
      await sendMail({ to: quote.contact.email, ...confirmationMail(quote) });
    } catch {
      console.error("Bevestigingsmail kon niet worden verzonden.");
    }
  }

  return NextResponse.json({ ok: true, reference: quote.id });
}
