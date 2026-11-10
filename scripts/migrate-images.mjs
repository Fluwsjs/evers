// Zet de originele foto's van de oude site om naar geoptimaliseerde bestanden met
// beschrijvende namen, en schrijft de afmetingen en alt-teksten naar content/images.generated.ts.
//
// Gebruik: node scripts/migrate-images.mjs
// Bron:    assets-src/origineel/   (gedownload van /wp-content/uploads/2025/02/)
// Doel:    public/images/
//
// EXIF-gegevens (waaronder eventuele gps-locatie) worden verwijderd.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "assets-src", "origineel");
const outDir = path.join(root, "public", "images");
const MAX_SIDE = 1920;

/** key → [bronbestand, doelpad (zonder extensie), alt-tekst, opties] */
const images = {
  // Algemene werkfoto's
  heroDakpannenLeggen: [
    "1.jpg",
    "werk/dakpannen-leggen-nieuwbouw-oranje-dakfolie",
    "Dakdekker legt antraciet dakpannen op een nieuwbouwdak met oranje dakfolie en panlatten",
  ],
  dakdekkerZinkwerk: [
    "1-1.jpg",
    "werk/dakdekker-monteert-metalen-goot-op-steiger",
    "Dakdekker met helm monteert op de steiger een metalen gootstuk langs de dakrand",
  ],
  dakdekkerOpLeienDak: [
    "4.jpg",
    "werk/dakdekker-gezekerd-op-leien-dak",
    "Dakdekker werkt gezekerd met een ladder op een steil leien dak onder een blauwe lucht",
  ],
  dakelementenRenovatie: [
    "ba46ff2c-f039-4a10-91b5-3ea4c067b2f9.jpg",
    "werk/dakrenovatie-isolerende-dakelementen-rijwoning",
    "Dak van een rijwoning tijdens renovatie, met nieuwe isolerende dakelementen en tengels, gezien vanaf de nok",
  ],
  renovatieRijwoningen: [
    "8743e698-e39a-4d4c-96f2-e8ecd46a0df2.jpg",
    "werk/dakrenovatie-rijwoningen-steiger-pallets-dakpannen",
    "Rijwoningen in de steiger tijdens een dakrenovatie, met pallets nieuwe dakpannen op straat",
  ],

  // Project: nieuwbouw Zutphen
  zutphen1: [
    "1-2.jpg",
    "projecten/nieuwbouw-zutphen/nieuwbouwwoning-antraciet-dakpannen-dakramen",
    "Nieuwbouwwoning in Zutphen met steil dak in antraciet dakpannen en twee dakramen",
  ],
  zutphen2: [
    "2-1.jpg",
    "projecten/nieuwbouw-zutphen/kilgoot-tussen-twee-dakvlakken",
    "Twee dakvlakken met antraciet dakpannen komen samen in een kilgoot op een nieuwbouwwoning in Zutphen",
  ],
  zutphen3: [
    "3.jpg",
    "projecten/nieuwbouw-zutphen/pannendak-met-zonnepanelen",
    "Opgeleverd pannendak met zonnepanelen op een nieuwbouwwoning in Zutphen",
  ],

  // Project: nieuwbouw Schuytgraaf (Arnhem)
  schuytgraaf1: [
    "1-4.jpg",
    "projecten/nieuwbouw-schuytgraaf-arnhem/nieuwbouwwoningen-in-steiger-pannendaken",
    "Nieuwbouwwoningen in Schuytgraaf in de steiger, met gedekte daken in donkere dakpannen",
  ],
  schuytgraaf2: [
    "2-2.jpg",
    "projecten/nieuwbouw-schuytgraaf-arnhem/dakpannen-klaargelegd-op-panlatten",
    "Stapels dakpannen liggen klaar op de panlatten, met op de achtergrond de nieuwbouwwijk Schuytgraaf",
  ],
  schuytgraaf3: [
    "3-1.jpg",
    "projecten/nieuwbouw-schuytgraaf-arnhem/woonblok-in-steiger-dak-in-uitvoering",
    "Woonblok in de steiger in Schuytgraaf terwijl het dak wordt gedekt",
  ],
  schuytgraaf4: [
    "4-1.jpg",
    "projecten/nieuwbouw-schuytgraaf-arnhem/gevel-bekleed-met-vlakke-dakpannen",
    "Zijgevel van een nieuwbouwwoning bekleed met vlakke donkere pannen, met uitzicht over de bouwplaats",
  ],
  schuytgraaf5: [
    "5-1.jpg",
    "projecten/nieuwbouw-schuytgraaf-arnhem/rij-woningen-dakramen-zonnepanelen",
    "Rij nieuwbouwwoningen in Schuytgraaf met gedekt dak, dakramen en zonnepanelen",
  ],
  schuytgraaf6: [
    "6-1.jpg",
    "projecten/nieuwbouw-schuytgraaf-arnhem/dak-in-uitvoering-vanaf-bouwplaats",
    "Dak van een woonblok in Schuytgraaf in uitvoering, gezien vanaf de bouwplaats",
  ],
  schuytgraaf7: [
    "7.jpg",
    "projecten/nieuwbouw-schuytgraaf-arnhem/kilgoot-detail-dakpannen-op-dakfolie",
    "Detail van een kilgoot waar dakpannen op oranje dakfolie op elkaar aansluiten",
  ],

  // Project: dakrenovatie Elst
  elst1: [
    "1-5.jpg",
    "projecten/dakrenovatie-elst/nieuw-pannendak-met-dakraam",
    "Nieuw gedekt pannendak met dakraam in Elst, gezien vanaf de steiger",
  ],
  elst2: [
    "2-3.jpg",
    "projecten/dakrenovatie-elst/dakvlak-nieuwe-dakpannen-en-goot",
    "Dakvlak met nieuwe donkere dakpannen, dakramen en dakgoot na de renovatie in Elst",
  ],
  elst3: [
    "3-2.jpg",
    "projecten/dakrenovatie-elst/dakkapellen-in-nieuw-pannendak",
    "Twee dakkapellen met antraciet zijwangen in het vernieuwde pannendak in Elst",
    { cropRight: 0.1 }, // vinger in beeld rechtsonder
  ],
  elst4: [
    "4-2.jpg",
    "projecten/dakrenovatie-elst/dakkapel-zinken-goot-en-regenpijp",
    "Dakkapellen met zinken goot en regenpijp langs de gevel van de woning in Elst",
  ],
  elst5: [
    "5-2.jpg",
    "projecten/dakrenovatie-elst/aansluiting-dakkapel-op-pannendak",
    "Aansluiting van een dakkapel op het pannendak, met de oude verweerde dakpannen",
  ],
  elst6: [
    "6-2.jpg",
    "projecten/dakrenovatie-elst/oude-dakpannen-naast-dakkapel",
    "Oude, verweerde dakpannen naast de zijwang van een dakkapel",
  ],
  elst7: [
    "7-1.jpg",
    "projecten/dakrenovatie-elst/dakkapel-met-metalen-daktrim",
    "Dakkapel met plat dak en metalen daktrim, ingewerkt in het pannendak",
  ],
  elst8: [
    "8.jpg",
    "projecten/dakrenovatie-elst/rij-dakkapellen-pannendak",
    "Rij dakkapellen op het pannendak van de woning in Elst",
  ],
};

