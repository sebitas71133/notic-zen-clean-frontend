import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: { exclude: ["firebase"] },
  server: {
    host: true,
    allowedHosts: [
      "all",
      "chef-revenge-detector-based.trycloudflare.com", // 👈 esto permite cualquier túnel de Cloudflare
    ],
  },
});
