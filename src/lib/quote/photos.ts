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
