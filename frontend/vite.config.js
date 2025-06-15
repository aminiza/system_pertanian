import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss()],
    variants: {
      extend: {
        display: ["group-focus"],
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          secure: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      },
    },
    define: {
      "process.env": {
        VITE_API_URL: JSON.stringify(env.VITE_API_URL),
        VITE_MODE: JSON.stringify(mode)
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: mode === "development",
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-router", "react-router-dom"],
            redux: ["@reduxjs/toolkit", "react-redux"],
          }
        },
      },
    }
  };
});
