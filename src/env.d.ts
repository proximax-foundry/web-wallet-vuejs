/// <reference types="vite/client" />

declare const BUILD_YEAR: string;

interface ImportMetaEnv {
    readonly BASE_URL: string
    readonly NODE_ENV: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }