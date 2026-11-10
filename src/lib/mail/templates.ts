import { site } from "@config/site";
import { contactMoments, OTHER_SERVICE, roofTypes } from "@content/quote-options";
import { services } from "@content/services";
import type { QuoteRequest } from "@/lib/quote/types";

/**
 * HTML- en tekstversies van de mails. Alle waarden uit het formulier gaan door `escapeHtml`
 * voordat ze in de HTML komen.
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function serviceLabel(slug: string): string {
  if (slug === OTHER_SERVICE.value) return OTHER_SERVICE.label;
  return services.find((service) => service.slug === slug)?.title ?? slug;
}

const roofTypeLabel = (value: QuoteRequest["roofType"]) =>
  roofTypes.find((item) => item.value === value)?.label ?? "Niet opgegeven";
const momentLabel = (value: QuoteRequest["contact"]["preferredMoment"]) =>
  contactMoments.find((item) => item.value === value)?.label ?? value;

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("nl-NL", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Amsterdam" }).format(
    new Date(iso),
  );
const formatEuro = (amount: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(amount);

type Row = [label: string, value: string];

/** De gegevens van een aanvraag als rijen, gebruikt voor zowel HTML als platte tekst. */
function requestRows(request: QuoteRequest): Row[] {
  const rows: Row[] = [];
  if (request.services.length > 0) rows.push(["Diensten", request.services.map(serviceLabel).join(", ")]);
  if (request.roofType) rows.push(["Type dak", roofTypeLabel(request.roofType)]);
  if (request.source === "offerte" || request.source === "calculator") rows.push(["Spoed", request.urgent ? "Ja" : "Nee"]);
  if (request.address) {
    const { street, houseNumber, postcode, city } = request.address;
    rows.push(["Adres", `${street ? `${street} ` : ""}${houseNumber}, ${postcode} ${city}`]);
  }
  if (request.description) rows.push([request.source === "contact" ? "Bericht" : "Omschrijving", request.description]);
  if (request.estimate) {
    rows.push([
      "Indicatie calculator",
      [
        ...request.estimate.lines.map(
          (line) => `${line.label}: ${line.quantity} ${line.unit} = ${formatEuro(line.amountInclVat)}`,
        ),
        `Totaal vanaf ${formatEuro(request.estimate.totalInclVat)} incl. btw`,
      ].join("\n"),
    ]);
  }
  return rows;
}

function contactRows(request: QuoteRequest): Row[] {
  const rows: Row[] = [["Naam", request.contact.name]];
  if (request.contact.phone) rows.push(["Telefoon", request.contact.phone]);
  if (request.contact.email) rows.push(["E-mail", request.contact.email]);
  if (request.source !== "contact") rows.push(["Voorkeur contactmoment", momentLabel(request.contact.preferredMoment)]);
  return rows;
}

