

export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
export const isDebug = !!process.env.DEBUG || isDevelopment;

export const USERFRONT_API_KEY = process.env.USERFRONT_API_KEY ?? "";
export const USERFRONT_API_URL = process.env.USERFRONT_API_URL ?? "https://api.userfront.com";
export const USERFRONT_API_VERSION = process.env.USERFRONT_API_VERSION ?? "v0";
export const USERFRONT_WORKSPACE_ID = process.env.USERFRONT_WORKSPACE_ID ?? "";
