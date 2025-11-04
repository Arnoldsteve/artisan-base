import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      Featire yet to be implememnted{" "}
    </Suspense>
  );
}
