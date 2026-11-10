"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { quoteParams } from "@content/quote-options";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { calculateEstimate, MAX_QUANTITY, normalizeQuantity } from "@/lib/pricing/calculate";
import { formatEuro, formatQuantity, parseQuantity, unitLabels } from "@/lib/pricing/format";
import type { PriceGroup, PublicPriceItem } from "@/lib/pricing/price-list";
import { encodeSelection, ESTIMATE_PARAM } from "@/lib/pricing/selection";
import type { PriceUnit, SelectionEntry } from "@/lib/pricing/types";
import { cn } from "@/lib/utils";

interface PriceCalculatorProps {
  groups: PriceGroup[];
  vatRate: number;
  /** Pad van het offerteformulier; de keuzes gaan mee als queryparameters. */
  quoteHref: string;
}

/** Stapgrootte van de plus- en minknop. */
const STEP: Record<PriceUnit, number> = { m2: 5, m1: 1, stuk: 1 };
const QUANTITY_LABEL: Record<PriceUnit, string> = {
  m2: "Oppervlakte in m²",
  m1: "Lengte in meters",
  stuk: "Aantal",
};

/** Laat een getal in korte tijd naar zijn nieuwe waarde lopen (direct bij "minder beweging"). */
function useAnimatedNumber(target: number): number {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    if (from === target) return;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const next = progress === 1 ? target : from + (target - from) * eased;
      current.current = next;
      setValue(next);
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

/**
 * Prijscalculator: per dienst het werk kiezen, de maten invullen, rechts direct de
 * indicatie inclusief btw zien en met één klik door naar het offerteformulier.
 * Het rekenen zelf gebeurt in `src/lib/pricing`; dit component regelt de invoer en de
 * weergave.
 */
export function PriceCalculator({ groups, vatRate, quoteHref }: PriceCalculatorProps) {
  const uid = useId();
  const [activeSlug, setActiveSlug] = useState(groups[0]?.serviceSlug ?? "");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const items = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const hasExamples = items.some((item) => item.example);
  const activeGroup = groups.find((group) => group.serviceSlug === activeSlug) ?? groups[0];

  /** Geldig aantal voor een regel, anders `null`. */
  const quantityFor = (item: PublicPriceItem): number | null => {
    const parsed = parseQuantity(inputs[item.id] ?? "");
    return parsed === null ? null : normalizeQuantity(parsed, item.unit);
  };

  const selection: SelectionEntry[] = items.flatMap((item) => {
    if (!checked[item.id]) return [];
    const quantity = quantityFor(item);
    return quantity === null ? [] : [{ id: item.id, quantity }];
  });
  /** Gekozen werk waar de maat nog ontbreekt of niet klopt. */
  const pending = items.filter((item) => checked[item.id] && quantityFor(item) === null);

  const estimate = calculateEstimate(selection, items, { vatRate });
  const hasLines = estimate.lines.length > 0;
  const hasTotal = estimate.total > 0;
  const animatedTotal = useAnimatedNumber(estimate.total);
  const shownTotal = animatedTotal === estimate.total ? estimate.total : Math.round(animatedTotal);

  const setInput = (id: string, value: string) => setInputs((current) => ({ ...current, [id]: value }));

  const toggle = (item: PublicPriceItem) => {
    const next = !checked[item.id];
    setChecked((current) => ({ ...current, [item.id]: next }));
    // Bij stuks is één de logische start; bij meters vult de bezoeker zelf een maat in.
    if (next && item.unit === "stuk" && !inputs[item.id]) setInput(item.id, "1");
  };

  const stepQuantity = (item: PublicPriceItem, direction: 1 | -1) => {
    const value = parseQuantity(inputs[item.id] ?? "") ?? 0;
    const step = STEP[item.unit];
    const next =
      direction > 0 ? Math.floor(value / step) * step + step : Math.ceil(value / step) * step - step;
    const clamped = Math.min(Math.max(next, 0), MAX_QUANTITY[item.unit]);
    setInput(item.id, clamped === 0 ? "" : String(clamped).replace(".", ","));
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = groups.length - 1;
    const target =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (target === null) return;
    event.preventDefault();
    const slug = groups[target]?.serviceSlug;
    if (!slug) return;
    setActiveSlug(slug);
    tabRefs.current[slug]?.focus();
  };

  const href = (() => {
    if (!hasLines) return quoteHref;
    const params = new URLSearchParams();
    const serviceSlugs = new Set(
      items.filter((item) => selection.some((entry) => entry.id === item.id)).map((item) => item.serviceSlug),
    );
    for (const slug of serviceSlugs) params.append(quoteParams.service, slug);
    params.set(ESTIMATE_PARAM, encodeSelection(selection));
    return `${quoteHref}?${params.toString()}`;
  })();

  const tabId = (slug: string) => `${uid}-tab-${slug}`;
  const panelId = `${uid}-paneel`;
  const quantityId = (id: string) => `${uid}-aantal-${id}`;

  if (!activeGroup) return null;

  return (
    <div>
      {hasExamples ? (
        <p className="mb-4 inline-block rounded border border-dashed border-current px-2 py-1 text-xs font-medium">
          TODO klant: voorbeeldprijzen om de calculator te testen. Nog niet bevestigd; ze verschijnen niet op de live
          site.
        </p>
      ) : null}

      <div className="grid overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-30px_rgb(20_18_15/0.35)] ring-1 ring-ink/10 lg:grid-cols-[1.5fr_1fr]">
        {/* Keuzes */}
        <div className="min-w-0 p-5 sm:p-8 lg:p-10">
          <p className="flex items-center gap-3 font-display text-xl font-extrabold">
            <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-brand text-base text-ink">
              1
            </span>
            Kies het werk en vul de maten in
          </p>

          <div role="tablist" aria-label="Soort werk" className="mt-6 flex flex-wrap gap-2">
            {groups.map((group, index) => {
              const isActive = group.serviceSlug === activeGroup.serviceSlug;
              const count = group.items.filter((item) => checked[item.id]).length;
              return (
                <button
                  key={group.serviceSlug}
                  ref={(element) => {
                    tabRefs.current[group.serviceSlug] = element;
                  }}
                  type="button"
                  role="tab"
                  id={tabId(group.serviceSlug)}
                  aria-selected={isActive}
                  aria-controls={panelId}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveSlug(group.serviceSlug)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-[0.9375rem] font-semibold transition-colors sm:px-4 sm:text-base",
                    isActive ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink",
                  )}
                >
                  {group.title}
                  {count > 0 ? (
                    <span className="grid size-6 place-items-center rounded-full bg-brand text-sm font-bold text-ink">
                      <span aria-hidden="true">{count}</span>
                      <span className="sr-only">({count} gekozen)</span>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div role="tabpanel" id={panelId} aria-labelledby={tabId(activeGroup.serviceSlug)} className="mt-6">
            <ul className="space-y-3">
              {activeGroup.items.map((item) => {
                const isChecked = Boolean(checked[item.id]);
                const text = inputs[item.id] ?? "";
                const quantity = quantityFor(item);
                const invalid = isChecked && text.trim() !== "" && quantity === null;
                const hintId = `${quantityId(item.id)}-uitleg`;
                const line = estimate.lines.find((entry) => entry.id === item.id);
                return (
                  <li
                    key={item.id}
                    className={cn(
                      "rounded-xl border-2 transition-colors",
                      isChecked ? "border-ink bg-sand" : "border-line bg-white hover:border-ink-700/40",
                    )}
                  >
                    <label className="flex cursor-pointer items-center gap-4 rounded-xl p-4 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-strong sm:p-5">
                      <input type="checkbox" checked={isChecked} onChange={() => toggle(item)} className="sr-only" />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-lg border-2 transition-colors",
                          isChecked ? "border-brand bg-brand text-ink" : "border-ink-700/30 bg-white text-transparent",
                        )}
                      >
                        <Icon name="check" className="size-4" />
                      </span>
                      <span className="min-w-0 grow leading-snug font-semibold">{item.label}</span>
                      <span className="shrink-0 text-right">
                        {item.unitPrice === null ? (
                          <span className="text-sm font-semibold text-muted">Op aanvraag</span>
                        ) : (
                          <>
                            <span className="block text-xs text-muted">vanaf</span>
                            <span className="block font-display text-xl leading-tight font-extrabold tabular-nums">
                              {formatEuro(item.unitPrice)}
                            </span>
                            <span className="block text-xs text-muted">{unitLabels[item.unit].per}</span>
                          </>
                        )}
                      </span>
                    </label>

                    {isChecked ? (
                      <div className="border-t border-ink/10 px-4 pt-4 pb-4 sm:px-5 sm:pb-5 sm:pl-16">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                          <div>
                            <label htmlFor={quantityId(item.id)} className="block text-sm font-semibold">
                              {QUANTITY_LABEL[item.unit]}
                              <span className="sr-only"> ({item.label})</span>
                            </label>
                            <div
                              className={cn(
                                "mt-2 inline-flex items-stretch overflow-hidden rounded-lg border bg-white",
                                invalid ? "border-red-700" : "border-ink-700/40",
                              )}
                            >
                              <button
                                type="button"
                                onClick={() => stepQuantity(item, -1)}
                                disabled={(parseQuantity(text) ?? 0) <= 0}
                                aria-label={`Minder: ${item.label}`}
                                className="grid w-11 place-items-center text-xl font-semibold hover:bg-sand-200 disabled:text-ink/25 disabled:hover:bg-transparent"
                              >
                                <span aria-hidden="true">−</span>
                              </button>
                              <input
                                id={quantityId(item.id)}
                                type="text"
                                inputMode={item.unit === "stuk" ? "numeric" : "decimal"}
                                autoComplete="off"
                                placeholder="0"
                                value={text}
                                onChange={(event) => setInput(item.id, event.target.value)}
                                aria-invalid={invalid ? true : undefined}
                                aria-describedby={hintId}
                                maxLength={8}
                                className="h-11 w-20 border-x border-ink-700/40 bg-white text-center text-lg font-semibold tabular-nums placeholder:text-ink/30 aria-invalid:bg-red-50"
                              />
                              <button
                                type="button"
                                onClick={() => stepQuantity(item, 1)}
                                aria-label={`Meer: ${item.label}`}
                                className="grid w-11 place-items-center text-xl font-semibold hover:bg-sand-200"
                              >
                                <span aria-hidden="true">+</span>
                              </button>
                            </div>
                          </div>
                          {line && line.amount !== null ? (
                            // Op mobiel staat het bedrag al in het resultaatpaneel eronder.
                            <p className="text-right max-sm:hidden">
                              <span className="block text-xs text-muted">
                                {formatQuantity(line.quantity, line.unit)}
                                {line.minimumApplied ? ", minimumbedrag" : ""}
                              </span>
                              <span className="block font-display text-xl font-extrabold tabular-nums">
                                {formatEuro(line.amount)}
                              </span>
                            </p>
                          ) : null}
                        </div>
                        <p id={hintId} className={cn("mt-2 text-sm", invalid ? "font-medium text-red-800" : "text-muted")}>
                          {invalid
                            ? item.unit === "stuk"
                              ? `Vul een heel aantal in, van 1 tot ${MAX_QUANTITY.stuk}.`
                              : `Vul een getal in tot ${MAX_QUANTITY[item.unit]}, bijvoorbeeld 12,5.`
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
          </div>
        </div>

        {/* Uitkomst */}
        <div className="on-dark flex min-w-0 flex-col bg-ink p-5 text-on-dark sm:p-8 lg:p-10">
          <p className="flex items-center gap-3 font-display text-xl font-extrabold text-white">
            <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-brand text-base text-ink">
              2
            </span>
            Uw indicatie
          </p>

          {hasLines || pending.length > 0 ? (
            <ul className="mt-6 divide-y divide-white/15 border-y border-white/15">
              {estimate.lines.map((line) => (
                <li key={line.id} className="flex items-start gap-3 py-3.5">
                  <span className="min-w-0 grow">
                    <span className="block leading-snug font-medium text-white">{line.label}</span>
                    <span className="block text-sm text-on-dark-muted">
                      {formatQuantity(line.quantity, line.unit)}
                      {line.unitPrice !== null ? ` × ${formatEuro(line.unitPrice)}` : ""}
                      {line.minimumApplied ? " (minimumbedrag)" : ""}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold text-white tabular-nums">
                    {line.amount === null ? "Op aanvraag" : formatEuro(line.amount)}
                  </span>
                  <RemoveButton label={line.label} onClick={() => setChecked((current) => ({ ...current, [line.id]: false }))} />
                </li>
              ))}
              {pending.map((item) => (
                <li key={item.id} className="flex items-start gap-3 py-3.5">
                  <span className="min-w-0 grow">
                    <span className="block leading-snug font-medium text-on-dark-muted">{item.label}</span>
                    <span className="block text-sm text-brand">Vul de maat in om mee te rekenen</span>
                  </span>
                  <RemoveButton label={item.label} onClick={() => setChecked((current) => ({ ...current, [item.id]: false }))} />
                </li>
              ))}
            </ul>
          ) : (
            <ol className="mt-6 space-y-4 text-on-dark-muted">
              {[
                "Kies het soort werk en vink aan wat u wilt laten doen.",
                "Vul de maten in. Een schatting is genoeg.",
                "Vraag met één klik een offerte aan; uw keuzes gaan mee.",
              ].map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-6 shrink-0 place-items-center rounded-full border border-white/30 text-sm font-semibold text-white"
                  >
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          )}

          <div className="mt-auto pt-8">
            <p className="text-sm font-semibold tracking-wide text-on-dark-muted uppercase">Totaal vanaf</p>
            <p className={cn("mt-1 font-display text-5xl leading-none font-extrabold tabular-nums", hasTotal ? "text-white" : "text-white/35")}>
              <span aria-hidden="true">{formatEuro(shownTotal)}</span>
              <span className="sr-only">{formatEuro(estimate.total)}</span>
            </p>
            <p className="mt-3 text-sm text-on-dark-muted">
              Inclusief {Math.round(estimate.vatRate * 100)}% btw{hasTotal ? ` (${formatEuro(estimate.vat)})` : ""}
            </p>
            {estimate.hasOnRequestItems ? (
              <p className="mt-3 text-sm text-on-dark">
                Voor een deel van het werk hebben wij geen vanaf-prijs. Dat rekenen wij voor u uit in de offerte.
              </p>
            ) : null}

            <p aria-live="polite" className="sr-only">
              {hasTotal ? `Indicatie: vanaf ${formatEuro(estimate.total)} inclusief btw.` : ""}
            </p>

            <Link
              href={href}
              className={buttonClasses({ variant: "primary", size: "lg", wrap: true, className: "mt-6 w-full" })}
            >
              {hasLines ? "Offerte aanvragen met deze indicatie" : "Offerte aanvragen"}
              <Icon name="arrow-right" />
            </Link>
            <p className="mt-4 border-l-2 border-brand pl-3 text-sm text-on-dark-muted">
              <strong className="text-white">Dit is een indicatie, geen offerte.</strong> De definitieve prijs hangt af
              van de staat en de bereikbaarheid van uw dak en de materialen die u kiest, en volgt na een inspectie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} weghalen`}
      className="-mr-2 grid size-8 shrink-0 place-items-center rounded-full text-on-dark-muted hover:bg-white/10 hover:text-white"
    >
      <Icon name="close" className="size-4" />
    </button>
  );
}
