// /components/Analytics.tsx
"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { Consent, getConsentFromDocument } from "@/lib/cookie";

type Props = { initialConsent: Consent | null };

export default function Analytics({ initialConsent }: Props) {
  const [consent, setConsent] = useState<Consent | null>(initialConsent);

  useEffect(() => {
    if (!consent) {
      const c = getConsentFromDocument();
      if (c) setConsent(c);
    }

    function onConsent(e: Event) {
      // @ts-ignore
      const detail = (e as CustomEvent)?.detail;
      if (detail) setConsent(detail);
      else {
        const c = getConsentFromDocument();
        if (c) setConsent(c);
      }
    }

    window.addEventListener("cookie-consent", onConsent as EventListener);
    return () => window.removeEventListener("cookie-consent", onConsent as EventListener);
  }, [consent]);

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!consent?.analytics || !gaId) return null;

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
