import { randomInt } from "node:crypto";

// Zonder tekens die op elkaar lijken (0/O, 1/I), zodat het nummer aan de telefoon door te geven is.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Referentienummer voor een aanvraag, bijvoorbeeld "EV-20261110-K7QP". */
export function createReference(date = new Date()): string {
  const day = date.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return `EV-${day}-${suffix}`;
}
