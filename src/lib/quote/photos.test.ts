import { describe, expect, it } from "vitest";
import { detectPhotoKind, fileExtension, formatBytes, validatePhotos } from "./photos";

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
