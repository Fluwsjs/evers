import Link from "next/link";
import { site } from "@config/site";
import { ClientTodo } from "@/components/ui/ClientTodo";
import { Container } from "@/components/ui/Container";
import { GoogleScore } from "@/components/ui/GoogleScore";
import { Icon } from "@/components/ui/Icon";
import { getActiveServices, routes, serviceHref } from "@/lib/site";
import { mailHref, telHref, whatsappHref } from "@/lib/utils";
import { CurrentYear } from "./CurrentYear";
import { Logo } from "./Logo";

const companyLinks = [
  { label: "Over ons", href: routes.about },
  { label: "Projecten", href: routes.projects },
  { label: "Prijzen", href: routes.prices },
  { label: "Werkgebied", href: routes.serviceArea },
  { label: "Veelgestelde vragen", href: routes.faq },
  { label: "Contact", href: routes.contact },
];

const linkClasses = "inline-flex min-h-9 items-center text-on-dark-muted underline-offset-4 hover:text-white hover:underline";

function FooterHeading({ children }: { children: string }) {
  return <h2 className="font-display text-base font-extrabold tracking-wide text-white">{children}</h2>;
}

export function Footer() {
  const { address, contact, registration, openingHours, socials, features } = site;
  const services = getActiveServices();
  const socialLinks = [
    { label: "Facebook", href: socials.facebook },
    { label: "Instagram", href: socials.instagram },
    { label: "LinkedIn", href: socials.linkedin },
  ].filter((social): social is { label: string; href: string } => social.href !== null);

  return (
    <footer className="on-dark bg-ink text-on-dark">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Link href="/" aria-label={`${site.name}, naar de homepage`} className="inline-block rounded-md">
            <Logo onDark />
          </Link>
          <p className="mt-5 max-w-xs text-on-dark-muted">
            {site.shortName}: {site.tagline.charAt(0).toLowerCase() + site.tagline.slice(1)}.
          </p>
          <GoogleScore className="mt-5" />
          {socialLinks.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-x-5">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                    {social.label}
                    <span className="sr-only"> (opent in een nieuw tabblad)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-label="Diensten in de footer">
          <FooterHeading>Diensten</FooterHeading>
          <ul className="mt-4">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={serviceHref(service.slug)} className={linkClasses}>
                  {service.navTitle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Bedrijfsinformatie in de footer">
          <FooterHeading>Bedrijf</FooterHeading>
          <ul className="mt-4">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClasses}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <FooterHeading>Contact</FooterHeading>
          <address className="mt-4 space-y-3 not-italic">
            <p className="font-semibold text-white">{site.legalName ?? site.name}</p>

            {address.confirmed && address.street && address.city ? (
              <p className="flex gap-3 text-on-dark-muted">
                <Icon name="pin" className="mt-0.5 text-brand" />
                <span>
                  {address.street}
                  <br />
                  {[address.postalCode, address.city].filter(Boolean).join(" ")}
                </span>
              </p>
            ) : (
              <p>
                <ClientTodo>adres bevestigen</ClientTodo>
              </p>
            )}

            <p>
              <a href={telHref(contact.phone)} className="inline-flex min-h-9 items-center gap-3 font-semibold text-white underline-offset-4 hover:underline">
                <Icon name="phone" className="text-brand" />
                {contact.phoneDisplay}
              </a>
              <br />
              <a href={mailHref(contact.email)} className="inline-flex min-h-9 items-center gap-3 wrap-anywhere text-on-dark-muted underline-offset-4 hover:text-white hover:underline">
                <Icon name="mail" className="text-brand" />
                {contact.email}
              </a>
              {features.whatsapp && contact.whatsapp ? (
                <>
                  <br />
                  <a
                    href={whatsappHref(contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-3 text-on-dark-muted underline-offset-4 hover:text-white hover:underline"
                  >
                    <Icon name="chat" className="text-brand" />
                    WhatsApp
                    <span className="sr-only"> (opent in een nieuw tabblad)</span>
                  </a>
                </>
              ) : null}
            </p>
          </address>

          <div className="mt-6">
            <h3 className="font-sans text-sm font-semibold tracking-normal text-white">Openingstijden</h3>
            {openingHours ? (
              <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-on-dark-muted">
                {openingHours.map((entry) => (
                  <div key={entry.label} className="contents">
                    <dt>{entry.label}</dt>
                    <dd>{entry.opens && entry.closes ? `${entry.opens} – ${entry.closes}` : "Gesloten"}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-2">
                <ClientTodo>openingstijden</ClientTodo>
              </p>
            )}
          </div>

          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-on-dark-muted">
            <dt>KvK</dt>
            <dd>{registration.kvk ?? <ClientTodo>KvK-nummer</ClientTodo>}</dd>
            <dt>Btw</dt>
            <dd>{registration.vat ?? <ClientTodo>btw-nummer</ClientTodo>}</dd>
          </dl>
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-col gap-3 py-6 text-sm text-on-dark-muted md:flex-row md:items-center md:justify-between">
          <p>
            © <CurrentYear buildYear={new Date().getFullYear()} /> {site.name}
          </p>
          <ul className="flex flex-wrap gap-x-6">
            <li>
              <Link href={routes.privacy} className={linkClasses}>
                Privacyverklaring
              </Link>
            </li>
            <li>
              <Link href={routes.terms} className={linkClasses}>
                Algemene voorwaarden
              </Link>
            </li>
            <li>
              <a href="/sitemap.xml" className={linkClasses}>
                Sitemap
              </a>
            </li>
            <li>
              <a href="/llms.txt" className={linkClasses}>
                llms.txt
              </a>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
