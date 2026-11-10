/** Voegt klassenamen samen en slaat lege waarden over. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mailHref(email: string): string {
  return `mailto:${email}`;
}

export function whatsappHref(number: string): string {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}

/**
 * Zet een titel om naar kleine letters voor gebruik midden in een zin,
 * maar laat merknamen in hoofdletters staan: "VELUX dakramen" blijft "VELUX dakramen".
 */
export function inSentence(title: string): string {
  return title
    .split(" ")
    .map((word) => (word.length > 1 && word === word.toUpperCase() ? word : word.toLowerCase()))
    .join(" ");
}
