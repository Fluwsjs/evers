import { describe, expect, it } from "vitest";
import { calculateEstimate, MAX_QUANTITY, normalizeQuantity } from "./calculate";
import { formatEuro, formatQuantity, parseQuantity } from "./format";
import { decodeSelection, encodeSelection, MAX_SELECTION_ENTRIES } from "./selection";
import type { PriceListItem } from "./types";

const priceList: PriceListItem[] = [
  { id: "pannen", label: "Dakpannen vervangen", unit: "m2", unitPrice: 95 },
  { id: "goot", label: "Dakgoot vervangen", unit: "m1", unitPrice: 110.5 },
  { id: "dakraam", label: "Dakraam plaatsen", unit: "stuk", unitPrice: 1250 },
  { id: "schoorsteen", label: "Schoorsteen voegen", unit: "stuk", unitPrice: null },
  { id: "reparatie", label: "Kleine reparatie", unit: "m2", unitPrice: 40, minimum: 250 },
];

describe("calculateEstimate", () => {
  it("geeft een leeg resultaat zonder keuzes", () => {
    const estimate = calculateEstimate([], priceList);
    expect(estimate.lines).toEqual([]);
    expect(estimate.total).toBe(0);
    expect(estimate.vat).toBe(0);
    expect(estimate.hasOnRequestItems).toBe(false);
  });

  it("rekent aantal × prijs per regel en telt de regels op", () => {
    const estimate = calculateEstimate(
      [
        { id: "pannen", quantity: 80 },
        { id: "dakraam", quantity: 2 },
      ],
      priceList,
    );
    expect(estimate.lines.map((line) => line.amount)).toEqual([7600, 2500]);
    expect(estimate.total).toBe(10100);
  });

  it("rekent met decimalen zonder afrondingsfouten", () => {
    const estimate = calculateEstimate([{ id: "goot", quantity: 12.3 }], priceList);
    expect(estimate.lines[0]?.amount).toBe(1359.15);
    expect(estimate.total).toBe(1359.15);

    const cents = calculateEstimate([{ id: "a", quantity: 3 }], [{ id: "a", label: "A", unit: "stuk", unitPrice: 0.1 }]);
    expect(cents.total).toBe(0.3);
  });

  it("splitst het totaal in bedrag exclusief btw en btw", () => {
    const estimate = calculateEstimate([{ id: "pannen", quantity: 100 }], priceList, { vatRate: 0.21 });
    expect(estimate.total).toBe(9500);
    expect(estimate.totalExclVat).toBe(7851.24);
    expect(estimate.vat).toBe(1648.76);
    expect(estimate.totalExclVat + estimate.vat).toBeCloseTo(estimate.total, 2);
    expect(estimate.vatRate).toBe(0.21);
  });

  it("gebruikt het opgegeven btw-tarief", () => {
    const estimate = calculateEstimate([{ id: "pannen", quantity: 10 }], priceList, { vatRate: 0.09 });
    expect(estimate.totalExclVat).toBe(871.56);
    expect(estimate.vat).toBe(78.44);
  });

  it("zet de regels in de volgorde van de prijslijst", () => {
    const estimate = calculateEstimate(
      [
        { id: "dakraam", quantity: 1 },
        { id: "pannen", quantity: 10 },
      ],
      priceList,
    );
    expect(estimate.lines.map((line) => line.id)).toEqual(["pannen", "dakraam"]);
  });

  it("telt dubbel gekozen werk bij elkaar op", () => {
    const estimate = calculateEstimate(
      [
        { id: "pannen", quantity: 10 },
        { id: "pannen", quantity: 5.5 },
      ],
      priceList,
    );
    expect(estimate.lines).toHaveLength(1);
    expect(estimate.lines[0]?.quantity).toBe(15.5);
    expect(estimate.total).toBe(1472.5);
  });

  it("slaat onbekend werk en ongeldige aantallen over", () => {
    const estimate = calculateEstimate(
      [
        { id: "bestaat-niet", quantity: 10 },
        { id: "pannen", quantity: 0 },
        { id: "goot", quantity: -3 },
        { id: "dakraam", quantity: Number.NaN },
        { id: "dakraam", quantity: Number.POSITIVE_INFINITY },
      ],
      priceList,
    );
    expect(estimate.lines).toEqual([]);
    expect(estimate.total).toBe(0);
  });

  it("weigert halve stuks en aantallen boven de grens", () => {
    expect(calculateEstimate([{ id: "dakraam", quantity: 1.5 }], priceList).lines).toEqual([]);
    expect(calculateEstimate([{ id: "dakraam", quantity: MAX_QUANTITY.stuk + 1 }], priceList).lines).toEqual([]);
    expect(calculateEstimate([{ id: "pannen", quantity: MAX_QUANTITY.m2 + 1 }], priceList).lines).toEqual([]);
  });

  it("neemt werk zonder prijs op als regel, maar niet in het totaal", () => {
    const estimate = calculateEstimate(
      [
        { id: "pannen", quantity: 10 },
        { id: "schoorsteen", quantity: 1 },
      ],
      priceList,
    );
    expect(estimate.lines).toHaveLength(2);
    expect(estimate.lines[1]).toMatchObject({ id: "schoorsteen", amount: null, unitPrice: null });
    expect(estimate.total).toBe(950);
    expect(estimate.hasOnRequestItems).toBe(true);
  });

  it("rekent het minimumbedrag als aantal × prijs lager uitkomt", () => {
    const small = calculateEstimate([{ id: "reparatie", quantity: 2 }], priceList);
    expect(small.lines[0]).toMatchObject({ amount: 250, minimumApplied: true });

    const large = calculateEstimate([{ id: "reparatie", quantity: 10 }], priceList);
    expect(large.lines[0]).toMatchObject({ amount: 400, minimumApplied: false });
  });

  it("past de invoer niet aan", () => {
    const selection = Object.freeze([Object.freeze({ id: "pannen", quantity: 10 })]);
    expect(() => calculateEstimate(selection, Object.freeze([...priceList]))).not.toThrow();
  });
});

