import Image from "next/image";
import Link from "next/link";
import { images } from "@content/images.generated";
import { getServiceDetail, type ServiceSummary } from "@content/services";
import { Icon } from "@/components/ui/Icon";
import { formatEuro, unitLabels } from "@/lib/pricing/format";
import { getFromPrice } from "@/lib/pricing/price-list";
import { serviceHref } from "@/lib/site";
import { inSentence } from "@/lib/utils";

interface ServiceCardProps {
  service: ServiceSummary;
  /** Kopniveau, afhankelijk van de plek op de pagina. */
  headingLevel?: "h2" | "h3";
  /** Breedte van de kaart voor `next/image`; standaard drie kaarten naast elkaar op desktop. */
  sizes?: string;
}

/** Foto voor diensten die nog geen eigen foto hebben. */
const FALLBACK_IMAGE = images.renovatieRijwoningen;

/**
 * Kaart die naar een dienstpagina linkt: foto van de dienst, korte omschrijving en de
 * vanaf-prijs als die in de config staat. Een dienst zonder (bevestigde) prijs toont geen
 * bedrag. De foto is decoratief (lege alt): de titel zegt al waar de kaart over gaat.
 */
export function ServiceCard({
  service,
  headingLevel: Heading = "h3",
  sizes = "(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw",
}: ServiceCardProps) {
  const fromPrice = getFromPrice(service.slug);
  const imageKey = getServiceDetail(service.slug).image;
  const photo = imageKey ? images[imageKey] : FALLBACK_IMAGE;

  return (
    <Link
      href={serviceHref(service.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white text-ink shadow-card transition-colors hover:border-ink"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-sand-200">
        <Image
          src={photo.src}
          alt=""
          width={photo.width}
          height={photo.height}
          placeholder="blur"
          blurDataURL={photo.blurDataURL}
          sizes={sizes}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {fromPrice ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-sm font-semibold shadow-card">
            Vanaf {formatEuro(fromPrice.amount)} {unitLabels[fromPrice.unit].per}
            {fromPrice.example ? <span className="ml-1 text-xs font-normal text-muted">(voorbeeld)</span> : null}
          </span>
        ) : null}
      </div>
      <div className="flex grow flex-col p-6">
        <span aria-hidden="true" className="mb-4 block h-1 w-10 bg-brand transition-all duration-200 group-hover:w-16" />
        <Heading className="text-xl">{service.title}</Heading>
        <p className="mt-2 grow text-muted">{service.shortDescription}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-strong">
          Meer over {inSentence(service.navTitle)}
          <Icon name="arrow-right" className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
