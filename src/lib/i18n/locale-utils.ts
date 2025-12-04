import { Locale } from "@/types/content";

/**
 * Extract locale from URL pathname
 * Supports patterns like: /en/learn/javascript or /vi/learn/react
 */
export function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment === "en" || firstSegment === "vi") {
    return firstSegment;
  }

  return null;
}

/**
 * Add locale prefix to a path
 */
export function addLocaleToPath(path: string, locale: Locale): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Remove existing locale prefix if present
  const withoutLocale = removeLocaleFromPath(cleanPath);

  return `/${locale}/${withoutLocale}`;
}

/**
 * Remove locale prefix from a path
 */
export function removeLocaleFromPath(path: string): string {
  const segments = path.split("/").filter(Boolean);

  if (segments.length > 0 && (segments[0] === "en" || segments[0] === "vi")) {
    return "/" + segments.slice(1).join("/");
  }

  return "/" + segments.join("/");
}

/**
 * Get the alternate locale
 */
export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "vi" : "en";
}

/**
 * Format locale for display
 */
export function formatLocaleDisplay(locale: Locale): string {
  return locale === "en" ? "English" : "Tiếng Việt";
}

/**
 * Get locale flag emoji
 */
export function getLocaleFlag(locale: Locale): string {
  return locale === "en" ? "🇬🇧" : "🇻🇳";
}
