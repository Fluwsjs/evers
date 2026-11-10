"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  contactMoments,
  OTHER_SERVICE,
  photoLimits,
  quoteParams,
  roofTypes,
  type ContactMoment,
  type RoofType,
} from "@content/quote-options";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { calculateEstimate } from "@/lib/pricing/calculate";
import { formatEuro, formatQuantity } from "@/lib/pricing/format";
import { decodeSelection, ESTIMATE_PARAM } from "@/lib/pricing/selection";
import type { PriceListItem, SelectionEntry } from "@/lib/pricing/types";
import { formatBytes, validatePhotos } from "@/lib/quote/photos";
import { quoteFormSchema, stepSchemas, toFieldErrors, type FieldErrors } from "@/lib/quote/schema";
import { cn } from "@/lib/utils";
import {
  choiceClasses,
  choiceInputClasses,
  describedBy,
  FieldError,
  FieldHint,
  fieldId,
  Honeypot,
  legendClasses,
  TextAreaField,
  TextField,
} from "./Field";
import { Turnstile, turnstileEnabled } from "./Turnstile";

export interface QuoteFormServiceGroup {
  title: string;
  services: Array<{ slug: string; label: string }>;
}

interface QuoteFormProps {
  groups: QuoteFormServiceGroup[];
  /** Prijslijst, om een indicatie uit de calculator te kunnen tonen. */
  priceList: PriceListItem[];
  vatRate: number;
  privacyHref: string;
  thanksHref: string;
  phone: { href: string; display: string };
  /** Kopniveau van de stapkop: h2 op de eigen pagina, h3 onder een sectiekop. */
  headingLevel?: "h2" | "h3";
}

interface Values {
  services: string[];
  roofType: RoofType | "";
  urgent: boolean;
  postcode: string;
  houseNumber: string;
  street: string;
  city: string;
  description: string;
  name: string;
  phone: string;
  email: string;
  preferredMoment: ContactMoment;
  privacyConsent: boolean;
  website: string;
}

const STEPS = ["Uw klus", "Details", "Gegevens"] as const;

/** In welke stap staat welk veld: nodig om bij een fout naar de juiste stap te springen. */
const FIELD_STEP: Record<string, number> = {
  services: 0,
  roofType: 0,
  urgent: 0,
  postcode: 1,
  houseNumber: 1,
  street: 1,
  city: 1,
  description: 1,
  photos: 1,
  name: 2,
  phone: 2,
  email: 2,
  preferredMoment: 2,
  privacyConsent: 2,
  turnstile: 2,
};

/** Id van het element dat de focus krijgt bij een fout in dat veld. */
const focusTarget = (field: string) => (field === "photos" ? "veld-photos" : fieldId(field));

/**
 * Offerteformulier in drie stappen. De invoer blijft in de state bewaard als u tussen
 * stappen heen en weer gaat. Elke stap wordt gecontroleerd voordat u verder kunt; de
 * server controleert bij het verzenden alles opnieuw.
 */
