/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly BASE_URL: string
    readonly NODE_ENV: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }