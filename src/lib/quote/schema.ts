import { z } from "zod";
import { contactMoments, OTHER_SERVICE, roofTypes } from "@content/quote-options";

/**
 * Validatie voor alle formulieren. Hetzelfde schema draait in de browser (directe
 * foutmeldingen per stap) en op de server (de enige controle die telt).
 * Foutmeldingen zijn in het Nederlands en zeggen wat de bezoeker moet doen.
 */

const roofTypeValues = roofTypes.map((item) => item.value);
const contactMomentValues = contactMoments.map((item) => item.value);

const POSTCODE = /^[1-9]\d{3}\s?[A-Za-z]{2}$/;
const HOUSE_NUMBER = /^\d{1,5}(\s?[-/]?\s?[A-Za-z0-9]{1,6})?$/;

/** "0612 345 678" → "0612345678". Laat een plus vooraan staan. */
export function normalizePhone(value: string): string {
  return value.replace(/[\s\-().]/g, "");
}

/** Nederlandse nummers (06, vast, +31, 0031) en internationale nummers met landcode. */
export function isValidPhone(value: string): boolean {
  const phone = normalizePhone(value);
  return /^(?:\+31|0031|0)[1-9]\d{8}$/.test(phone) || /^\+(?!31)\d{8,15}$/.test(phone);
}

/** "1234ab" → "1234 AB" */
export function normalizePostcode(value: string): string {
  const compact = value.replace(/\s/g, "").toUpperCase();
  return `${compact.slice(0, 4)} ${compact.slice(4)}`;
}

const name = z
  .string()
  .trim()
  .min(2, "Vul uw naam in.")
  .max(100, "Uw naam is te lang (maximaal 100 tekens).");

const phone = z
  .string()
  .trim()
  .min(1, "Vul uw telefoonnummer in.")
  .refine(isValidPhone, "Vul een geldig telefoonnummer in, bijvoorbeeld 06 12 34 56 78.");

const preferredMoment = z.enum(contactMomentValues, "Kies wanneer wij u het beste kunnen bereiken.");

/** Honeypot en invultijd: zie src/lib/security/spam.ts. */
const spamFields = {
  website: z.string().max(200).optional(),
  startedAt: z.number().int().nonnegative().optional(),
  turnstileToken: z.string().max(4096).optional(),
};

export const step1Schema = z.object({
  services: z
    .array(z.string().max(60))
    .min(1, `Kies minimaal één dienst. Weet u het nog niet? Kies dan "${OTHER_SERVICE.label}".`)
    .max(20),
  roofType: z.enum(roofTypeValues, "Kies wat voor dak u heeft."),
  urgent: z.boolean(),
});

export const step2Schema = z.object({
  postcode: z
    .string()
    .trim()
    .min(1, "Vul uw postcode in.")
    .regex(POSTCODE, "Vul een geldige postcode in, bijvoorbeeld 1234 AB."),
  houseNumber: z
    .string()
    .trim()
    .min(1, "Vul uw huisnummer in.")
    .regex(HOUSE_NUMBER, "Vul een geldig huisnummer in, bijvoorbeeld 10 of 10a."),
  street: z.string().trim().max(120, "De straatnaam is te lang.").optional(),
  city: z.string().trim().min(2, "Vul uw plaats in.").max(80, "De plaatsnaam is te lang."),
  description: z
    .string()
    .trim()
    .min(10, "Omschrijf kort wat er aan de hand is of wat u wilt laten doen (minimaal 10 tekens).")
    .max(3000, "Uw omschrijving is te lang (maximaal 3000 tekens)."),
});

export const step3Schema = z.object({
  name,
  phone,
  email: z
    .string()
    .trim()
    .min(1, "Vul uw e-mailadres in.")
    .max(254, "Uw e-mailadres is te lang.")
    .pipe(z.email("Vul een geldig e-mailadres in, bijvoorbeeld naam@voorbeeld.nl.")),
  preferredMoment,
  privacyConsent: z.literal(true, "Geef aan dat u akkoord gaat met de privacyverklaring."),
});

export const stepSchemas = [step1Schema, step2Schema, step3Schema] as const;

/** Het volledige offerteformulier zoals het naar de server gaat. */
export const quoteFormSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...spamFields,
});

export const callbackFormSchema = z.object({
  name,
  phone,
  preferredMoment,
  ...spamFields,
});

export const contactFormSchema = z.object({
  name,
  email: z
    .string()
    .trim()
    .min(1, "Vul uw e-mailadres in.")
    .max(254, "Uw e-mailadres is te lang.")
    .pipe(z.email("Vul een geldig e-mailadres in, bijvoorbeeld naam@voorbeeld.nl.")),
  // Optioneel: een leeg veld is goed, een ingevuld veld moet een geldig nummer zijn.
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidPhone(value), "Vul een geldig telefoonnummer in, of laat het veld leeg.")
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, "Schrijf een bericht van minimaal 10 tekens.")
    .max(3000, "Uw bericht is te lang (maximaal 3000 tekens)."),
  ...spamFields,
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
export type CallbackFormValues = z.infer<typeof callbackFormSchema>;

/** Veldnaam → eerste foutmelding. */
export type FieldErrors = Record<string, string>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    errors[field] ??= issue.message;
  }
  return errors;
}
