import { fileURLToPath, URL } from "node:url";

import Layouts from "vite-plugin-vue-layouts";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), pages({ dirs: "./src/pages" }), Layouts()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
