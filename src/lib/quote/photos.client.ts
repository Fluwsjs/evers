import { scaleToFit, SHRINK_STEPS, SHRINK_TARGET_BYTES, shrunkName } from "./photos";

/**
 * Foto's verkleinen in de browser, vóór het verzenden.
 *
 * Telefoonfoto's zijn al snel 3 tot 10 MB per stuk, terwijl hostingplatforms als Netlify
 * een verzoek boven ±4,5 MB weigeren. Verkleind tot hooguit 1920 px is een foto nog ruim
 * scherp genoeg om een dak te beoordelen en blijft hij onder de 750 kB. Bijkomend
 * voordeel: het uploaden gaat op mobiel veel sneller en de EXIF-gegevens (waaronder de
 * locatie) gaan niet mee.
 *
 * Dit bestand gebruikt browser-API's en hoort alleen in client-componenten.
 */

interface DecodedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
}

/** Leest de foto in. `null` als de browser het bestandstype niet kan tonen (bijvoorbeeld HEIC buiten Safari). */
async function decode(file: File): Promise<DecodedImage | null> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() };
    } catch {
      // Sommige browsers lezen een type wel via <img> maar niet via createImageBitmap.
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    };
  } catch {
    URL.revokeObjectURL(url);
    return null;
  }
}

function encode(source: CanvasImageSource, width: number, height: number, quality: number): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return Promise.resolve(null);
  // Witte ondergrond: doorzichtige delen van een png worden in jpeg anders zwart.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(source, 0, 0, width, height);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

export interface ShrinkResult {
  file: File;
  /** `false` = de foto gaat ongewijzigd mee: hij was al klein, of de browser kon hem niet lezen. */
  shrunk: boolean;
  /** De browser kon de foto niet lezen, dus ook niet verkleinen. */
  unreadable: boolean;
}

/**
 * Verkleint één foto tot jpeg. Lukt dat niet, of wordt de foto er niet kleiner van, dan
 * komt het oorspronkelijke bestand terug. Gooit nooit een fout.
 */
export async function shrinkPhoto(file: File): Promise<ShrinkResult> {
  const image = await decode(file);
  if (!image || image.width === 0 || image.height === 0) {
    image?.release();
    return { file, shrunk: false, unreadable: true };
  }

  try {
    let best: Blob | null = null;
    for (const step of SHRINK_STEPS) {
      const size = scaleToFit(image.width, image.height, step.maxSide);
      const blob = await encode(image.source, size.width, size.height, step.quality);
      if (!blob) break;
      best = blob;
      if (blob.size <= SHRINK_TARGET_BYTES) break;
    }

    if (!best || best.size >= file.size) return { file, shrunk: false, unreadable: false };

    return {
      file: new File([best], shrunkName(file.name), { type: "image/jpeg", lastModified: file.lastModified }),
      shrunk: true,
      unreadable: false,
    };
  } catch {
    return { file, shrunk: false, unreadable: false };
  } finally {
    image.release();
  }
}
