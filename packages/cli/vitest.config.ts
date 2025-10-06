import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.ts"],
    exclude: ["tests/**/*.d.ts"],
  },
});