import type {Options} from "tsup";

export default {
  dts: true,
  shims: false,
  minify: process.env.NODE_ENV === "production",
  splitting: false,
  sourcemap: process.env.NODE_ENV === "development" ? "inline" : false,
  noExternal: ["@userfront/node", "@userfront/react"],
} as Options;
