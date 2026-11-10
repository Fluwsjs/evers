import { describe, expect, it } from "vitest";
import { photoLimits } from "@content/quote-options";
import {
  detectPhotoKind,
  fileExtension,
  fitWithinUploadLimit,
  formatBytes,
  scaleToFit,
  SHRINK_STEPS,
  SHRINK_TARGET_BYTES,
  shrunkName,
  totalBytes,
  uploadLimitMessage,
  validatePhotos,
  validateUploadTotal,
} from "./photos";

const MB = 1024 * 1024;
const photo = (name: string, size = 2 * MB) => ({ name, size });
const bytes = (...values: Array<number | string>) =>
  new Uint8Array(values.flatMap((value) => (typeof value === "string" ? [...value].map((c) => c.charCodeAt(0)) : [value])));

describe("validatePhotos", () => {
  it("accepteert geen foto's (uploaden is optioneel)", () => {
    expect(validatePhotos([])).toBeNull();
  });

  it("accepteert vijf foto's van toegestane typen", () => {
    expect(
      validatePhotos([photo("a.jpg"), photo("b.JPEG"), photo("c.png"), photo("d.webp"), photo("IMG_0001.HEIC")]),
    ).toBeNull();
  });

  it("weigert meer dan vijf foto's", () => {
    const six = Array.from({ length: 6 }, (_, index) => photo(`foto-${index}.jpg`));
    expect(validatePhotos(six)).toMatch(/maximaal 5 foto's/);
  });

  it("weigert een foto boven de 10 MB", () => {
    expect(validatePhotos([photo("groot.jpg", 10 * MB + 1)])).toMatch(/te groot/);
    expect(validatePhotos([photo("precies.jpg", 10 * MB)])).toBeNull();
  });

  it.each(["offerte.pdf", "foto.gif", "virus.exe", "foto.jpg.exe", "zonder-extensie"])("weigert %s", (name) => {
    expect(validatePhotos([photo(name)])).toMatch(/geen ondersteund bestandstype/);
  });

  it("weigert een leeg bestand", () => {
    expect(validatePhotos([photo("leeg.jpg", 0)])).toMatch(/is leeg/);
  });
});

describe("detectPhotoKind", () => {
  it("herkent jpeg, png, webp en heic aan de inhoud", () => {
    expect(detectPhotoKind(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe("jpeg");
    expect(detectPhotoKind(bytes(0x89, "PNG", 0x0d, 0x0a, 0x1a, 0x0a))).toBe("png");
    expect(detectPhotoKind(bytes("RIFF", 0, 0, 0, 0, "WEBP"))).toBe("webp");
    expect(detectPhotoKind(bytes(0, 0, 0, 0x18, "ftyp", "heic"))).toBe("heic");
  });

  it("weigert bestanden die alleen een foto-extensie hebben", () => {
    expect(detectPhotoKind(bytes("%PDF-1.7"))).toBeNull();
    expect(detectPhotoKind(bytes("MZ", 0x90, 0x00, 0, 0, 0, 0, 0, 0, 0, 0))).toBeNull();
    expect(detectPhotoKind(bytes(0, 0, 0, 0x18, "ftyp", "mp42"))).toBeNull();
    expect(detectPhotoKind(new Uint8Array())).toBeNull();
  });
});

describe("hulpfuncties", () => {
  it("leest de extensie in kleine letters", () => {
    expect(fileExtension("IMG_1234.JPG")).toBe("jpg");
    expect(fileExtension("zonder")).toBe("");
  });

  it("toont bestandsgroottes leesbaar", () => {
    expect(formatBytes(500 * 1024)).toBe("500 kB");
    expect(formatBytes(10 * MB)).toBe("10 MB");
    expect(formatBytes(2.5 * MB)).toBe("2,5 MB");
  });
});

describe("verkleinen voor het verzenden", () => {
  it("laat een foto die al klein genoeg is zoals hij is", () => {
    expect(scaleToFit(1600, 1200, 1920)).toEqual({ width: 1600, height: 1200 });
    expect(scaleToFit(1920, 1080, 1920)).toEqual({ width: 1920, height: 1080 });
  });

  it("verkleint tot de langste zijde past en houdt de verhouding", () => {
    expect(scaleToFit(4000, 3000, 1920)).toEqual({ width: 1920, height: 1440 });
    expect(scaleToFit(3000, 4000, 1920)).toEqual({ width: 1440, height: 1920 });
    expect(scaleToFit(8000, 100, 1920)).toEqual({ width: 1920, height: 24 });
  });

  it("maakt een maat nooit kleiner dan één pixel", () => {
    expect(scaleToFit(20000, 2, 1024)).toEqual({ width: 1024, height: 1 });
  });

  it("elke stap is kleiner dan de vorige", () => {
    for (let index = 1; index < SHRINK_STEPS.length; index += 1) {
      expect(SHRINK_STEPS[index]!.maxSide).toBeLessThan(SHRINK_STEPS[index - 1]!.maxSide);
      expect(SHRINK_STEPS[index]!.quality).toBeLessThan(SHRINK_STEPS[index - 1]!.quality);
    }
  });

  it("het maximale aantal verkleinde foto's past samen binnen de verzendlimiet", () => {
    expect(photoLimits.maxFiles * SHRINK_TARGET_BYTES).toBeLessThanOrEqual(photoLimits.maxTotalUploadBytes);
  });

  it("geeft een verkleinde foto de extensie jpg", () => {
    expect(shrunkName("IMG_0001.HEIC")).toBe("IMG_0001.jpg");
    expect(shrunkName("dak.voor.png")).toBe("dak.voor.jpg");
    expect(shrunkName("foto")).toBe("foto.jpg");
    expect(shrunkName(".verborgen")).toBe(".verborgen.jpg");
  });
});

describe("verzendlimiet voor alle foto's samen", () => {
  it("accepteert foto's zolang ze samen binnen de limiet blijven", () => {
    const { accepted, rejected } = fitWithinUploadLimit([photo("a.jpg", 1 * MB)], [photo("b.jpg", 1 * MB), photo("c.jpg", 2 * MB)]);
    expect(accepted.map((item) => item.name)).toEqual(["b.jpg", "c.jpg"]);
    expect(rejected).toEqual([]);
    expect(uploadLimitMessage(rejected)).toBeNull();
  });

  it("weigert wat er niet meer bij past, maar neemt kleinere foto's daarna nog wel mee", () => {
    const { accepted, rejected } = fitWithinUploadLimit(
      [photo("a.jpg", 3 * MB)],
      [photo("groot.jpg", 2 * MB), photo("klein.jpg", 0.5 * MB)],
    );
    expect(accepted.map((item) => item.name)).toEqual(["klein.jpg"]);
    expect(rejected.map((item) => item.name)).toEqual(["groot.jpg"]);
  });

  it("legt uit waarom een foto niet mee kan", () => {
    expect(uploadLimitMessage([photo("groot.jpg", 3 * MB)])).toMatch(/past er niet meer bij: samen mogen de foto's maximaal 4 MB/);
    expect(uploadLimitMessage([{ ...photo("IMG_1.heic", 5 * MB), unreadable: true }])).toMatch(/kon in deze browser niet worden verkleind/);
    expect(uploadLimitMessage([photo("a.jpg", 3 * MB), photo("b.jpg", 3 * MB)])).toMatch(/ook voor 1 andere foto\./);
    expect(uploadLimitMessage([photo("a.jpg", 3 * MB), photo("b.jpg", 3 * MB), photo("c.jpg", 3 * MB)])).toMatch(/2 andere foto's/);
  });

  it("controleert het totaal vlak voor het verzenden", () => {
    expect(validateUploadTotal([photo("a.jpg", 2 * MB), photo("b.jpg", 2 * MB)])).toBeNull();
    expect(validateUploadTotal([photo("a.jpg", 2 * MB), photo("b.jpg", 2 * MB + 1)])).toMatch(/samen te groot/);
    expect(totalBytes([photo("a.jpg", 10), photo("b.jpg", 5)])).toBe(15);
  });
});