export function QuoteForm({
  groups,
  priceList,
  vatRate,
  privacyHref,
  thanksHref,
  phone,
  headingLevel: StepHeading = "h2",
}: QuoteFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Keuzes uit stap 1 op de homepage of uit een knop op een dienstpagina.
  const [values, setValues] = useState<Values>(() => {
    const known = new Set([...groups.flatMap((group) => group.services.map((service) => service.slug)), OTHER_SERVICE.value]);
    const roofParam = searchParams.get(quoteParams.roofType);
    return {
      services: searchParams.getAll(quoteParams.service).filter((slug) => known.has(slug)),
      roofType: roofTypes.some((item) => item.value === roofParam) ? (roofParam as RoofType) : "",
      urgent: searchParams.get(quoteParams.urgent) === "ja",
      postcode: "",
      houseNumber: "",
      street: "",
      city: "",
      description: "",
      name: "",
      phone: "",
      email: "",
      preferredMoment: "zsm",
      privacyConsent: false,
      website: "",
    };
  });

  // Keuzes uit de prijscalculator: welk werk en hoeveel. De bezoeker kan ze weghalen.
  const [selection, setSelection] = useState<SelectionEntry[]>(() => decodeSelection(searchParams.get(ESTIMATE_PARAM)));
  const estimate = calculateEstimate(selection, priceList, { vatRate });

  // Is stap 1 al volledig ingevuld op de homepage, dan begint het formulier bij stap 2.
  const [step, setStep] = useState(() => (values.services.length > 0 && values.roofType !== "" ? 1 : 0));
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>();

  const headingRef = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef(0);
  const autoFilled = useRef({ street: "", city: "" });
  const pendingFocus = useRef<string | null>(null);
  const previousStep = useRef(step);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Na een stapwissel: focus op de kop van de stap, of op het eerste veld met een fout.
  useEffect(() => {
    // Alleen na een echte stapwissel: bij het laden mag de pagina niet naar het formulier springen.
    if (previousStep.current === step) return;
    previousStep.current = step;
    if (pendingFocus.current) {
      document.getElementById(pendingFocus.current)?.focus();
      pendingFocus.current = null;
    } else {
      headingRef.current?.focus();
    }
  }, [step]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current)) return current;
      const rest = { ...current };
      delete rest[key];
      return rest;
    });
  };

  const toggleService = (slug: string) =>
    set("services", values.services.includes(slug) ? values.services.filter((item) => item !== slug) : [...values.services, slug]);

  /** Toont de fouten, springt naar de stap van de eerste fout en zet daar de focus. */
  const showErrors = (fieldErrors: FieldErrors) => {
    setErrors(fieldErrors);
    const first = Object.keys(fieldErrors).sort((a, b) => (FIELD_STEP[a] ?? 0) - (FIELD_STEP[b] ?? 0))[0];
    if (!first) return;
    const target = FIELD_STEP[first] ?? step;
    if (target === step) {
      document.getElementById(focusTarget(first))?.focus();
    } else {
      pendingFocus.current = focusTarget(first);
      setStep(target);
    }
  };

  const validateStep = (index: number): boolean => {
    const schema = stepSchemas[index];
    if (!schema) return true;
    const result = schema.safeParse(values);
    const fieldErrors: FieldErrors = result.success ? {} : toFieldErrors(result.error);
    if (index === 1) {
      const photoError = validatePhotos(photos);
      if (photoError) fieldErrors.photos = photoError;
    }
    if (Object.keys(fieldErrors).length > 0) {
      showErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const next = () => {
    setFormError(null);
    if (validateStep(step)) setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const back = () => {
    setFormError(null);
    setStep((current) => Math.max(current - 1, 0));
  };

  const lookupAddress = async () => {
    const stepResult = stepSchemas[1].pick({ postcode: true, houseNumber: true }).safeParse(values);
    if (!stepResult.success) return;
    try {
      const response = await fetch("/api/postcode/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stepResult.data),
      });
      const data = (await response.json()) as { found: boolean; street?: string; city?: string };
      if (!data.found || !data.city) {
        setLookupMessage("Wij konden dit adres niet automatisch vinden. Vul straat en plaats zelf in.");
        return;
      }
      const { street = "", city } = data;
      setValues((current) => ({
        ...current,
        // Alleen overschrijven wat leeg is of eerder automatisch is ingevuld.
        street: current.street === "" || current.street === autoFilled.current.street ? street : current.street,
        city: current.city === "" || current.city === autoFilled.current.city ? city : current.city,
      }));
      autoFilled.current = { street, city };
      setErrors((current) => {
        const rest = { ...current };
        delete rest.city;
        return rest;
      });
      setLookupMessage(`Adres gevonden: ${street ? `${street}, ` : ""}${city}.`);
    } catch {
      setLookupMessage(null);
    }
  };

  const addPhotos = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const merged = [...photos, ...Array.from(files)];
    const error = validatePhotos(merged);
    if (error) {
      setErrors((current) => ({ ...current, photos: error }));
      return;
    }
    setPhotos(merged);
    setErrors((current) => {
      const rest = { ...current };
      delete rest.photos;
      return rest;
    });
  };

  const onTurnstileToken = useCallback((token: string | undefined) => setTurnstileToken(token), []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (step < STEPS.length - 1) {
      next();
      return;
    }
    setFormError(null);

    const payload = {
      ...values,
      estimate: estimate.lines.map((line) => ({ id: line.id, quantity: line.quantity })),
      startedAt: startedAt.current,
      turnstileToken,
    };
    const result = quoteFormSchema.safeParse(payload);
    const fieldErrors: FieldErrors = result.success ? {} : toFieldErrors(result.error);
    const photoError = validatePhotos(photos);
    if (photoError) fieldErrors.photos = photoError;
    if (turnstileEnabled && !turnstileToken) fieldErrors.turnstile = "Wacht even tot de controle tegen spam klaar is.";
    if (Object.keys(fieldErrors).length > 0) {
      showErrors(fieldErrors);
      return;
    }

    const body = new FormData();
    body.set("payload", JSON.stringify(payload));
    for (const photo of photos) body.append("photos", photo);

    setSubmitting(true);
    try {
      const response = await fetch("/api/offerte/", { method: "POST", body });
      const data = (await response.json()) as { ok: boolean; message?: string; fieldErrors?: FieldErrors; reference?: string };
      if (data.ok) {
        router.push(`${thanksHref}?type=offerte${data.reference ? `&ref=${encodeURIComponent(data.reference)}` : ""}`);
        return;
      }
      setFormError(data.message ?? "Het verzenden is niet gelukt. Probeer het opnieuw of bel ons.");
      if (data.fieldErrors) showErrors(data.fieldErrors);
    } catch {
      setFormError("Het verzenden is niet gelukt. Controleer uw internetverbinding en probeer het opnieuw.");
    }
    setSubmitting(false);
  };

  const serviceOptions = [...groups, { title: "Weet u het nog niet?", services: [{ slug: OTHER_SERVICE.value, label: OTHER_SERVICE.label }] }];
  const firstService = serviceOptions[0]?.services[0]?.slug;

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-labelledby="stap-titel"
      className="relative rounded-card border border-line bg-white p-5 shadow-card sm:p-8"
    >
      {/* Voortgang */}
      <ol aria-label="Voortgang" className="flex items-center gap-2 text-sm font-semibold sm:gap-4">
        {STEPS.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? "step" : undefined}
            className={cn("flex flex-1 items-center gap-2", index === step ? "text-ink" : "text-muted")}
          >
            <span
              aria-hidden="true"
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-full",
                index < step ? "bg-ink text-white" : index === step ? "bg-brand text-ink" : "bg-sand-200 text-muted",
              )}
            >
              {index < step ? <Icon name="check" className="size-4" /> : index + 1}
            </span>
            <span className={cn(index === step ? "" : "max-sm:sr-only")}>
              <span className="sr-only">
                Stap {index + 1} van {STEPS.length}
                {index < step ? " (afgerond)" : ""}:{" "}
              </span>
              {label}
            </span>
            {index < STEPS.length - 1 ? <span aria-hidden="true" className="h-0.5 grow bg-line" /> : null}
          </li>
        ))}
      </ol>

      <StepHeading id="stap-titel" ref={headingRef} tabIndex={-1} className="mt-8 text-2xl outline-none md:text-3xl">
        <span className="sr-only">
          Stap {step + 1} van {STEPS.length}:{" "}
        </span>
        {step === 0 ? "Waar heeft u hulp bij nodig?" : step === 1 ? "Waar is het en wat is er aan de hand?" : "Hoe kunnen wij u bereiken?"}
      </StepHeading>

      {formError ? (
        <div role="alert" className="mt-6 rounded-lg border border-red-700 bg-red-50 p-4 text-red-900">
          <p className="font-semibold">{formError}</p>
          <p className="mt-1">
            Lukt het niet? Bel{" "}
            <a href={phone.href} className="font-semibold underline">
              {phone.display}
            </a>
            .
          </p>
        </div>
      ) : null}

      {estimate.lines.length > 0 ? (
        <section aria-labelledby="indicatie-titel" className="mt-6 rounded-lg border border-line bg-sand p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
            <p id="indicatie-titel" className="font-display text-lg font-extrabold">
              Uw indicatie uit de calculator
            </p>
            <button
              type="button"
              onClick={() => setSelection([])}
              className="font-semibold text-brand-strong underline underline-offset-4"
            >
              Indicatie weghalen
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            {estimate.lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-4">
                <span>
                  {line.label} <span className="text-muted">({formatQuantity(line.quantity, line.unit)})</span>
                </span>
                <span className="shrink-0 font-semibold">{line.amount === null ? "Op aanvraag" : formatEuro(line.amount)}</span>
              </li>
            ))}
          </ul>
          {estimate.total > 0 ? (
            <p className="mt-3 border-t border-line pt-3 font-semibold">
              Totaal vanaf {formatEuro(estimate.total)} <span className="font-normal text-muted">inclusief btw</span>
            </p>
          ) : null}
          <p className="mt-1 text-sm text-muted">
            Wij ontvangen deze indicatie bij uw aanvraag. Het blijft een indicatie; de definitieve prijs volgt na een
            inspectie.
          </p>
        </section>
      ) : null}

      {/* Stap 1: uw klus */}
      {step === 0 ? (
        <div className="mt-8 space-y-10">
          <fieldset aria-describedby={describedBy("services", true, Boolean(errors.services))}>
            <legend className={legendClasses}>Diensten</legend>
            <FieldHint name="services">Meerdere keuzes mogelijk.</FieldHint>
            <div className="mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {serviceOptions.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 text-sm font-semibold text-muted">{group.title}</p>
                  <div className="space-y-2">
                    {group.services.map((service) => (
                      <label key={service.slug} className={choiceClasses}>
                        <input
                          id={service.slug === firstService ? fieldId("services") : undefined}
                          type="checkbox"
                          name="services"
                          value={service.slug}
                          checked={values.services.includes(service.slug)}
                          onChange={() => toggleService(service.slug)}
                          className={choiceInputClasses}
                        />
                        {service.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <FieldError name="services" message={errors.services} />
          </fieldset>

          <div className="grid gap-10 sm:grid-cols-2">
            <fieldset aria-describedby={describedBy("roofType", false, Boolean(errors.roofType))}>
              <legend className={legendClasses}>Wat voor dak heeft u?</legend>
              <div className="mt-4 grid gap-2">
                {roofTypes.map((roofType, index) => (
                  <label key={roofType.value} className={choiceClasses}>
                    <input
                      id={index === 0 ? fieldId("roofType") : undefined}
                      type="radio"
                      name="roofType"
                      value={roofType.value}
                      checked={values.roofType === roofType.value}
                      onChange={() => set("roofType", roofType.value)}
                      className={choiceInputClasses}
                    />
                    {roofType.label}
                  </label>
                ))}
              </div>
              <FieldError name="roofType" message={errors.roofType} />
            </fieldset>

            <fieldset>
              <legend className={legendClasses}>Is het spoed?</legend>
              <div className="mt-4 grid gap-2">
                {[
                  { value: true, label: "Ja, het is dringend" },
                  { value: false, label: "Nee" },
                ].map((option) => (
                  <label key={option.label} className={choiceClasses}>
                    <input
                      type="radio"
                      name="urgent"
                      checked={values.urgent === option.value}
                      onChange={() => set("urgent", option.value)}
                      className={choiceInputClasses}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      ) : null}

      {/* Stap 2: details */}
      {step === 1 ? (
        <div className="mt-8 space-y-6">
          <fieldset>
            <legend className={legendClasses}>Adres van het dak</legend>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <TextField
                name="postcode"
                label="Postcode"
                value={values.postcode}
                onChange={(event) => set("postcode", event.target.value)}
                onBlur={lookupAddress}
                error={errors.postcode}
                autoComplete="postal-code"
                placeholder="1234 AB"
                maxLength={7}
                className="sm:col-span-1"
              />
              <TextField
                name="houseNumber"
                label="Huisnummer"
                value={values.houseNumber}
                onChange={(event) => set("houseNumber", event.target.value)}
                onBlur={lookupAddress}
                error={errors.houseNumber}
                autoComplete="address-line2"
                placeholder="10"
                maxLength={12}
                className="sm:col-span-1"
              />
              <TextField
                name="street"
                label="Straat"
                optional
                value={values.street}
                onChange={(event) => set("street", event.target.value)}
                error={errors.street}
                autoComplete="address-line1"
                className="col-span-2 sm:col-span-1"
              />
              <TextField
                name="city"
                label="Plaats"
                value={values.city}
                onChange={(event) => set("city", event.target.value)}
                error={errors.city}
                autoComplete="address-level2"
                className="col-span-2 sm:col-span-1"
              />
            </div>
            <p aria-live="polite" className="mt-2 min-h-5 text-sm text-muted">
              {lookupMessage ?? "Straat en plaats vullen wij aan zodra u postcode en huisnummer heeft ingevuld."}
            </p>
          </fieldset>

          <TextAreaField
            name="description"
            label="Omschrijving"
            value={values.description}
            onChange={(event) => set("description", event.target.value)}
            error={errors.description}
            hint="Wat is er aan de hand, of wat wilt u laten doen? Noem ook de afmetingen als u die weet."
            maxLength={3000}
            rows={5}
          />

          <div>
            <p id="fotos-label" className="mb-1.5 font-semibold">
              Foto&apos;s <span className="font-normal text-muted">(optioneel)</span>
            </p>
            <p id="uitleg-photos" className="mb-3 text-sm text-muted">
              Maximaal {photoLimits.maxFiles} foto&apos;s van elk maximaal {formatBytes(photoLimits.maxBytes)} (jpg, png,
              webp of heic). Foto&apos;s helpen ons om uw aanvraag goed in te schatten.
            </p>
            {photos.length > 0 ? (
              <ul aria-label="Gekozen foto's" className="mb-3 space-y-2">
                {photos.map((photo, index) => (
                  <li key={`${photo.name}-${photo.size}-${index}`} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-sand px-3 py-2">
                    <span className="min-w-0 truncate">
                      {photo.name} <span className="text-sm text-muted">({formatBytes(photo.size)})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setPhotos(photos.filter((_, photoIndex) => photoIndex !== index))}
                      aria-label={`${photo.name} verwijderen`}
                      className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-sand-200"
                    >
                      <Icon name="close" className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {photos.length < photoLimits.maxFiles ? (
              <input
                id="veld-photos"
                type="file"
                multiple
                accept={photoLimits.accept}
                aria-labelledby="fotos-label"
                aria-describedby={describedBy("photos", true, Boolean(errors.photos))}
                aria-invalid={errors.photos ? true : undefined}
                onChange={(event) => {
                  addPhotos(event.target.files);
                  event.target.value = "";
                }}
                className="block w-full cursor-pointer rounded-lg border border-dashed border-ink-700/50 bg-white p-3 text-base file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-ink file:px-4 file:py-2 file:font-semibold file:text-white"
              />
            ) : (
              <p className="text-sm text-muted">U heeft het maximale aantal foto&apos;s gekozen.</p>
            )}
            <FieldError name="photos" message={errors.photos} />
          </div>
        </div>
      ) : null}

      {/* Stap 3: gegevens */}
      {step === 2 ? (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="name"
              label="Naam"
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              error={errors.name}
              autoComplete="name"
              maxLength={100}
              className="sm:col-span-2"
            />
            <TextField
              name="phone"
              label="Telefoonnummer"
              type="tel"
              inputMode="tel"
              value={values.phone}
              onChange={(event) => set("phone", event.target.value)}
              error={errors.phone}
              autoComplete="tel"
              maxLength={20}
            />
            <TextField
              name="email"
              label="E-mailadres"
              type="email"
              inputMode="email"
              value={values.email}
              onChange={(event) => set("email", event.target.value)}
              error={errors.email}
              autoComplete="email"
              maxLength={254}
              hint="Hier sturen wij de bevestiging naartoe."
            />
          </div>

          <fieldset aria-describedby={describedBy("preferredMoment", false, Boolean(errors.preferredMoment))}>
            <legend className={legendClasses}>Wanneer kunnen wij u het beste bereiken?</legend>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {contactMoments.map((moment, index) => (
                <label key={moment.value} className={choiceClasses}>
                  <input
                    id={index === 0 ? fieldId("preferredMoment") : undefined}
                    type="radio"
                    name="preferredMoment"
                    value={moment.value}
                    checked={values.preferredMoment === moment.value}
                    onChange={() => set("preferredMoment", moment.value)}
                    className={choiceInputClasses}
                  />
                  {moment.label}
                </label>
              ))}
            </div>
            <FieldError name="preferredMoment" message={errors.preferredMoment} />
          </fieldset>

          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                id={fieldId("privacyConsent")}
                type="checkbox"
                name="privacyConsent"
                checked={values.privacyConsent}
                onChange={(event) => set("privacyConsent", event.target.checked)}
                required
                aria-invalid={errors.privacyConsent ? true : undefined}
                aria-describedby={describedBy("privacyConsent", false, Boolean(errors.privacyConsent))}
                className="mt-0.5 size-5 shrink-0 accent-brand-strong"
              />
              <span>
                Ik ga ermee akkoord dat mijn gegevens worden gebruikt om mijn aanvraag te behandelen, zoals beschreven
                in de{" "}
                <Link href={privacyHref} target="_blank" className="font-semibold text-brand-strong underline">
                  privacyverklaring
                  <span className="sr-only"> (opent in een nieuw tabblad)</span>
                </Link>
                .
              </span>
            </label>
            <FieldError name="privacyConsent" message={errors.privacyConsent} />
          </div>

          <div>
            <Turnstile onToken={onTurnstileToken} />
            <FieldError name="turnstile" message={errors.turnstile} />
          </div>
        </div>
      ) : null}

      <Honeypot value={values.website} onChange={(value) => set("website", value)} />

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        {step > 0 ? (
          <Button variant="ghost" onClick={back} disabled={submitting}>
            <Icon name="arrow-right" className="rotate-180" />
            Vorige
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" size="lg" disabled={submitting}>
          {step < STEPS.length - 1 ? "Volgende stap" : submitting ? "Bezig met verzenden…" : "Aanvraag versturen"}
          {submitting ? null : <Icon name="arrow-right" />}
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {submitting ? "Uw aanvraag wordt verzonden." : ""}
      </p>
    </form>
  );
}
