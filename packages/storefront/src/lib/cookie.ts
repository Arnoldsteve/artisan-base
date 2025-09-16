// /lib/cookie.ts
export type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

export const COOKIE_NAME = "cookie_consent";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export function serializeConsent(c: Consent) {
  return encodeURIComponent(JSON.stringify(c));
}

export function parseConsent(raw: string | null | undefined): Consent | null {
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

/** Client-only: set cookie string on document.cookie */
export function setConsentCookie(consent: Consent) {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  const cookie = `${COOKIE_NAME}=${serializeConsent(consent)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  document.cookie = cookie;
}

/** Client-only: read cookie from document.cookie */
export function getConsentFromDocument(): Consent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  const raw = match.split("=")[1];
  return parseConsent(raw);
}
