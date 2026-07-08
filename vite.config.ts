import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: "src/renderer",
  base: "./",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@/components": resolve(__dirname, "src/renderer/components"),
      "@/hooks": resolve(__dirname, "src/renderer/hooks"),
      "@/types": resolve(__dirname, "src/renderer/types"),
      "@/utils": resolve(__dirname, "src/renderer/utils"),
      "@/shared": resolve(__dirname, "src/shared"),
    },
  },
  server: {
    port: 3000,
  },
});
