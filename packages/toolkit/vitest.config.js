import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

/*
  This is for project-level options during testing.

  Vitest will read config from this file instead of vite.config.js.
*/

// https://vitejs.dev/config/
export default defineConfig({
  // Tests need the React plugin to run correctly, while the library relies
  // on the host application to provide React.
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@test": resolve(__dirname, "test"),
    },
  },
  test: {
    includeSource: ["src/**/*.{js,jsx,ts,tsx}"],
    coverage: {
      reporter: ["text", "json-summary", "json"],
    },
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
  },
});
