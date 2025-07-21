/// <reference types="vite/client" />
/// <reference types="vitest" />
/// <reference types="vitest/globals" />

interface ImportMetaEnv {
  readonly VITE_COMMIT_HASH: string;
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly vitest?: unknown;
}
