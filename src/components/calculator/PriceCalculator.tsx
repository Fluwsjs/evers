"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { quoteParams } from "@content/quote-options";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { calculateEstimate, MAX_QUANTITY, normalizeQuantity } from "@/lib/pricing/calculate";
import { formatEuro, formatQuantity, parseQuantity, unitLabels } from "@/lib/pricing/format";
import type { PriceGroup, PublicPriceItem } from "@/lib/pricing/price-list";
import { encodeSelection, ESTIMATE_PARAM } from "@/lib/pricing/selection";
import type { SelectionEntry } from "@/lib/pricing/types";
import { cn } from "@/lib/utils";

interface PriceCalculatorProps {
  groups: PriceGroup[];
  vatRate: number;
  /** Pad van het offerteformulier; de keuzes gaan mee als queryparameters. */
  quoteHref: string;
  /** Kopniveau van de dienstnamen, afhankelijk van de plek op de pagina. */
  groupHeading?: "h3" | "h4";
}

const inputId = (id: string) => `aantal-${id}`;

/**
 * Prijscalculator: werkzaamheden kiezen, maten invullen, indicatie inclusief btw zien en
 * met één klik door naar het offerteformulier. Het rekenen zelf gebeurt in
 * `src/lib/pricing`; dit component regelt alleen de invoer en de weergave.
 */
