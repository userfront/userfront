import type {Options} from "tsup";
import { isProduction } from '../utils'

export default {
  dts: true,
  shims: false,
  minify: isProduction,
  minifyWhitespace: isProduction,
  minifyIdentifiers: isProduction,
  minifySyntax: isProduction,
  splitting: false,
  sourcemap: process.env.NODE_ENV === "development" ? "inline" : false,
  noExternal: ["@userfront/node", "@userfront/react"],
} as Options;
