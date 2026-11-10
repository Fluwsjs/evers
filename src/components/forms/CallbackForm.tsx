"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { contactMoments, type ContactMoment } from "@content/quote-options";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { callbackFormSchema, toFieldErrors, type FieldErrors } from "@/lib/quote/schema";
import { choiceClasses, choiceInputClasses, FieldError, fieldId, Honeypot } from "./Field";
import { Turnstile, turnstileEnabled } from "./Turnstile";

interface CallbackFormProps {
  privacyHref: string;
  thanksHref: string;
  /** Voorvoegsel voor veld-id's, zodat het formulier vaker op één pagina kan staan. */
  idPrefix?: string;
}

/**
 * Terugbelformulier: naam, telefoonnummer en voorkeursmoment.
 * Werkt ook zonder JavaScript: dan gaat het als gewoon formulier naar /api/terugbellen.
 */
export function CallbackForm({ privacyHref, thanksHref, idPrefix = "terugbel" }: CallbackFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [moment, setMoment] = useState<ContactMoment>("zsm");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const onTurnstileToken = useCallback((token: string | undefined) => setTurnstileToken(token), []);
  const field = (key: string) => `${idPrefix}-${key}`;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const payload = { name, phone, preferredMoment: moment, website, startedAt: startedAt.current, turnstileToken };
    const result = callbackFormSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors = toFieldErrors(result.error);
      setErrors(fieldErrors);
      const first = Object.keys(fieldErrors)[0];
      if (first) document.getElementById(fieldId(field(first)))?.focus();
      return;
    }
    if (turnstileEnabled && !turnstileToken) {
      setFormError("Wacht even tot de controle tegen spam klaar is en probeer het opnieuw.");
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const response = await fetch("/api/terugbellen/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok: boolean; message?: string; fieldErrors?: FieldErrors; reference?: string };
      if (data.ok) {
        router.push(`${thanksHref}?type=terugbel${data.reference ? `&ref=${encodeURIComponent(data.reference)}` : ""}`);
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
    <form onSubmit={submit} action="/api/terugbellen/" method="post" noValidate className="relative space-y-5">
      {formError ? (
        <p role="alert" className="rounded-lg border border-red-700 bg-red-50 p-3 font-semibold text-red-900">
          {formError}
        </p>
      ) : null}

      {/* De `name`-attributen zijn de veldnamen die de server verwacht; de id's krijgen een voorvoegsel. */}
      <CallbackTextField
        id={field("name")}
        name="name"
        label="Naam"
        value={name}
        onChange={setName}
        error={errors.name}
        autoComplete="name"
      />
      <CallbackTextField
        id={field("phone")}
        name="phone"
        label="Telefoonnummer"
        value={phone}
        onChange={setPhone}
        error={errors.phone}
        autoComplete="tel"
        type="tel"
      />

      <fieldset>
        <legend className="mb-2 font-semibold">Wanneer kunnen wij u bellen?</legend>
        <div className="grid grid-cols-2 gap-2">
          {contactMoments.map((option) => (
            <label key={option.value} className={choiceClasses}>
              <input
                type="radio"
                name="preferredMoment"
                value={option.value}
                checked={moment === option.value}
                onChange={() => setMoment(option.value)}
                className={choiceInputClasses}
              />
              {option.label}
            </label>
          ))}
        </div>
        <FieldError name={field("preferredMoment")} message={errors.preferredMoment} />
      </fieldset>

      <Honeypot value={website} onChange={setWebsite} />
      <Turnstile onToken={onTurnstileToken} />

      <Button type="submit" variant="dark" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Bezig met verzenden…" : "Bel mij terug"}
        {submitting ? null : <Icon name="phone" />}
      </Button>

      <p className="text-sm text-muted">
        Wij gebruiken uw gegevens alleen om u terug te bellen. Lees onze{" "}
        <Link href={privacyHref} className="font-semibold underline">
          privacyverklaring
        </Link>
        .
      </p>
    </form>
  );
}

interface CallbackTextFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: string;
  type?: string;
}

/** Dunne laag om TextField: eigen id (met voorvoegsel) maar de veldnaam die de server verwacht. */
function CallbackTextField({ id, name, label, value, onChange, error, autoComplete, type = "text" }: CallbackTextFieldProps) {
  return (
    <div>
      <label htmlFor={fieldId(id)} className="mb-1.5 block font-semibold">
        {label}
      </label>
      <input
        id={fieldId(id)}
        name={name}
        type={type}
        inputMode={type === "tel" ? "tel" : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `fout-${id}` : undefined}
        className="block w-full rounded-lg border border-ink-700/40 bg-white px-3.5 py-2.5 text-base text-ink aria-invalid:border-red-700 aria-invalid:bg-red-50"
      />
      <FieldError name={id} message={error} />
    </div>
  );
}
