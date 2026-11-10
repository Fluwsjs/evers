import "server-only";
import sharp from "sharp";
import type { MailAttachment } from "@/lib/mail/send";
import { detectPhotoKind, validatePhotos, type PhotoKind } from "./photos";

/** Mailservers weigeren vaak berichten boven ±25 MB. We blijven daar ruim onder. */
const MAIL_ATTACHMENT_BUDGET = 18 * 1024 * 1024;
const MAX_SIDE = 2200;

const contentTypes: Record<PhotoKind, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
};

export interface ProcessedPhotos {
  attachments: MailAttachment[];
  /** Bestandsnamen die niet meer in de mail pasten. */
  omitted: string[];
}

export type PhotoResult = { ok: true; photos: ProcessedPhotos } | { ok: false; message: string };

/**
 * Controleert de foto's (aantal, grootte, type én inhoud) en maakt ze klaar als mailbijlage.
 *
 * Foto's worden verkleind tot maximaal 2200 px en opgeslagen als JPEG: vijf telefoonfoto's
 * van 10 MB passen anders in geen enkele mailbox. Daarbij verdwijnen ook de EXIF-gegevens.
 * HEIC kan niet op de server worden omgezet en gaat ongewijzigd mee.
 */
export async function processPhotos(files: File[]): Promise<PhotoResult> {
  const basicError = validatePhotos(files);
  if (basicError) return { ok: false, message: basicError };

  const attachments: MailAttachment[] = [];
  const omitted: string[] = [];
  let total = 0;

  for (const [index, file] of files.entries()) {
    const original = Buffer.from(await file.arrayBuffer());
    const kind = detectPhotoKind(original);
    if (!kind) {
      return {
        ok: false,
        message: `"${file.name}" is geen geldige foto. Kies een jpg-, png-, webp- of heic-bestand.`,
      };
    }

    let content = original;
    let contentType = contentTypes[kind];
    let extension = kind === "jpeg" ? "jpg" : kind;

    if (kind !== "heic") {
      try {
        content = await sharp(original)
          .rotate()
          .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 82, mozjpeg: true })
          .toBuffer();
        contentType = "image/jpeg";
        extension = "jpg";
      } catch {
        return { ok: false, message: `"${file.name}" kon niet worden gelezen. Probeer een andere foto.` };
      }
    }

    if (total + content.length > MAIL_ATTACHMENT_BUDGET) {
      omitted.push(file.name);
      continue;
    }
    total += content.length;
    // Eigen bestandsnaam: de oorspronkelijke naam komt van de bezoeker en gaat niet de mail in.
    attachments.push({ filename: `foto-${index + 1}.${extension}`, content, contentType });
  }

  return { ok: true, photos: { attachments, omitted } };
}
