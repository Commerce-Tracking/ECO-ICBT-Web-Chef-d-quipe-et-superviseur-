import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "icons/*.png"],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 Mo par exemple

      },
      manifest: {
        name: "My PWA App",
        short_name: "PWAApp",
        description: "Une PWA avec React et Vite",
        theme_color: "#3498db",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      // Proxy pour les appels vers ton
      // API distante
      "/api": {
        target: "https://gateway-api.dev.freetrade-ofr.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // enlève le préfixe /api
      },
    },
  },
});
