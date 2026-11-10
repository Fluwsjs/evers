import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Gedeelde opmaak voor formuliervelden en keuzeblokken. */
export const legendClasses = "font-display text-lg font-extrabold";
export const choiceClasses =
  "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-line bg-white px-3 py-2 font-medium has-checked:border-ink has-checked:bg-sand has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-strong";
export const choiceInputClasses = "size-5 shrink-0 accent-brand-strong focus-visible:outline-none";

const controlClasses =
  "block w-full rounded-lg border border-ink-700/40 bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-muted/70 aria-invalid:border-red-700 aria-invalid:bg-red-50";

export const fieldId = (name: string) => `veld-${name}`;
const errorId = (name: string) => `fout-${name}`;
const hintId = (name: string) => `uitleg-${name}`;

/** `aria-describedby` voor een veld of groep, op basis van uitleg en foutmelding. */
export function describedBy(name: string, hasHint: boolean, hasError: boolean): string | undefined {
  return [hasHint ? hintId(name) : null, hasError ? errorId(name) : null].filter(Boolean).join(" ") || undefined;
}

/** Foutmelding bij een veld. `role="alert"` laat schermlezers de melding direct voorlezen. */
export function FieldError({ name, message }: { name: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={errorId(name)} role="alert" className="mt-1.5 flex gap-2 text-sm font-medium text-red-800">
      <span aria-hidden="true">!</span>
      {message}
    </p>
  );
}

export function FieldHint({ name, children }: { name: string; children: ReactNode }) {
  return (
    <p id={hintId(name)} className="mt-1 text-sm text-muted">
      {children}
    </p>
  );
}

interface BaseFieldProps {
  /** Bepaalt de id van het veld en van de bijbehorende uitleg en foutmelding. */
  name: string;
  /** De `name` waarmee het veld wordt verzonden, als die afwijkt van `name` (bij een voorvoegsel in de id). */
  submitName?: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  /** Verplichte velden zijn de norm; optionele velden krijgen "(optioneel)" achter het label. */
  optional?: boolean;
  className?: string;
}

function FieldLabel({ name, label, optional }: Pick<BaseFieldProps, "name" | "label" | "optional">) {
  return (
    <label htmlFor={fieldId(name)} className="mb-1.5 block font-semibold">
      {label}
      {optional ? <span className="font-normal text-muted"> (optioneel)</span> : null}
    </label>
  );
}

type TextFieldProps = BaseFieldProps & Omit<ComponentProps<"input">, "name" | "id" | "className">;

export function TextField({ name, submitName, label, error, hint, optional, className, ...inputProps }: TextFieldProps) {
  return (
    <div className={className}>
      <FieldLabel name={name} label={label} optional={optional} />
      <input
        id={fieldId(name)}
        name={submitName ?? name}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, Boolean(hint), Boolean(error))}
        className={controlClasses}
        {...inputProps}
      />
      {hint ? <FieldHint name={name}>{hint}</FieldHint> : null}
      <FieldError name={name} message={error} />
    </div>
  );
}

type TextAreaFieldProps = BaseFieldProps & Omit<ComponentProps<"textarea">, "name" | "id" | "className">;

export function TextAreaField({
  name,
  submitName,
  label,
  error,
  hint,
  optional,
  className,
  ...textareaProps
}: TextAreaFieldProps) {
  return (
    <div className={className}>
      <FieldLabel name={name} label={label} optional={optional} />
      <textarea
        id={fieldId(name)}
        name={submitName ?? name}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, Boolean(hint), Boolean(error))}
        className={cn(controlClasses, "min-h-32")}
        {...textareaProps}
      />
      {hint ? <FieldHint name={name}>{hint}</FieldHint> : null}
      <FieldError name={name} message={error} />
    </div>
  );
}

/**
 * Honeypot tegen spam: een veld dat bezoekers niet zien en niet kunnen bereiken met Tab.
 * Bots vullen het wel in, waarna de server de aanvraag stil negeert.
 */
export function Honeypot({ value, onChange }: { value?: string; onChange?: (value: string) => void }) {
  // Eigen id per formulier: er kunnen meerdere formulieren op één pagina staan.
  const id = useId();
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
      <label htmlFor={id}>Website (niet invullen)</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...(onChange ? { value: value ?? "", onChange: (event) => onChange(event.target.value) } : {})}
      />
    </div>
  );
}
