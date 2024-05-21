import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  shims: false,
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  minify: process.env.NODE_ENV === "production",
  platform: "node",
  splitting: false,
  sourcemap: process.env.NODE_ENV === "development" ? "inline" : false,
});
