import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { routing } from "./routing";

type SupportedLocale = (typeof routing.locales)[number];

function isSupported(v: string | undefined): v is SupportedLocale {
  return !!v && routing.locales.includes(v as SupportedLocale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  // 1. next-intl routing (populated when middleware is integrated)
  let locale: string | undefined = await requestLocale;

  // 2. NEXT_LOCALE cookie — set by settings page on language change
  if (!isSupported(locale)) {
    const cookieStore = await cookies();
    locale = cookieStore.get("NEXT_LOCALE")?.value;
  }

  // 3. Hard default: Thai
  if (!isSupported(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
