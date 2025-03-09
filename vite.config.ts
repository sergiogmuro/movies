import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 🔹 Proxy para evitar problemas con CORS
export default defineConfig({
  plugins: [react()],
  base: "./", // para deploy
  server: {
    proxy: {
      "/movies": {
        target: "http://localhost:3001", // 👈 Redirige las peticiones al backend
        changeOrigin: true,
        secure: false,
      }
    },
  },
  build: {
    outDir: "dist", // Asegúrate de que la salida de la construcción esté en el directorio correcto
    assetsDir: 'assets', // Carpeta donde se guardan los archivos estáticos
    sourcemap: false, // Si no necesitas el sourcemap
    rollupOptions: {
      output: {
        // Asegúrate de que los archivos de la build se generen correctamente
      },
    },
  },
});