const entries = [];

for (const [key, [source, target, alt, options = {}]] of Object.entries(images)) {
  let pipeline = sharp(path.join(srcDir, source)).rotate();
  const meta = await sharp(path.join(srcDir, source)).rotate().metadata();
  // Na .rotate() kloppen width/height uit metadata niet altijd; lees ze uit het resultaat.
  let { width, height } = await sharp(await sharp(path.join(srcDir, source)).rotate().toBuffer()).metadata();
  void meta;

  if (options.cropRight) {
    width = Math.round(width * (1 - options.cropRight));
    pipeline = pipeline.extract({ left: 0, top: 0, width, height });
  }

  const outFile = path.join(outDir, `${target}.jpg`);
  await mkdir(path.dirname(outFile), { recursive: true });

  const resized = pipeline.resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true });
  const info = await resized.clone().jpeg({ quality: 84, mozjpeg: true }).toFile(outFile);
  const blur = await resized.clone().resize(16).jpeg({ quality: 50 }).toBuffer();

  entries.push({
    key,
    src: `/images/${target}.jpg`,
    width: info.width,
    height: info.height,
    alt,
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
  });
  console.log(`${source} → ${target}.jpg (${info.width}×${info.height}, ${Math.round(info.size / 1024)} kB)`);
}

const body = entries
  .map(
    (e) =>
      `  ${e.key}: {\n    src: ${JSON.stringify(e.src)},\n    width: ${e.width},\n    height: ${e.height},\n    alt: ${JSON.stringify(e.alt)},\n    blurDataURL:\n      ${JSON.stringify(e.blurDataURL)},\n  },`,
  )
  .join("\n");

await writeFile(
  path.join(root, "content", "images.generated.ts"),
  `// Gegenereerd door scripts/migrate-images.mjs. Niet met de hand aanpassen:\n// wijzig de lijst in het script en draai het opnieuw.\n\nexport interface SiteImage {\n  src: string;\n  width: number;\n  height: number;\n  alt: string;\n  blurDataURL: string;\n}\n\nexport const images = {\n${body}\n} satisfies Record<string, SiteImage>;\n\nexport type ImageKey = keyof typeof images;\n`,
);
console.log(`\n${entries.length} foto's verwerkt.`);
