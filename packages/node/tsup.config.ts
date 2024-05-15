import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  clean: process.env.NODE_ENV === "production",
  dts: false, // for DX performance
  entry: ["src"],
  format: ["esm", "cjs"],
  minify: process.env.NODE_ENV === "production",
  platform: "neutral",
  replaceNodeEnv: true,
  sourcemap: process.env.NODE_ENV === "development",
  splitting: true,
  ...options,
}));
