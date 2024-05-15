import { defineConfig } from "tsup";

export default defineConfig({
  clean: true, // process.env.NODE_ENV === "production",
  dts: true,
  shims: true,
  entry: ["src"],
  // noExternal: ["js-cookie", "@userfront/react"],
  format: ["cjs"],
  minify: process.env.NODE_ENV === "production",
  platform: "neutral",
  replaceNodeEnv: true,
  sourcemap: process.env.NODE_ENV === "development" ? "inline" : false,
});
