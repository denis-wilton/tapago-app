import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "./",
  plugins: [react(), svgr()],
  build: {
    outDir: "www", // Onde o Vite vai gerar os arquivos
    emptyOutDir: true,
  },
  server: {
    port: 3000, // Porta para desenvolvimento
  },
});
