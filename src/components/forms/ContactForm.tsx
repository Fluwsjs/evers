"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { contactFormSchema, toFieldErrors, type FieldErrors } from "@/lib/quote/schema";
import { fieldId, Honeypot, TextAreaField, TextField } from "./Field";
import { Turnstile, turnstileEnabled } from "./Turnstile";

/**
 * Kort contactformulier: naam, e-mail, telefoon (optioneel) en bericht.
 * De veldnamen krijgen het voorvoegsel "contact-" in hun id, zodat ze niet botsen met
 * andere formulieren op dezelfde pagina. Werkt ook zonder JavaScript.
 */
export function ContactForm({ privacyHref, thanksHref }: { privacyHref: string; thanksHref: string }) {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const onTurnstileToken = useCallback((token: string | undefined) => setTurnstileToken(token), []);
  const set = (key: keyof typeof values, value: string) => setValues((current) => ({ ...current, [key]: value }));
  /** Foutmeldingen staan onder de veldnaam van de server; de velden zelf heten "contact-…". */
  const error = (key: string) => errors[key];

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const payload = { ...values, startedAt: startedAt.current, turnstileToken };
    const result = contactFormSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors = toFieldErrors(result.error);
      setErrors(fieldErrors);
      const first = Object.keys(fieldErrors)[0];
      if (first) document.getElementById(fieldId(`contact-${first}`))?.focus();
      return;
    }
    if (turnstileEnabled && !turnstileToken) {
      setFormError("Wacht even tot de controle tegen spam klaar is en probeer het opnieuw.");
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok: boolean; message?: string; fieldErrors?: FieldErrors; reference?: string };
      if (data.ok) {
        router.push(`${thanksHref}?type=contact${data.reference ? `&ref=${encodeURIComponent(data.reference)}` : ""}`);
        return;
      }
      setFormError(data.message ?? "Het verzenden is niet gelukt. Probeer het opnieuw of bel ons.");
      if (data.fieldErrors) setErrors(data.fieldErrors);
    } catch {
      setFormError("Het verzenden is niet gelukt. Controleer uw internetverbinding en probeer het opnieuw.");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={submit} action="/api/contact/" method="post" noValidate className="relative space-y-5">
      {formError ? (
        <p role="alert" className="rounded-lg border border-red-700 bg-red-50 p-3 font-semibold text-red-900">
          {formError}
        </p>
      ) : null}

      <TextField
        name="contact-name"
        submitName="name"
        label="Naam"
        value={values.name}
        onChange={(event) => set("name", event.target.value)}
        error={error("name")}
        autoComplete="name"
        maxLength={100}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="contact-email"
          submitName="email"
          label="E-mailadres"
          type="email"
          inputMode="email"
          value={values.email}
          onChange={(event) => set("email", event.target.value)}
          error={error("email")}
          autoComplete="email"
          maxLength={254}
        />
        <TextField
          name="contact-phone"
          submitName="phone"
          label="Telefoonnummer"
          type="tel"
          inputMode="tel"
          optional
          value={values.phone}
          onChange={(event) => set("phone", event.target.value)}
          error={error("phone")}
          autoComplete="tel"
          maxLength={20}
        />
      </div>
      <TextAreaField
        name="contact-message"
        submitName="message"
        label="Uw bericht"
        value={values.message}
        onChange={(event) => set("message", event.target.value)}
        error={error("message")}
        maxLength={3000}
        rows={5}
      />

      <Honeypot value={values.website} onChange={(value) => set("website", value)} />
      <Turnstile onToken={onTurnstileToken} />

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Bezig met verzenden…" : "Bericht versturen"}
        {submitting ? null : <Icon name="arrow-right" />}
      </Button>

      <p className="text-sm text-muted">
        Wij gebruiken uw gegevens alleen om uw bericht te beantwoorden. Lees onze{" "}
        <Link href={privacyHref} className="font-semibold underline">
          privacyverklaring
        </Link>
        .
      </p>
    </form>
  );
}
