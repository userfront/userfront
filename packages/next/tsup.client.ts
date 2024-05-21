import { defineConfig } from "tsup";
import defaults from "./tsup.config"

export default defineConfig({
  ...defaults,
  clean: true,
  entry: ["src/client.tsx"],
  format: [
    // ESM is not working due to bundled CJS dependencies
    // "esm",
    "cjs"
  ],
  banner: {
    js: `"use client";`
  },
  platform: "browser"
});
