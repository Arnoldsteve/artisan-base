import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      Feature yet to be implememnted{" "}
    </Suspense>
  );
}
