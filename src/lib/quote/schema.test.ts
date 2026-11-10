import { describe, expect, it } from "vitest";
import {
  callbackFormSchema,
  isValidPhone,
  normalizePhone,
  normalizePostcode,
  quoteFormSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  toFieldErrors,
} from "./schema";

const validQuote = {
  services: ["dakrenovatie"],
  roofType: "hellend",
  urgent: false,
  postcode: "6661 AB",
  houseNumber: "10",
  street: "Dorpsstraat",
  city: "Elst",
  description: "Er lekt water bij de schoorsteen op zolder.",
  name: "J. de Vries",
  phone: "06 12 34 56 78",
  email: "naam@voorbeeld.nl",
  preferredMoment: "ochtend",
  privacyConsent: true,
};

/** Foutmeldingen per veld voor een (deels) ongeldige invoer. */
function errorsFor(schema: { safeParse: (input: unknown) => { success: boolean; error?: unknown } }, input: unknown) {
  const result = schema.safeParse(input);
  if (result.success) return {};
  return toFieldErrors(result.error as Parameters<typeof toFieldErrors>[0]);
}

describe("telefoonnummers", () => {
  it.each(["0612345678", "06 12 34 56 78", "06-12345678", "+31612345678", "0031 6 12345678", "026 123 4567", "+49 151 23456789"])(
    "accepteert %s",
    (phone) => expect(isValidPhone(phone)).toBe(true),
  );

  it.each(["", "12345", "0012345678", "06 1234", "abcdefghij", "+31 0612345678", "061234567890"])(
    "weigert %s",
    (phone) => expect(isValidPhone(phone)).toBe(false),
  );

  it("verwijdert spaties, streepjes en haakjes", () => {
    expect(normalizePhone("(06) 12-34 56.78")).toBe("0612345678");
    expect(normalizePhone("+31 6 12345678")).toBe("+31612345678");
  });
});

describe("postcode", () => {
  it("zet een postcode in het standaardformaat", () => {
    expect(normalizePostcode("6661ab")).toBe("6661 AB");
    expect(normalizePostcode(" 6661 Ab ")).toBe("6661 AB");
  });

  it.each(["6661 AB", "6661AB", "6661ab"])("accepteert %s", (postcode) => {
    expect(errorsFor(step2Schema, { ...validQuote, postcode }).postcode).toBeUndefined();
  });

  it.each(["0661 AB", "666 AB", "6661 A", "6661", "ABCD 12"])("weigert %s", (postcode) => {
    expect(errorsFor(step2Schema, { ...validQuote, postcode }).postcode).toBeDefined();
  });
});

describe("stap 1: uw klus", () => {
  it("is geldig met een dienst en een daktype", () => {
    expect(step1Schema.safeParse(validQuote).success).toBe(true);
  });

  it("vraagt om minimaal één dienst", () => {
    expect(errorsFor(step1Schema, { ...validQuote, services: [] }).services).toMatch(/minimaal één dienst/);
  });

  it("vraagt om een daktype", () => {
    expect(errorsFor(step1Schema, { ...validQuote, roofType: "" }).roofType).toBe("Kies wat voor dak u heeft.");
    expect(errorsFor(step1Schema, { ...validQuote, roofType: "rieten-dak" }).roofType).toBeDefined();
  });
});

describe("stap 2: details", () => {
  it("is geldig zonder straat", () => {
    expect(step2Schema.safeParse({ ...validQuote, street: undefined }).success).toBe(true);
  });

  it.each(["10", "10a", "10 A", "10-2", "123 bis"])("accepteert huisnummer %s", (houseNumber) => {
    expect(errorsFor(step2Schema, { ...validQuote, houseNumber }).houseNumber).toBeUndefined();
  });

  it.each(["", "a10", "tien"])("weigert huisnummer %s", (houseNumber) => {
    expect(errorsFor(step2Schema, { ...validQuote, houseNumber }).houseNumber).toBeDefined();
  });

  it("vraagt om een omschrijving van minimaal 10 tekens", () => {
    expect(errorsFor(step2Schema, { ...validQuote, description: "lekkage" }).description).toMatch(/minimaal 10 tekens/);
    expect(errorsFor(step2Schema, { ...validQuote, description: "          " }).description).toBeDefined();
  });

  it("begrenst de lengte van de omschrijving", () => {
    expect(errorsFor(step2Schema, { ...validQuote, description: "a".repeat(3001) }).description).toMatch(/te lang/);
  });

  it("vraagt om een plaats", () => {
    expect(errorsFor(step2Schema, { ...validQuote, city: "" }).city).toBe("Vul uw plaats in.");
  });
});