function table(rows: Row[]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #e4ded6;color:#5f5a54;font-size:14px;vertical-align:top;width:170px;">${escapeHtml(label)}</td><td style="padding:8px 0;border-bottom:1px solid #e4ded6;font-size:15px;vertical-align:top;white-space:pre-line;">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>`;
}

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f7f3ee;font-family:Arial,Helvetica,sans-serif;color:#14120f;line-height:1.5;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f7f3ee;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;background:#ffffff;border:1px solid #e4ded6;border-radius:12px;">
<tr><td style="padding:20px 28px;border-bottom:4px solid #fe5d14;font-size:18px;font-weight:bold;">${escapeHtml(site.name)}</td></tr>
<tr><td style="padding:28px;">${body}</td></tr>
</table>
</td></tr></table>
</body>
</html>`;
}

const h1 = (text: string) => `<h1 style="margin:0 0 8px;font-size:22px;line-height:1.25;">${escapeHtml(text)}</h1>`;
const h2 = (text: string) => `<h2 style="margin:28px 0 8px;font-size:16px;">${escapeHtml(text)}</h2>`;
const p = (html: string) => `<p style="margin:0 0 12px;font-size:15px;">${html}</p>`;
const textRows = (rows: Row[]) => rows.map(([label, value]) => `${label}: ${value}`).join("\n");

export interface RenderedMail {
  subject: string;
  html: string;
  text: string;
}

/** Mail naar het bedrijf met alle gegevens. De foto's gaan mee als bijlage. */
export function companyMail(request: QuoteRequest, omittedPhotos: string[] = []): RenderedMail {
  const isCallback = request.source !== "offerte" && request.source !== "calculator";
  const kind =
    request.source === "terugbel" ? "Terugbelverzoek" : request.source === "contact" ? "Bericht via contactformulier" : "Offerteaanvraag";
  const where = request.address ? ` – ${request.address.city}` : "";
  // Geen regeleinden in het onderwerp: die horen niet in een mailheader.
  const subject = `${request.urgent ? "[SPOED] " : ""}${kind} ${request.id}: ${request.contact.name}${where}`.replace(
    /[\r\n]+/g,
    " ",
  );

  const photoNote =
    request.photos.length > 0
      ? `${request.photos.length} foto${request.photos.length === 1 ? "" : "'s"} als bijlage.`
      : isCallback
        ? ""
        : "Geen foto's meegestuurd.";
  const omittedNote =
    omittedPhotos.length > 0
      ? `Let op: ${omittedPhotos.length} foto('s) pasten niet meer in de mail en zijn niet meegestuurd. Vraag ze zo nodig op bij de klant.`
      : "";

  const html = layout(
    subject,
    [
      h1(`${kind}${request.urgent ? " (spoed)" : ""}`),
      p(`Referentie <strong>${escapeHtml(request.id)}</strong> · ontvangen op ${escapeHtml(formatDate(request.createdAt))}`),
      h2("Contactgegevens"),
      table(contactRows(request)),
      ...(requestRows(request).length > 0 ? [h2("Aanvraag"), table(requestRows(request))] : []),
      photoNote ? p(`<br>${escapeHtml(photoNote)}`) : "",
      omittedNote ? p(`<strong>${escapeHtml(omittedNote)}</strong>`) : "",
      p(
        `<br><span style="color:#5f5a54;font-size:13px;">Beantwoord deze mail om direct naar de klant te schrijven. Verzonden via het formulier op ${escapeHtml(site.url)}.</span>`,
      ),
    ].join(""),
  );

  const text = [
    `${kind}${request.urgent ? " (SPOED)" : ""}`,
    `Referentie ${request.id}, ontvangen op ${formatDate(request.createdAt)}`,
    "",
    "CONTACTGEGEVENS",
    textRows(contactRows(request)),
    "",
    ...(requestRows(request).length > 0 ? ["AANVRAAG", textRows(requestRows(request)), ""] : []),
    photoNote,
    omittedNote,
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  return { subject, html, text };
}

/** Bevestiging naar de klant, met een samenvatting van wat is verzonden. */
export function confirmationMail(request: QuoteRequest): RenderedMail {
  const isMessage = request.source === "contact";
  const subject = `Wij hebben uw ${isMessage ? "bericht" : "aanvraag"} ontvangen (${request.id})`;
  const { contact } = site;
  const received = isMessage
    ? "Wij hebben uw bericht in goede orde ontvangen en nemen contact met u op."
    : "Wij hebben uw aanvraag in goede orde ontvangen. Wij nemen contact met u op om uw situatie te bespreken en zo nodig een afspraak te maken om uw dak te bekijken.";

  const html = layout(
    subject,
    [
      h1(request.source === "contact" ? "Bedankt voor uw bericht" : "Bedankt voor uw aanvraag"),
      p(`Beste ${escapeHtml(request.contact.name)},`),
      p(received),
      p(`Uw referentienummer is <strong>${escapeHtml(request.id)}</strong>.`),
      h2(isMessage ? "Uw bericht" : "Uw aanvraag"),
      table([...requestRows(request), ...(request.photos.length > 0 ? ([["Foto's", `${request.photos.length} meegestuurd`]] as Row[]) : [])]),
      h2("Uw gegevens"),
      table(contactRows(request)),
      h2("Heeft u nog een vraag?"),
      p(
        `Bel ${escapeHtml(contact.phoneDisplay)} of mail naar <a href="mailto:${escapeHtml(contact.email)}" style="color:#c2410c;">${escapeHtml(contact.email)}</a>.`,
      ),
      p(`Met vriendelijke groet,<br>${escapeHtml(site.name)}`),
      p(
        `<br><span style="color:#5f5a54;font-size:13px;">U ontvangt deze mail omdat u een formulier heeft ingevuld op ${escapeHtml(site.url)}. Heeft u dat niet gedaan? Dan kunt u deze mail negeren.</span>`,
      ),
    ].join(""),
  );

  const text = [
    isMessage ? "Bedankt voor uw bericht" : "Bedankt voor uw aanvraag",
    "",
    `Beste ${request.contact.name},`,
    "",
    received,
    "",
    `Uw referentienummer is ${request.id}.`,
    "",
    isMessage ? "UW BERICHT" : "UW AANVRAAG",
    textRows(requestRows(request)),
    "",
    "UW GEGEVENS",
    textRows(contactRows(request)),
    "",
    `Heeft u nog een vraag? Bel ${contact.phoneDisplay} of mail naar ${contact.email}.`,
    "",
    "Met vriendelijke groet,",
    site.name,
  ].join("\n");

  return { subject, html, text };
}
