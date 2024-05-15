import { defineConfig } from "tsup";

export default defineConfig({
  clean: true, // process.env.NODE_ENV === "production",
  dts: true,
  shims: true,
  entry: ["src/index.tsx"],
  // external: ["react"],
  // noExternal: ["js-cookie", "@userfront/core", "@userfront/toolkit"],
  format: ["cjs"],
  minify: process.env.NODE_ENV === "production",
  platform: "browser",
  replaceNodeEnv: true,
  sourcemap: process.env.NODE_ENV === "development" ? "inline" : false,
});
