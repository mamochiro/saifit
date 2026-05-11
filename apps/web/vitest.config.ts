import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@saifit/db": path.resolve(__dirname, "../../packages/db/src/index.ts"),
      "@saifit/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
    },
  },
});
