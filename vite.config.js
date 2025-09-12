import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: { exclude: ["firebase"] },
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      "all",
      "adaptation-consist-afternoon-carolina.trycloudflare.com", // 👈 esto permite cualquier túnel de Cloudflare
    ],
  },
});
