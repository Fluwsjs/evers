import { NextResponse, type NextRequest } from "next/server";
import { resolveLegacyUrl } from "@/lib/legacy-urls";

/**
 * Vangt de adressen van de oude WordPress-site af: 301 naar de opvolger, of 410 voor
 * wat bewust weg is. De regels zelf staan in `src/lib/legacy-urls.ts`.
 */
const GONE_PAGE = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Deze pagina bestaat niet meer</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#f7f3ee;color:#14120f;line-height:1.6}main{max-width:36rem;margin:0 auto;padding:4rem 1.5rem}h1{font-size:1.75rem;line-height:1.2}a{color:#c2410c;font-weight:600}</style>
</head>
<body>
<main>
<h1>Deze pagina bestaat niet meer</h1>
<p>De pagina die u zoekt is verwijderd. Op de homepage vindt u onze diensten, projecten en contactgegevens.</p>
<p><a href="/">Naar de homepage</a></p>
</main>
</body>
</html>`;

export function proxy(request: NextRequest) {
  const result = resolveLegacyUrl(request.nextUrl.pathname);
  if (!result) return NextResponse.next();

  if (result.type === "redirect") {
    return NextResponse.redirect(new URL(result.to, request.url), 301);
  }

  return new NextResponse(GONE_PAGE, {
    status: 410,
    headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}

export const config = {
  // Niet voor de eigen bestanden van de site: die zijn nooit een oud WordPress-adres.
  matcher: ["/((?!_next/|api/|images/|og/).*)"],
};
