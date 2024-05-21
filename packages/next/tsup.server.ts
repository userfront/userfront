import { defineConfig } from "tsup";
import defaults from "./tsup.config"

export default defineConfig({
  ...defaults,
  clean: false,
  entry: ["src/server.ts"],
  format: [
    "esm",
    "cjs"
  ],
  banner: {
    js: `"use server";`
  },
  platform: "node"
});
