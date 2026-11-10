import type { PriceUnit } from "./types";

/** "€ 95" of "€ 1.250,50": hele bedragen zonder decimalen. */
export function formatEuro(amount: number): string {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  })
    .format(amount)
    .replace(/ /g, " ");
}

export const unitLabels: Record<PriceUnit, { per: string; short: string; question: string }> = {
  m2: { per: "per m²", short: "m²", question: "Hoeveel m²?" },
  m1: { per: "per meter", short: "m", question: "Hoeveel meter?" },
  stuk: { per: "per stuk", short: "stuks", question: "Hoeveel stuks?" },
};

/** "12,5 m²", "8 m", "1 stuk", "3 stuks" */
export function formatQuantity(quantity: number, unit: PriceUnit): string {
  const number = new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 1 }).format(quantity);
  if (unit === "stuk") return `${number} ${quantity === 1 ? "stuk" : "stuks"}`;
  return `${number} ${unitLabels[unit].short}`;
}

/** Leest een ingevoerd getal: "12,5" en "12.5" zijn allebei twaalfenhalf. Anders `null`. */
export function parseQuantity(input: string): number | null {
  const text = input.trim().replace(",", ".");
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(text)) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}
