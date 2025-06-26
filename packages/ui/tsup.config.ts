import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],      // The entry point of our library
  format: ["esm"],              // Output ESM for modern bundlers like Next.js
  dts: true,                    // Generate declaration files (.d.ts)
  sourcemap: true,
  clean: true,                  // Clean the dist folder before building
  external: ["react"],          // Don't bundle React, the consuming app will provide it
});