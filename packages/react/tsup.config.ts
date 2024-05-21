import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  shims: false,
  entry: ["src/index.tsx"],
  format: ["esm", "cjs"],
  minify: process.env.NODE_ENV === "production",
  platform: "browser",
  splitting: false,
  sourcemap: process.env.NODE_ENV === "development" ? "inline" : false,
  noExternal: ["@userfront/core", "@userfront/toolkit"],
});
