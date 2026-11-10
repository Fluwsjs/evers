/**
 * Keuzes voor het offerteformulier. Gedeeld door de eerste stap op de homepage
 * en het volledige formulier (fase 6), zodat beide altijd dezelfde opties tonen.
 */
export const roofTypes = [
  { value: "hellend", label: "Hellend dak" },
  { value: "plat", label: "Plat dak" },
  { value: "schilddak", label: "Schilddak" },
  { value: "anders", label: "Anders / weet ik niet" },
] as const;

export type RoofType = (typeof roofTypes)[number]["value"];

/** Namen van de queryparameters waarmee stap 1 wordt doorgegeven aan /offerte-aanvragen/. */
export const quoteParams = {
  service: "dienst",
  roofType: "dak",
  urgent: "spoed",
} as const;