describe("normalizeQuantity", () => {
  it("rondt meters af op één decimaal", () => {
    expect(normalizeQuantity(12.34, "m2")).toBe(12.3);
    expect(normalizeQuantity(12.35, "m1")).toBe(12.4);
    expect(normalizeQuantity(80, "m2")).toBe(80);
  });

  it("weigert wat na afronden nul wordt", () => {
    expect(normalizeQuantity(0.04, "m2")).toBeNull();
  });

  it("accepteert alleen hele stuks", () => {
    expect(normalizeQuantity(3, "stuk")).toBe(3);
    expect(normalizeQuantity(2.5, "stuk")).toBeNull();
  });

  it("accepteert de grens zelf", () => {
    expect(normalizeQuantity(MAX_QUANTITY.m2, "m2")).toBe(MAX_QUANTITY.m2);
    expect(normalizeQuantity(MAX_QUANTITY.stuk, "stuk")).toBe(MAX_QUANTITY.stuk);
  });
});

describe("weergave", () => {
  it("toont hele bedragen zonder decimalen", () => {
    expect(formatEuro(95)).toBe("€ 95");
    expect(formatEuro(10100)).toBe("€ 10.100");
    expect(formatEuro(1359.15)).toBe("€ 1.359,15");
    expect(formatEuro(0.5)).toBe("€ 0,50");
  });

  it("toont aantallen met de juiste eenheid", () => {
    expect(formatQuantity(12.5, "m2")).toBe("12,5 m²");
    expect(formatQuantity(8, "m1")).toBe("8 m");
    expect(formatQuantity(1, "stuk")).toBe("1 stuk");
    expect(formatQuantity(3, "stuk")).toBe("3 stuks");
  });

  it.each([
    ["12", 12],
    ["12,5", 12.5],
    ["12.5", 12.5],
    [" 80 ", 80],
    ["0,25", 0.25],
  ])("leest %s als getal", (input, expected) => expect(parseQuantity(input)).toBe(expected));

  it.each(["", "abc", "12,5,3", "1e3", "-4", "12 m2", "1.000", "123456"])("weigert %s", (input) =>
    expect(parseQuantity(input)).toBeNull(),
  );
});

describe("keuzes doorgeven in de link", () => {
  it("zet keuzes om naar tekst en terug", () => {
    const selection = [
      { id: "dakpannen-vervangen", quantity: 80 },
      { id: "zinken-goot", quantity: 12.5 },
    ];
    const encoded = encodeSelection(selection);
    expect(encoded).toBe("dakpannen-vervangen:80,zinken-goot:12.5");
    expect(decodeSelection(encoded)).toEqual(selection);
  });

  it("geeft een lege lijst bij een lege of ontbrekende waarde", () => {
    expect(decodeSelection(null)).toEqual([]);
    expect(decodeSelection("")).toEqual([]);
  });

  it("slaat alles over wat niet klopt", () => {
    expect(decodeSelection("goot:abc,<script>:1,goot,goot:1:2,pannen:0,PANNEN:5,dakraam:2")).toEqual([
      { id: "dakraam", quantity: 2 },
    ]);
  });

  it("begrenst het aantal keuzes", () => {
    const many = Array.from({ length: 50 }, (_, index) => `werk-${index}:1`).join(",");
    expect(decodeSelection(many)).toHaveLength(MAX_SELECTION_ENTRIES);
    expect(encodeSelection(Array.from({ length: 50 }, (_, index) => ({ id: `werk-${index}`, quantity: 1 }))).split(",")).toHaveLength(
      MAX_SELECTION_ENTRIES,
    );
  });

  it("laat ongeldige keuzes weg bij het omzetten naar tekst", () => {
    expect(encodeSelection([{ id: "Fout Id", quantity: 1 }, { id: "goot", quantity: 0 }, { id: "goot", quantity: 4 }])).toBe("goot:4");
  });
});
