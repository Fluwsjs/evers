import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, isRateLimited } from "@/lib/security/spam";

export const runtime = "nodejs";

const inputSchema = z.object({
  postcode: z
    .string()
    .trim()
    .regex(/^[1-9]\d{3}\s?[A-Za-z]{2}$/),
  houseNumber: z
    .string()
    .trim()
    .regex(/^\d{1,5}/),
});

/**
 * Zoekt straat en plaats bij een postcode en huisnummer via de PDOK Locatieserver
 * (gratis dienst van de Nederlandse overheid, geen sleutel nodig).
 *
 * POST in plaats van GET, zodat het adres niet in URL's en serverlogs terechtkomt.
 * Lukt het opzoeken niet, dan vult de bezoeker straat en plaats gewoon zelf in.
 */
export async function POST(request: Request) {
  if (isRateLimited(`postcode:${clientIp(request)}`, 30)) {
    return NextResponse.json({ found: false }, { status: 429 });
  }

  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ found: false }, { status: 400 });

  const postcode = parsed.data.postcode.replace(/\s/g, "").toUpperCase();
  const houseNumber = parsed.data.houseNumber.match(/^\d{1,5}/)?.[0] ?? "";

  const url = new URL("https://api.pdok.nl/bzk/locatieserver/search/v3_1/free");
  url.searchParams.set("q", `postcode:${postcode} AND huisnummer:${houseNumber}`);
  url.searchParams.set("fq", "type:adres");
  url.searchParams.set("fl", "straatnaam,woonplaatsnaam");
  url.searchParams.set("rows", "1");

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(4000), cache: "no-store" });
    if (!response.ok) return NextResponse.json({ found: false });

    const data = (await response.json()) as {
      response?: { docs?: Array<{ straatnaam?: string; woonplaatsnaam?: string }> };
    };
    const match = data.response?.docs?.[0];
    if (!match?.woonplaatsnaam) return NextResponse.json({ found: false });

    return NextResponse.json({ found: true, street: match.straatnaam ?? "", city: match.woonplaatsnaam });
  } catch {
    return NextResponse.json({ found: false });
  }
}
