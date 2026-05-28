import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const SUPPORTED_LOCALES = ['en', 'ru'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const RU_LOCALES = ['ru', 'be', 'kk', 'uk', 'ky', 'tg', 'uz', 'az', 'hy'];
const RU_COUNTRIES = ['RU', 'BY', 'KZ', 'KG', 'UZ', 'TJ', 'AM', 'AZ', 'TM', 'MD', 'UA'];

async function detectLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const stored = cookieStore.get('krea_locale')?.value;
  if (stored === 'ru' || stored === 'en') return stored;

  const h = await headers();
  // Vercel / Cloudflare set this; fall back to Accept-Language
  const country =
    h.get('x-vercel-ip-country') ||
    h.get('cf-ipcountry') ||
    h.get('x-country-code') ||
    '';
  if (country && RU_COUNTRIES.includes(country.toUpperCase())) return 'ru';

  const accept = (h.get('accept-language') || '').toLowerCase();
  for (const code of RU_LOCALES) {
    if (accept.startsWith(code) || accept.includes(`,${code}`) || accept.includes(` ${code}`)) {
      return 'ru';
    }
  }
  return 'en';
}

export default getRequestConfig(async () => {
  const locale = await detectLocale();
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
