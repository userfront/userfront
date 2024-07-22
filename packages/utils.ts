export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = !isProduction;
export const isDebug = !!process.env.DEBUG || isDevelopment;
