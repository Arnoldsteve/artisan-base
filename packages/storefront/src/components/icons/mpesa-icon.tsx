// src/components/icons/MpesaIcon.tsx
import React from "react";

export const MpesaIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    fill="none"
    {...props}
  >
    {/* Background M */}
    <path
      d="M10 12h6l4 10 4-10h6v24h-6V20l-4 10h-0.1L16 20v16h-6V12z"
      fill="#34B233" // Safaricom green
    />
    {/* The red "P" phone sim stylization */}
    <path
      d="M30 12h5c4 0 7 3 7 7s-3 7-7 7h-2v10h-6V12zm5 10c1.3 0 2-0.9 2-2s-0.7-2-2-2h-2v4h2z"
      fill="#EA1E25" // Safaricom red
    />
  </svg>
);
