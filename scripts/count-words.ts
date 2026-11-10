// Telt de woorden van de unieke tekst per dienstpagina (richtlijn: minimaal ±500).
// Gebruik: npx tsx scripts/count-words.ts
import { site } from "../config/site";
import { getServiceDetail } from "../content/services";

const count = (text: string) => text.split(/\s+/).filter(Boolean).length;

for (const slug of site.services.enabled) {
  const d = getServiceDetail(slug);
  const texts = [
    d.heading,
    ...d.intro,
    d.whenNeeded.intro,
    ...d.whenNeeded.items.flatMap((i) => [i.title, i.text]),
    ...d.process.flatMap((i) => [i.title, i.text]),
    d.materials.intro,
    ...d.materials.items.flatMap((i) => [i.title, i.text]),
    ...d.priceFactors,
    ...d.faq.flatMap((i) => [i.question, i.answer]),
  ];
  const words = texts.reduce((sum, text) => sum + count(text), 0);
  console.log(`${words < 500 ? "TE KORT" : "ok     "} ${String(words).padStart(4)}  ${slug}`);
}
