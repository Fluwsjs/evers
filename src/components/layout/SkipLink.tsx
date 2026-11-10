export const MAIN_CONTENT_ID = "inhoud";

export function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:bg-ink focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
    >
      Direct naar de inhoud
    </a>
  );
}
