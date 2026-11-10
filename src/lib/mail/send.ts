import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import { site } from "@config/site";

export interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}

type Provider = "smtp" | "resend" | "file";

/**
 * Welke verzendmethode actief is, volgt uit MAIL_PROVIDER.
 * Zonder instelling: in development naar een lokale map (.mail-outbox/), in productie niets
 * (verzenden mislukt dan, en de bezoeker krijgt het advies om te bellen).
 */
function getProvider(): Provider | null {
  const value = process.env.MAIL_PROVIDER;
  if (value === "smtp" || value === "resend") return value;
  if (value === "file" || (!value && process.env.NODE_ENV !== "production")) {
    return process.env.NODE_ENV === "production" ? null : "file";
  }
  return null;
}

/** Afzender. Moet een adres zijn op een domein waarvoor de mailserver mag verzenden. */
function getFrom(): string {
  return process.env.MAIL_FROM ?? `${site.shortName} <${site.contact.email}>`;
}

/** Het adres waar aanvragen binnenkomen. */
export function getCompanyRecipient(): string {
  return process.env.MAIL_TO ?? site.contact.email;
}

async function sendViaSmtp(message: MailMessage): Promise<void> {
  const port = Number(process.env.SMTP_PORT ?? 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  await transport.sendMail({ from: getFrom(), ...message });
}

async function sendViaResend(message: MailMessage): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getFrom(),
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: message.replyTo,
      attachments: message.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content.toString("base64"),
      })),
    }),
  });
  if (!response.ok) throw new Error(`Resend antwoordde met status ${response.status}`);
}

/** Alleen voor development: schrijft de mail als HTML-bestand weg om hem te kunnen bekijken. */
async function sendToFile(message: MailMessage): Promise<void> {
  const dir = path.join(process.cwd(), ".mail-outbox");
  await mkdir(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const slug = message.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
  const header = `<!-- Aan: ${message.to} | Onderwerp: ${message.subject} | Reply-To: ${message.replyTo ?? "-"} | Bijlagen: ${
    message.attachments?.map((a) => `${a.filename} (${a.content.length} bytes)`).join(", ") || "geen"
  } -->\n`;
  await writeFile(path.join(dir, `${stamp}-${slug}.html`), header + message.html, "utf8");
}

/**
 * Verstuurt een mail. Gooit een fout als verzenden niet lukt of niet is ingesteld.
 * De foutmelding bevat nooit gegevens uit het bericht zelf.
 */
export async function sendMail(message: MailMessage): Promise<void> {
  const provider = getProvider();
  if (provider === "smtp") return sendViaSmtp(message);
  if (provider === "resend") return sendViaResend(message);
  if (provider === "file") return sendToFile(message);
  throw new Error("Mail is niet ingesteld: zet MAIL_PROVIDER op smtp of resend.");
}
