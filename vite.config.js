
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // para acceder desde la IP como 192.168.0.109
    port: 3000
  }
});
