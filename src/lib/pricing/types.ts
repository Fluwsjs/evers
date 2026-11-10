import type { PriceUnit } from "@config/types";

export type { PriceUnit };

/**
 * Types voor de rekenmodule. De module kent geen config en geen React: de prijslijst
 * gaat erin als argument. Zo is dezelfde logica later te gebruiken voor de dakconfigurator.
 * Alle bedragen zijn in euro, inclusief btw.
 */
export interface PriceListItem {
  id: string;
  label: string;
  unit: PriceUnit;
  /** Vanaf-prijs per eenheid. `null` = prijs op aanvraag. */
  unitPrice: number | null;
  /** Laagste bedrag dat voor dit werk wordt gerekend. */
  minimum?: number | null;
}

/** Eén keuze van de bezoeker: welk werk, en hoeveel. */
export interface SelectionEntry {
  id: string;
  quantity: number;
}

export interface EstimateLine {
  id: string;
  label: string;
  unit: PriceUnit;
  quantity: number;
  unitPrice: number | null;
  /** `null` = prijs op aanvraag; telt niet mee in het totaal. */
  amount: number | null;
  /** Het minimumbedrag is gerekend in plaats van aantal × prijs. */
  minimumApplied: boolean;
}

export interface Estimate {
  lines: EstimateLine[];
  /** Som van alle regels met een prijs, inclusief btw. */
  total: number;
  totalExclVat: number;
  vat: number;
  vatRate: number;
  /** Er zit werk bij zonder prijs: het totaal is dan niet volledig. */
  hasOnRequestItems: boolean;
}
