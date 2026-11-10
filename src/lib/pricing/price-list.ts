import { site } from "@config/site";
import type { PriceUnit } from "@config/types";
import { getActiveServices, showTodos } from "@/lib/site";
import type { PriceListItem } from "./types";

/**
 * De prijslijst zoals de site die toont, afgeleid van `site.pricing`.
 *
 * Een prijs die de klant nog niet heeft bevestigd is een voorbeeldprijs. Die is alleen
 * zichtbaar tijdens de bouw (zie `showTodos`) en dan gemarkeerd als voorbeeld. Op de live
 * site wordt zo'n prijs behandeld alsof hij ontbreekt: "Prijs op aanvraag". Zo kan er
 * nooit per ongeluk een verzonnen bedrag online komen.
 */
export interface PublicPriceItem extends PriceListItem {
  serviceSlug: string;
  /** Voorbeeldprijs die nog bevestigd moet worden (alleen zichtbaar tijdens de bouw). */
  example: boolean;
}

export interface PriceGroup {
  serviceSlug: string;
  title: string;
  items: PublicPriceItem[];
}

export function getPriceList(): PublicPriceItem[] {
  const active = getActiveServices().map((service) => service.slug);
  return site.pricing.items
    .filter((item) => active.includes(item.serviceSlug))
    .sort((a, b) => active.indexOf(a.serviceSlug) - active.indexOf(b.serviceSlug))
    .map((item) => {
      const visible = item.fromPrice !== null && (item.confirmed || showTodos);
      return {
        id: item.id,
        serviceSlug: item.serviceSlug,
        label: item.label,
        unit: item.unit,
        unitPrice: visible ? item.fromPrice : null,
        minimum: visible ? item.minimum : null,
        example: visible && !item.confirmed,
      };
    });
}

/** De prijslijst per dienst, in de volgorde van de actieve diensten. */
export function getPriceGroups(): PriceGroup[] {
  const list = getPriceList();
  return getActiveServices()
    .map((service) => ({
      serviceSlug: service.slug,
      title: service.title,
      items: list.filter((item) => item.serviceSlug === service.slug),
    }))
    .filter((group) => group.items.length > 0);
}

/** Staat er minstens één prijs op de site? Zo niet, dan valt er niets te berekenen. */
export function hasVisiblePrices(): boolean {
  return getPriceList().some((item) => item.unitPrice !== null);
}

/** Is de calculator te zien? Alleen als hij aan staat en er prijzen zijn om mee te rekenen. */
export function isCalculatorVisible(): boolean {
  return site.features.calculator && hasVisiblePrices();
}

export interface FromPrice {
  amount: number;
  unit: PriceUnit;
  label: string;
  example: boolean;
}

/** De vanaf-prijs van een dienst: het eerste werk met een prijs. `null` = prijs op aanvraag. */
export function getFromPrice(serviceSlug: string): FromPrice | null {
  const item = getPriceList().find((entry) => entry.serviceSlug === serviceSlug && entry.unitPrice !== null);
  if (!item || item.unitPrice === null) return null;
  return { amount: item.unitPrice, unit: item.unit, label: item.label, example: item.example };
}
