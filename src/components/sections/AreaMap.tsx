import type { Place } from "@content/places";
import { placeHref } from "@/lib/site";

const WIDTH = 640;
const HEIGHT = 440;
const PADDING = 90;

/**
 * Schematische kaart van het werkgebied: de plaatsen op hun onderlinge positie.
 *
 * Bewust een eigen SVG in plaats van een ingesloten kaartdienst: geen cookies, geen
 * verzoeken naar derden en geen extra laadtijd. De posities volgen uit de coördinaten
 * in /content/places.ts; het is een overzicht, geen routekaart.
 */
export function AreaMap({ places }: { places: Place[] }) {
  if (places.length === 0) return null;

  const lats = places.map((place) => place.lat);
  const lons = places.map((place) => place.lon);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  // Eén graad lengte is op deze breedtegraad korter dan één graad breedte.
  const lonFactor = Math.cos((midLat * Math.PI) / 180);

  const spanX = Math.max((Math.max(...lons) - Math.min(...lons)) * lonFactor, 0.05);
  const spanY = Math.max(Math.max(...lats) - Math.min(...lats), 0.05);
  const scale = Math.min((WIDTH - 2 * PADDING) / spanX, (HEIGHT - 2 * PADDING) / spanY);
  const offsetX = (WIDTH - spanX * scale) / 2;
  const offsetY = (HEIGHT - spanY * scale) / 2;

  const points = places.map((place) => ({
    place,
    x: offsetX + (place.lon - Math.min(...lons)) * lonFactor * scale,
    y: offsetY + (Math.max(...lats) - place.lat) * scale,
  }));

  return (
    <figure>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-labelledby="kaart-titel kaart-omschrijving"
        className="w-full rounded-card border border-line bg-sand"
      >
        <title id="kaart-titel">Schematische kaart van het werkgebied</title>
        <desc id="kaart-omschrijving">
          {`De plaatsen ${places.map((place) => place.name).join(", ")} op hun onderlinge ligging.`}
        </desc>

        {/* Raster als rustige achtergrond */}
        <defs>
          <pattern id="kaart-raster" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="var(--color-line)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="url(#kaart-raster)" />

        {/* Verbindingslijnen tussen de plaatsen */}
        {points.length > 1 ? (
          <polygon
            points={points.map((point) => `${point.x},${point.y}`).join(" ")}
            fill="var(--color-brand)"
            fillOpacity="0.08"
            stroke="var(--color-brand-strong)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
        ) : null}

        {points.map(({ place, x, y }) => (
          <a key={place.slug} href={placeHref(place.slug)} aria-label={`Dakdekker ${place.name}`}>
            <circle cx={x} cy={y} r="22" fill="var(--color-brand)" fillOpacity="0.2" />
            <circle cx={x} cy={y} r="9" fill="var(--color-brand-strong)" stroke="white" strokeWidth="3" />
            <text
              x={x}
              y={y - 32}
              textAnchor="middle"
              fill="var(--color-ink)"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22 }}
            >
              {place.name}
            </text>
          </a>
        ))}

        {/* Noordpijl */}
        <g transform={`translate(${WIDTH - 44} 44)`} fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round">
          <path d="M0 16V-12M-7 -4 0 -12 7 -4" />
          <text y="34" textAnchor="middle" stroke="none" fill="var(--color-ink)" style={{ fontSize: 14, fontWeight: 600 }}>
            N
          </text>
        </g>
      </svg>
      <figcaption className="mt-3 text-sm text-muted">
        Schematische kaart: de plaatsen staan op hun onderlinge ligging. Klik op een plaats voor meer informatie.
      </figcaption>
    </figure>
  );
}
