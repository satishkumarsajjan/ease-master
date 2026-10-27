import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: [
      "node_modules",
      ".next",
      ".kilo/**",
      "e2e/**",
      "registry/strings/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["components/**", "hooks/**", "lib/**", "registry/index.ts"],
      exclude: ["**/*.d.ts", "components/mdx/**"],
    },
  },
})
