import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { site } from "@config/site";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { ScrollAids } from "@/components/layout/ScrollAids";
import { MAIN_CONTENT_ID, SkipLink } from "@/components/layout/SkipLink";
import { TopBar } from "@/components/layout/TopBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@/components/seo/Analytics";
import { NOINDEX, noindexSite } from "@/lib/seo";
import { businessJsonLd } from "@/lib/structured-data";
import "./globals.css";

// next/font downloadt de lettertypen tijdens de build en serveert ze vanaf het eigen domein.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", weight: ["600", "800"] });

// Basis voor alle pagina's. Titel, omschrijving, canonical en deelafbeelding zet elke pagina zelf
// via `pageMetadata` (src/lib/seo.ts).
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s | ${site.shortName}`,
  },
  formatDetection: { telephone: false },
  // Geldt voor pagina's zonder eigen metadata, zoals de 404-pagina.
  ...(noindexSite ? { robots: NOINDEX } : {}),
};

export const viewport: Viewport = {
  themeColor: "#14120f",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl" className={`${inter.variable} ${archivo.variable}`}>
      <body>
        <SkipLink />
        <TopBar />
        <Header />
        <main id={MAIN_CONTENT_ID} tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
        <ScrollAids />
        <JsonLd data={businessJsonLd()} />
        <Analytics />
      </body>
    </html>
  );
}
