import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "www", // Onde o Vite vai gerar os arquivos
    emptyOutDir: true,
  },
  server: {
    port: 3000, // Porta para desenvolvimento
  },
});
