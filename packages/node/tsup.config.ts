import { defineConfig } from "tsup";
import { isProduction } from '../utils'

export default defineConfig({
  clean: true,
  dts: true,
  shims: false,
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  minify: isProduction,
  minifyWhitespace: isProduction,
  minifyIdentifiers: isProduction,
  minifySyntax: isProduction,
  platform: "node",
  splitting: false,
  sourcemap: process.env.NODE_ENV === "development" ? "inline" : false,
});
