import { photoLimits } from "@content/quote-options";

/**
 * Controle van geüploade foto's. Dit bestand bevat geen Node-code en draait dus
 * ook in de browser; de inhoudscontrole (magic bytes) zit in photos.server.ts.
 */

export interface PhotoLike {
  name: string;
  size: number;
}

export function fileExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot + 1).toLowerCase();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} kB`;
  return `${(bytes / (1024 * 1024)).toLocaleString("nl-NL", { maximumFractionDigits: 1 })} MB`;
}

/** Geeft een foutmelding terug, of `null` als de foto's in orde zijn. */
export function validatePhotos(photos: PhotoLike[]): string | null {
  if (photos.length > photoLimits.maxFiles) {
    return `U kunt maximaal ${photoLimits.maxFiles} foto's meesturen. Verwijder er ${photos.length - photoLimits.maxFiles}.`;
  }
  for (const photo of photos) {
    if (!(photoLimits.extensions as readonly string[]).includes(fileExtension(photo.name))) {
      return `"${photo.name}" is geen ondersteund bestandstype. Kies een jpg-, png-, webp- of heic-foto.`;
    }
    if (photo.size > photoLimits.maxBytes) {
      return `"${photo.name}" is te groot (${formatBytes(photo.size)}). Een foto mag maximaal ${formatBytes(photoLimits.maxBytes)} zijn.`;
    }
    if (photo.size === 0) {
      return `"${photo.name}" is leeg. Kies een ander bestand.`;
    }
  }
  return null;
}

/**
 * Verkleinen in de browser (zie photos.client.ts): elke stap is kleiner dan de vorige.
 * De eerste stap die onder het doel uitkomt wordt gebruikt.
 */
export const SHRINK_STEPS = [
  { maxSide: 1920, quality: 0.82 },
  { maxSide: 1600, quality: 0.78 },
  { maxSide: 1280, quality: 0.72 },
  { maxSide: 1024, quality: 0.68 },
] as const;

/** Doel per foto: het maximale aantal foto's past dan samen binnen de verzendlimiet. */
export const SHRINK_TARGET_BYTES = 750 * 1024;

/** Nieuwe maten waarbij de langste zijde hooguit `maxSide` is. Vergroot nooit. */
export function scaleToFit(width: number, height: number, maxSide: number): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= maxSide) return { width, height };
  const factor = maxSide / longest;
  return { width: Math.max(1, Math.round(width * factor)), height: Math.max(1, Math.round(height * factor)) };
}

/** "IMG_0001.HEIC" → "IMG_0001.jpg": een verkleinde foto is altijd een jpeg. */
export function shrunkName(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return `${dot <= 0 ? filename : filename.slice(0, dot)}.jpg`;
}

export function totalBytes(photos: PhotoLike[]): number {
  return photos.reduce((sum, photo) => sum + photo.size, 0);
}

export interface NamedPhoto extends PhotoLike {
  /** De browser kon deze foto niet lezen en dus niet verkleinen. */
  unreadable?: boolean;
}

/**
 * Verdeelt nieuw gekozen foto's in wat nog binnen de verzendlimiet past en wat niet.
 * De volgorde blijft die waarin de bezoeker de foto's koos.
 */
export function fitWithinUploadLimit<T extends NamedPhoto>(
  existing: PhotoLike[],
  added: T[],
): { accepted: T[]; rejected: T[] } {
  let total = totalBytes(existing);
  const accepted: T[] = [];
  const rejected: T[] = [];
  for (const photo of added) {
    if (total + photo.size <= photoLimits.maxTotalUploadBytes) {
      total += photo.size;
      accepted.push(photo);
    } else {
      rejected.push(photo);
    }
  }
  return { accepted, rejected };
}

/** Melding voor foto's die niet meer binnen de verzendlimiet passen. `null` als alles past. */
export function uploadLimitMessage(rejected: NamedPhoto[]): string | null {
  const first = rejected[0];
  if (!first) return null;
  const others = rejected.length > 1 ? ` Dat geldt ook voor ${rejected.length - 1} andere foto${rejected.length > 2 ? "'s" : ""}.` : "";
  const reason = first.unreadable
    ? `"${first.name}" kon in deze browser niet worden verkleind en is te groot om mee te sturen (${formatBytes(first.size)}). Kies een jpg-foto.`
    : `"${first.name}" past er niet meer bij: samen mogen de foto's maximaal ${formatBytes(photoLimits.maxTotalUploadBytes)} zijn.`;
  return `${reason}${others} U kunt foto's ook nasturen per e-mail.`;
}

/** Laatste controle vlak voor het verzenden. `null` als de foto's samen binnen de limiet blijven. */
export function validateUploadTotal(photos: PhotoLike[]): string | null {
  const total = totalBytes(photos);
  if (total <= photoLimits.maxTotalUploadBytes) return null;
  return `De foto's zijn samen te groot om te verzenden (${formatBytes(total)}, maximaal ${formatBytes(photoLimits.maxTotalUploadBytes)}). Haal een foto weg.`;
}

export type PhotoKind = "jpeg" | "png" | "webp" | "heic";

/**
 * Herkent het bestandstype aan de eerste bytes van de inhoud. De bestandsnaam en het
 * door de browser opgegeven type zijn niet te vertrouwen.
 */
export function detectPhotoKind(bytes: Uint8Array): PhotoKind | null {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end));

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (bytes.length >= 8 && bytes[0] === 0x89 && ascii(1, 4) === "PNG") return "png";
  if (bytes.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (bytes.length >= 12 && ascii(4, 8) === "ftyp") {
    const brand = ascii(8, 12);
    if (["heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs", "mif1", "msf1", "heif"].includes(brand)) {
      return "heic";
    }
  }
  return null;
}
