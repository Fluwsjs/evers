import type { SelectionEntry } from "./types";

/** Queryparameter waarmee de calculator de keuzes doorgeeft aan het offerteformulier. */
export const ESTIMATE_PARAM = "indicatie";

export const MAX_SELECTION_ENTRIES = 20;

const ID = /^[a-z0-9-]{1,60}$/;

/** [{ id: "zinken-goot", quantity: 12.5 }] → "zinken-goot:12.5" */
export function encodeSelection(selection: readonly SelectionEntry[]): string {
  return selection
    .filter((entry) => ID.test(entry.id) && Number.isFinite(entry.quantity) && entry.quantity > 0)
    .slice(0, MAX_SELECTION_ENTRIES)
    .map((entry) => `${entry.id}:${entry.quantity}`)
    .join(",");
}

/** Leest de parameter weer uit. Alles wat niet klopt wordt overgeslagen. */
export function decodeSelection(value: string | null | undefined): SelectionEntry[] {
  if (!value) return [];
  const entries: SelectionEntry[] = [];
  for (const part of value.split(",").slice(0, MAX_SELECTION_ENTRIES)) {
    const [id, amount, ...rest] = part.split(":");
    if (!id || !amount || rest.length > 0) continue;
    if (!ID.test(id) || !/^\d{1,5}(\.\d{1,2})?$/.test(amount)) continue;
    const quantity = Number(amount);
    if (quantity > 0) entries.push({ id, quantity });
  }
  return entries;
}
