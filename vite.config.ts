import { fileURLToPath, URL } from "node:url";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  let publicPath = "/";

  switch (env.VITE_NODE_ENV) {
    case "staging":
      publicPath = "/web-wallet-vuejs";
      break;
    case "production":
      publicPath = "";
      break;
    case "development":
      publicPath = "/";
      break;
    default:
      publicPath = "/"
      break;
  }
  return {
    base: publicPath,
    plugins: [
      //experimental features
      vue({
        script:{
          defineModel:true,
          propsDestructure: true
        }
      }),
      VueI18nPlugin({
        include: path.resolve(__dirname, "./src/assets/locales/**"),
      }),
      ViteYaml(),
      nodePolyfills({
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    ],
    resolve: {
      alias: {
        vue: "vue/dist/vue.esm-bundler.js",
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      chunkSizeWarningLimit: 2000, //default 500
      /* rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              const arr = id.toString().split("node_modules/")[1].split("/");
              switch (arr[0]) {
                case "@kangc":
                case "@naturefw":
                case "@popperjs":
                case "@vue":
                case "axios":
                case "element-plus":
                  return "_" + arr[0];
                default:
                  return arr[0].toString();
              }
            }
          },
          chunkFileNames: "static/js1/[name]-[hash].js",
          entryFileNames: "static/js2/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        },
      }, */
    },
  };
});
