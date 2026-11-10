import type { Estimate, EstimateLine, PriceListItem, PriceUnit, SelectionEntry } from "./types";

/** Bovengrens per eenheid: houdt typfouten en onzin uit de berekening. */
export const MAX_QUANTITY: Record<PriceUnit, number> = {
  m2: 5000,
  m1: 1000,
  stuk: 100,
};

/**
 * Maakt van een ingevoerd aantal een bruikbaar aantal, of `null` als het niet klopt.
 * Meters en vierkante meters worden op één decimaal afgerond; stuks moeten heel zijn.
 */
export function normalizeQuantity(quantity: number, unit: PriceUnit): number | null {
  if (!Number.isFinite(quantity) || quantity <= 0) return null;
  if (unit === "stuk") {
    if (!Number.isInteger(quantity)) return null;
    return quantity <= MAX_QUANTITY.stuk ? quantity : null;
  }
  const rounded = Math.round(quantity * 10) / 10;
  if (rounded <= 0 || rounded > MAX_QUANTITY[unit]) return null;
  return rounded;
}

const toCents = (euros: number) => Math.round(euros * 100);
const toEuros = (cents: number) => cents / 100;

/**
 * Berekent een prijsindicatie.
 *
 * - Onbekend werk en ongeldige aantallen worden overgeslagen.
 * - Hetzelfde werk twee keer gekozen telt als één regel met de aantallen opgeteld.
 * - De regels staan in de volgorde van de prijslijst.
 * - Werk zonder prijs komt wel als regel terug (bedrag `null`) maar telt niet mee.
 * - Er wordt in centen gerekend, zodat er geen afrondingsverschillen ontstaan.
 */
export function calculateEstimate(
  selection: readonly SelectionEntry[],
  priceList: readonly PriceListItem[],
  options: { vatRate?: number } = {},
): Estimate {
  const vatRate = options.vatRate ?? 0.21;

  const quantities = new Map<string, number>();
  for (const entry of selection) {
    if (!Number.isFinite(entry.quantity) || entry.quantity <= 0) continue;
    quantities.set(entry.id, (quantities.get(entry.id) ?? 0) + entry.quantity);
  }

  const lines: EstimateLine[] = [];
  let totalCents = 0;

  for (const item of priceList) {
    const raw = quantities.get(item.id);
    if (raw === undefined) continue;
    const quantity = normalizeQuantity(raw, item.unit);
    if (quantity === null) continue;

    if (item.unitPrice === null) {
      lines.push({ id: item.id, label: item.label, unit: item.unit, quantity, unitPrice: null, amount: null, minimumApplied: false });
      continue;
    }

    const calculated = Math.round(toCents(item.unitPrice) * quantity);
    const minimum = item.minimum ? toCents(item.minimum) : 0;
    const minimumApplied = minimum > calculated;
    const cents = minimumApplied ? minimum : calculated;
    totalCents += cents;
    lines.push({
      id: item.id,
      label: item.label,
      unit: item.unit,
      quantity,
      unitPrice: item.unitPrice,
      amount: toEuros(cents),
      minimumApplied,
    });
  }

  const exclCents = Math.round(totalCents / (1 + vatRate));

  return {
    lines,
    total: toEuros(totalCents),
    totalExclVat: toEuros(exclCents),
    vat: toEuros(totalCents - exclCents),
    vatRate,
    hasOnRequestItems: lines.some((line) => line.amount === null),
  };
}
