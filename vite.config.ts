import { fileURLToPath, URL } from "node:url";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  let publicPath = '/';

  switch (env.NODE_ENV) {
    case 'staging':
      publicPath = '/web-wallet-vuejs'
      break;
    case 'production':
      publicPath = ''
      break;
    case 'development':
      publicPath = '/'
      break;
  }
  return {
    base:  publicPath,
    plugins: [
      vue(),
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
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

  }
})



