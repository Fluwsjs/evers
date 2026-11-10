import Link from "next/link";
import { site } from "@config/site";
import { Icon } from "@/components/ui/Icon";
import { routes } from "@/lib/site";
import { telHref, whatsappHref } from "@/lib/utils";

const itemClasses = "flex min-h-16 flex-1 flex-col items-center justify-center gap-1 text-sm font-semibold";

/**
 * Vaste actiebalk onderaan op mobiel: bellen, offerte en (als actief) WhatsApp.
 * Staat in de DOM ná de footer, zodat de leesvolgorde logisch blijft.
 */
export function MobileActionBar() {
  const { contact, features } = site;
  const showWhatsapp = features.whatsapp && contact.whatsapp !== null;

  return (
    <nav
      aria-label="Snel contact"
      className="on-dark fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-ink pb-[env(safe-area-inset-bottom)] text-white md:hidden"
    >
      <ul className="flex divide-x divide-white/15">
        <li className="flex flex-1">
          <a href={telHref(contact.phone)} className={itemClasses}>
            <Icon name="phone" className="text-brand" />
            Bellen
          </a>
        </li>
        <li className="flex flex-[1.3]">
          <Link href={routes.quote} className={`${itemClasses} bg-brand text-ink`}>
            <Icon name="document" />
            Offerte
          </Link>
        </li>
        {showWhatsapp && contact.whatsapp ? (
          <li className="flex flex-1">
            <a
              href={whatsappHref(contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className={itemClasses}
            >
              <Icon name="chat" className="text-brand" />
              WhatsApp
              <span className="sr-only">(opent in een nieuw tabblad)</span>
            </a>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
