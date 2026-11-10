import { site } from "@config/site";
import { Container } from "@/components/ui/Container";
import { GoogleScore } from "@/components/ui/GoogleScore";
import { Icon } from "@/components/ui/Icon";
import { mailHref, telHref } from "@/lib/utils";

/**
 * Balk boven de header: spoedbereikbaarheid (als actief), Google-score (als bekend),
 * telefoon en e-mail. Op mobiel blijven alleen de eerste melding en het telefoonnummer over.
 */
export function TopBar() {
  const { contact, emergency, tagline } = site;

  return (
    <div className="on-dark bg-ink text-sm text-on-dark">
      <Container className="flex min-h-10 items-center justify-between gap-4 py-1.5">
        <p className="flex items-center gap-2 font-medium">
          {emergency.enabled ? (
            <>
              <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
              {emergency.label}
            </>
          ) : (
            tagline
          )}
        </p>

        <div className="flex items-center gap-x-6">
          <GoogleScore compact className="hidden md:inline-flex" />
          <a
            href={mailHref(contact.email)}
            className="hidden items-center gap-2 underline-offset-4 hover:underline lg:inline-flex"
          >
            <Icon name="mail" className="size-4 text-brand" />
            {contact.email}
          </a>
          <a
            href={telHref(contact.phone)}
            className="inline-flex items-center gap-2 font-semibold whitespace-nowrap underline-offset-4 hover:underline"
          >
            <Icon name="phone" className="size-4 text-brand" />
            {contact.phoneDisplay}
          </a>
        </div>
      </Container>
    </div>
  );
}
