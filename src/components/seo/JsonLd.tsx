/**
 * Zet structured data (JSON-LD) in de pagina. `<` wordt omgezet, zodat tekst uit de
 * content nooit de script-tag kan afsluiten.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