describe("stap 3: gegevens", () => {
  it("is geldig met alle gegevens", () => {
    expect(step3Schema.safeParse(validQuote).success).toBe(true);
  });

  it.each(["", "naam", "naam@", "@voorbeeld.nl", "naam@voorbeeld"])("weigert e-mailadres %s", (email) => {
    expect(errorsFor(step3Schema, { ...validQuote, email }).email).toBeDefined();
  });

  it("haalt spaties rond het e-mailadres weg", () => {
    const result = step3Schema.safeParse({ ...validQuote, email: "  naam@voorbeeld.nl " });
    expect(result.success && result.data.email).toBe("naam@voorbeeld.nl");
  });

  it("eist akkoord met de privacyverklaring", () => {
    expect(errorsFor(step3Schema, { ...validQuote, privacyConsent: false }).privacyConsent).toMatch(/privacyverklaring/);
  });

  it("weigert een onbekend contactmoment", () => {
    expect(errorsFor(step3Schema, { ...validQuote, preferredMoment: "nacht" }).preferredMoment).toBeDefined();
  });
});

describe("volledig offerteformulier", () => {
  it("accepteert een volledig ingevulde aanvraag", () => {
    expect(quoteFormSchema.safeParse({ ...validQuote, website: "", startedAt: 1 }).success).toBe(true);
  });

  it("geeft per veld één foutmelding", () => {
    const errors = errorsFor(quoteFormSchema, { ...validQuote, name: "", phone: "123", email: "x" });
    expect(Object.keys(errors).sort()).toEqual(["email", "name", "phone"]);
    expect(errors.name).toBe("Vul uw naam in.");
  });

  it("laat onbekende velden niet door", () => {
    const result = quoteFormSchema.safeParse({ ...validQuote, isAdmin: true });
    expect(result.success && "isAdmin" in result.data).toBe(false);
  });
});

describe("terugbelformulier", () => {
  const validCallback = { name: "J. de Vries", phone: "0612345678", preferredMoment: "zsm" };

  it("accepteert naam, telefoon en moment", () => {
    expect(callbackFormSchema.safeParse(validCallback).success).toBe(true);
  });

  it("vraagt om naam en geldig telefoonnummer", () => {
    const errors = errorsFor(callbackFormSchema, { ...validCallback, name: " ", phone: "nul zes" });
    expect(errors.name).toBeDefined();
    expect(errors.phone).toMatch(/geldig telefoonnummer/);
  });
});

describe("contactformulier", () => {
  const validContact = { name: "J. de Vries", email: "naam@voorbeeld.nl", message: "Ik heb een vraag over mijn dakgoot." };

  it("accepteert een bericht zonder telefoonnummer", async () => {
    const { contactFormSchema } = await import("./schema");
    expect(contactFormSchema.safeParse(validContact).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...validContact, phone: "" }).success).toBe(true);
  });

  it("controleert een ingevuld telefoonnummer wel", async () => {
    const { contactFormSchema } = await import("./schema");
    expect(errorsFor(contactFormSchema, { ...validContact, phone: "123" }).phone).toMatch(/geldig telefoonnummer/);
    expect(contactFormSchema.safeParse({ ...validContact, phone: "06 12 34 56 78" }).success).toBe(true);
  });

  it("vraagt om een e-mailadres en een bericht van minimaal 10 tekens", async () => {
    const { contactFormSchema } = await import("./schema");
    const errors = errorsFor(contactFormSchema, { ...validContact, email: "", message: "Hallo" });
    expect(errors.email).toBe("Vul uw e-mailadres in.");
    expect(errors.message).toMatch(/minimaal 10 tekens/);
  });
});
