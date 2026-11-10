// Maakt de deelafbeeldingen (Open Graph, 1200×630) in /public/og/.
// Gebruik: npm run og
//
// Elke afbeelding is een eigen werkfoto met de paginatitel en de bedrijfsnaam erover.
// De uitvoer staat in de repo, zodat de build niet afhangt van lettertypen op de server.
// Opnieuw draaien na een nieuwe dienst, een nieuw project, een nieuwe plaats of een
// gewijzigde titel.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { site } from "../config/site";
import { images, type ImageKey } from "../content/images.generated";
import { places } from "../content/places";
import { projects } from "../content/projects";
import { getServiceDetail, services } from "../content/services";

const WIDTH = 1200;
const HEIGHT = 630;
// Draait vanuit de projectmap (npm run og).
const root = process.cwd();
const outDir = join(root, "public", "og");
mkdirSync(outDir, { recursive: true });

const escapeXml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Breekt een titel in regels van hooguit `max` tekens. */
function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && `${line} ${word}`.length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function render(key: string, imageKey: ImageKey, title: string, label: string) {
  const photo = images[imageKey];
  const lines = wrap(title, 24).slice(0, 3);
  const lineHeight = 78;
  const titleTop = HEIGHT - 110 - (lines.length - 1) * lineHeight;

  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="donker" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#14120f" stop-opacity="0.35"/>
      <stop offset="0.45" stop-color="#14120f" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#14120f" stop-opacity="0.94"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#donker)"/>
  <rect x="0" y="0" width="${WIDTH}" height="10" fill="#fe5d14"/>
  <text x="64" y="${titleTop - 92}" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" letter-spacing="4" fill="#fe5d14">${escapeXml(label.toUpperCase())}</text>
  ${lines
    .map(
      (line, index) =>
        `<text x="64" y="${titleTop + index * lineHeight}" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" fill="#ffffff">${escapeXml(line)}</text>`,
    )
    .join("\n  ")}
  <rect x="64" y="${HEIGHT - 76}" width="56" height="5" fill="#fe5d14"/>
  <text x="136" y="${HEIGHT - 60}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#f4efe9">${escapeXml(site.name)}</text>
</svg>`;

  await sharp(join(root, "public", photo.src))
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
    .composite([{ input: Buffer.from(overlay) }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(outDir, `${key}.jpg`));
  console.log(`og/${key}.jpg  (${imageKey})`);
}

const FALLBACK: ImageKey = "renovatieRijwoningen";

async function main() {
await render("standaard", "heroDakpannenLeggen", "Dakdekker voor dakrenovatie en nieuwbouw", site.tagline);

for (const slug of site.services.enabled) {
  const service = services.find((item) => item.slug === slug);
  if (!service) continue;
  await render(`dienst-${slug}`, getServiceDetail(slug).image ?? FALLBACK, service.title, "Dienst");
}

for (const project of projects) {
  await render(`project-${project.slug}`, project.cover, project.title, "Project");
}

for (const slug of site.serviceArea.places) {
  const place = places.find((item) => item.slug === slug);
  if (!place) continue;
  const local = projects.find((project) => project.placeSlug === slug);
  await render(`plaats-${slug}`, local?.cover ?? FALLBACK, `Dakdekker in ${place.name}`, "Werkgebied");
}
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
