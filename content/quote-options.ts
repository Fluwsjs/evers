/**
 * Keuzes voor de formulieren. Gedeeld door de eerste stap op de homepage, het volledige
 * offerteformulier, het terugbelformulier en de validatie op de server, zodat overal
 * dezelfde opties gelden.
 */
export const roofTypes = [
  { value: "hellend", label: "Hellend dak" },
  { value: "plat", label: "Plat dak" },
  { value: "schilddak", label: "Schilddak" },
  { value: "anders", label: "Anders / weet ik niet" },
] as const;

export type RoofType = (typeof roofTypes)[number]["value"];

export const contactMoments = [
  { value: "zsm", label: "Zo snel mogelijk" },
  { value: "ochtend", label: "Ochtend" },
  { value: "middag", label: "Middag" },
  { value: "avond", label: "Avond" },
] as const;

export type ContactMoment = (typeof contactMoments)[number]["value"];

/** Keuze naast de diensten uit de config, voor wie nog niet weet wat nodig is. */
export const OTHER_SERVICE = { value: "anders", label: "Anders / weet ik nog niet" } as const;

/** Namen van de queryparameters waarmee stap 1 wordt doorgegeven aan /offerte-aanvragen/. */
export const quoteParams = {
  service: "dienst",
  roofType: "dak",
  urgent: "spoed",
} as const;

/** Grenzen voor foto-uploads. */
export const photoLimits = {
  maxFiles: 5,
  maxBytes: 10 * 1024 * 1024,
  /**
   * Zoveel mogen de foto's samen zijn op het moment van verzenden, dus ná het verkleinen
   * in de browser. Hostingplatforms als Netlify weigeren een verzoek boven ±4,5 MB.
   */
  maxTotalUploadBytes: 4 * 1024 * 1024,
  extensions: ["jpg", "jpeg", "png", "webp", "heic", "heif"],
  /** Voor het `accept`-attribuut van het bestandsveld. */
  accept: "image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif",
} as const;
