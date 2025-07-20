/// <reference types="vite/client" />
/// <reference types="vitest" />
/// <reference types="vitest/globals" />

interface ImportMetaEnv {
  readonly VITE_COMMIT_HASH: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_AUTHORITY: string;
  readonly VITE_REDIRECT_URI: string;
  readonly VITE_POST_LOGOUT_REDIRECT_URI: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_BACKEND_SCOPE: string;
  readonly VITE_PORTAL_SSO_ENABLED: string;
  readonly VITE_PORTAL_SSO_MOCK: string;
}

declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

interface ImportMeta {
  readonly vitest?: unknown;
}
