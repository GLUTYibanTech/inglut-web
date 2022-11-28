import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// FILE: vite.config.js

import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),

    quasar({
      sassVariables: "src/quasar-variables.sass",
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    // port: 9090,
    host: "0.0.0.0",

    open: true,

    proxy: {
      "/webapi": {
        // target: "https://yiban.glut.edu.cn/",
        target: "http://127.0.0.1:8000/",
        rewrite: (path) => path.replace(/^\/webapi/, ""),

        changeOrigin: true,

        // ws: false,
      },
      "/chatHub": {
        // target: "https://yiban.glut.edu.cn/",
        target: "ws://127.0.0.1:8000/",
        ws: true,

        // ws: false,
      },
    },
  },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     // Node.js global to browser globalThis
  //     define: {
  //       global: "globalThis",
  //     },
  //     // Enable esbuild polyfill plugins
  //     plugins: [
  //       NodeGlobalsPolyfillPlugin({
  //         buffer: true,
  //       }),
  //     ],
  //   },
  // },
});