export function PriceCalculator({ groups, vatRate, quoteHref, groupHeading: GroupHeading = "h3" }: PriceCalculatorProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const items = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const hasExamples = items.some((item) => item.example);

  /** Geldig aantal voor een gekozen regel, anders `null`. */
  const quantityFor = (item: PublicPriceItem): number | null => {
    const parsed = parseQuantity(inputs[item.id] ?? "");
    return parsed === null ? null : normalizeQuantity(parsed, item.unit);
  };

  const selection: SelectionEntry[] = items.flatMap((item) => {
    if (!checked[item.id]) return [];
    const quantity = quantityFor(item);
    return quantity === null ? [] : [{ id: item.id, quantity }];
  });

  const estimate = calculateEstimate(selection, items, { vatRate });
  const hasLines = estimate.lines.length > 0;
  const hasTotal = estimate.total > 0;

  const toggle = (item: PublicPriceItem) => {
    const next = !checked[item.id];
    setChecked((current) => ({ ...current, [item.id]: next }));
    // Bij stuks is één de logische start; bij meters moet de bezoeker zelf een maat invullen.
    if (next && item.unit === "stuk" && !inputs[item.id]) {
      setInputs((current) => ({ ...current, [item.id]: "1" }));
    }
  };

  const href = (() => {
    if (!hasLines) return quoteHref;
    const params = new URLSearchParams();
    const serviceSlugs = new Set(items.filter((item) => selection.some((entry) => entry.id === item.id)).map((item) => item.serviceSlug));
    for (const slug of serviceSlugs) params.append(quoteParams.service, slug);
    params.set(ESTIMATE_PARAM, encodeSelection(selection));
    return `${quoteHref}?${params.toString()}`;
  })();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
      {/* Keuzes */}
      <div>
        {hasExamples ? (
          <p className="mb-6 rounded-lg border border-dashed border-ink p-3 text-sm font-medium">
            TODO klant: dit zijn voorbeeldprijzen om de calculator te testen. Ze zijn nog niet bevestigd en
            verschijnen niet op de live site.
          </p>
        ) : null}
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {groups.map((group) => (
            <fieldset key={group.serviceSlug}>
              <legend className="contents">
                <GroupHeading className="font-display text-lg font-extrabold">{group.title}</GroupHeading>
              </legend>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => {
                  const isChecked = Boolean(checked[item.id]);
                  const text = inputs[item.id] ?? "";
                  const invalid = isChecked && text.trim() !== "" && quantityFor(item) === null;
                  const hintId = `${inputId(item.id)}-uitleg`;
                  return (
                    <li
                      key={item.id}
                      className={cn("rounded-lg border bg-white", isChecked ? "border-ink" : "border-line")}
                    >
                      <label className="flex min-h-11 cursor-pointer items-start gap-3 px-3 py-2.5 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-strong">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggle(item)}
                          className="mt-0.5 size-5 shrink-0 accent-brand-strong focus-visible:outline-none"
                        />
                        <span className="grow">
                          <span className="block font-medium">{item.label}</span>
                          <span className="block text-sm text-muted">
                            {item.unitPrice === null
                              ? "Prijs op aanvraag"
                              : `Vanaf ${formatEuro(item.unitPrice)} ${unitLabels[item.unit].per}`}
                          </span>
                        </span>
                      </label>
                      {isChecked ? (
                        <div className="border-t border-line px-3 py-3">
                          <label htmlFor={inputId(item.id)} className="block text-sm font-semibold">
                            {unitLabels[item.unit].question}
                            <span className="sr-only"> ({item.label})</span>
                          </label>
                          <div className="mt-1.5 flex items-center gap-2">
                            <input
                              id={inputId(item.id)}
                              type="text"
                              inputMode={item.unit === "stuk" ? "numeric" : "decimal"}
                              autoComplete="off"
                              value={text}
                              onChange={(event) => setInputs((current) => ({ ...current, [item.id]: event.target.value }))}
                              aria-invalid={invalid ? true : undefined}
                              aria-describedby={hintId}
                              maxLength={8}
                              className="block w-28 rounded-lg border border-ink-700/40 bg-white px-3 py-2 text-base aria-invalid:border-red-700 aria-invalid:bg-red-50"
                            />
                            <span aria-hidden="true" className="text-muted">
                              {unitLabels[item.unit].short}
                            </span>
                          </div>
                          <p id={hintId} className={cn("mt-1.5 text-sm", invalid ? "font-medium text-red-800" : "text-muted")}>
                            {invalid
                              ? item.unit === "stuk"
                                ? `Vul een heel aantal in, van 1 tot ${MAX_QUANTITY.stuk}.`
                                : `Vul een getal in tot ${MAX_QUANTITY[item.unit]}, bijvoorbeeld 12,5.`
                              : text.trim() === ""
                                ? "Vul de maat in om mee te rekenen. Een schatting is genoeg."
                                : item.unit === "stuk"
                                  ? "Alleen hele aantallen."
                                  : "Een schatting is genoeg; wij meten het na bij de inspectie."}
                          </p>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          ))}
        </div>
      </div>

      {/* Uitkomst */}
      <div className="self-start rounded-card bg-sand p-6 sm:p-8 lg:sticky lg:top-28 in-[.bg-sand]:bg-white in-[.bg-sand]:shadow-card">
        <p className="font-display text-xl font-extrabold">Uw indicatie</p>

        {hasLines ? (
          <>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {estimate.lines.map((line) => (
                <li key={line.id} className="flex items-start justify-between gap-4 py-3">
                  <span>
                    <span className="block font-medium">{line.label}</span>
                    <span className="block text-sm text-muted">
                      {formatQuantity(line.quantity, line.unit)}
                      {line.unitPrice !== null ? ` × ${formatEuro(line.unitPrice)}` : ""}
                      {line.minimumApplied ? " (minimumbedrag)" : ""}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold">
                    {line.amount === null ? "Op aanvraag" : formatEuro(line.amount)}
                  </span>
                </li>
              ))}
            </ul>
            {hasTotal ? (
              <div className="mt-5">
                <p className="text-sm font-semibold text-muted">Totaal vanaf</p>
                <p className="font-display text-4xl font-extrabold">{formatEuro(estimate.total)}</p>
                <p className="mt-1 text-sm text-muted">
                  Inclusief {Math.round(estimate.vatRate * 100)}% btw ({formatEuro(estimate.vat)})
                </p>
              </div>
            ) : null}
            {estimate.hasOnRequestItems ? (
              <p className="mt-4 text-sm">
                Voor een deel van het werk hebben wij geen vanaf-prijs. Dat rekenen wij voor u uit in de offerte.
              </p>
            ) : null}
          </>
        ) : (
          <p className="mt-2 text-muted">
            Kies de werkzaamheden en vul de maten in. Hier ziet u dan direct wat het ongeveer kost.
          </p>
        )}

        <p aria-live="polite" className="sr-only">
          {hasTotal ? `Indicatie: vanaf ${formatEuro(estimate.total)} inclusief btw.` : ""}
        </p>

        <p className="mt-5 border-l-4 border-brand pl-4 text-sm">
          <strong>Dit is een indicatie, geen offerte.</strong> De bedragen zijn vanaf-prijzen. De definitieve prijs
          hangt af van de staat en de bereikbaarheid van uw dak en de materialen die u kiest, en volgt na een
          inspectie.
        </p>

        <div className="mt-6">
          <Link href={href} className={buttonClasses({ variant: "primary", className: "w-full whitespace-normal text-center" })}>
            {hasLines ? "Offerte aanvragen met deze indicatie" : "Offerte aanvragen"}
            <Icon name="arrow-right" />
          </Link>
          {hasLines ? (
            <p className="mt-2 text-sm text-muted">Uw keuzes en maten staan dan al ingevuld.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
