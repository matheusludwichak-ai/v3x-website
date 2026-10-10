/** Single source of truth for the public contact channels. */
export const CONTACT_EMAIL = "contato@grupov3x.com.br";
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

/** WhatsApp number in international format, digits only (55 + DDD + number). Empty string disables every WhatsApp link. */
export const WHATSAPP_NUMBER = "5547988128598";
export const WHATSAPP_DISPLAY = "(47) 98812-8598";
export const WHATSAPP_MESSAGE = "Olá! Conheci a V3X pelo site e gostaria de conversar sobre um projeto digital.";

export function whatsappHref(message: string = WHATSAPP_MESSAGE): string | null {
  if (!/^\d{12,13}$/.test(WHATSAPP_NUMBER)) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
