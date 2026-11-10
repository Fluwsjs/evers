// Controleert of er nog onbevestigde (voorbeeld)prijzen in config/site.ts staan.
// Draait automatisch vóór `npm run build`. Los uitvoeren: npm run check:prices
//
// - Standaard: waarschuwt en laat de build doorgaan. Onbevestigde prijzen verschijnen
//   niet op de live site; daar staat dan "Prijs op aanvraag".
// - Met REQUIRE_CONFIRMED_PRICES=true: de build stopt zolang er onbevestigde prijzen zijn.
import { site } from "../config/site";

const { items, vatRate } = site.pricing;
const problems: string[] = [];

const ids = new Set<string>();
for (const item of items) {
  if (ids.has(item.id)) problems.push(`Dubbele sleutel "${item.id}".`);
  ids.add(item.id);
  if (!/^[a-z0-9-]{1,60}$/.test(item.id)) problems.push(`Sleutel "${item.id}" mag alleen kleine letters, cijfers en streepjes bevatten.`);
  if (item.fromPrice !== null && !(item.fromPrice > 0)) problems.push(`Prijs van "${item.id}" moet groter zijn dan 0, of null.`);
  if (item.minimum !== null && !(item.minimum > 0)) problems.push(`Minimum van "${item.id}" moet groter zijn dan 0, of null.`);
}
if (!(vatRate >= 0 && vatRate < 1)) problems.push(`Btw-tarief ${vatRate} klopt niet: gebruik bijvoorbeeld 0.21.`);

if (problems.length > 0) {
  console.error("\nFout in de prijslijst (config/site.ts):");
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error("");
  process.exit(1);
}

const unconfirmed = items.filter((item) => item.fromPrice !== null && !item.confirmed);

if (unconfirmed.length === 0) {
  console.log("Prijzen: alle prijzen in de config zijn bevestigd.");
  process.exit(0);
}

const strict = process.env.REQUIRE_CONFIRMED_PRICES === "true";
const log = strict ? console.error : console.warn;

log(`\n${strict ? "FOUT" : "WAARSCHUWING"}: ${unconfirmed.length} van de ${items.length} prijzen in config/site.ts zijn nog niet bevestigd door de klant:`);
for (const item of unconfirmed) {
  log(`  - ${item.id} (${item.serviceSlug}): ${item.fromPrice} euro per ${item.unit}`);
}

if (strict) {
  log("\nREQUIRE_CONFIRMED_PRICES=true: de build stopt. Zet de echte prijs in en `confirmed: true`, of zet `fromPrice` op null.\n");
  process.exit(1);
}

log('\nDeze prijzen verschijnen niet op de live site; daar staat "Prijs op aanvraag" en de calculator blijft verborgen.');
log("Zet REQUIRE_CONFIRMED_PRICES=true om de build te laten stoppen zolang er onbevestigde prijzen zijn.\n");
