/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly RESEND_API_KEY: string;
  readonly MEMORY_EMAIL_TO: string;
  readonly MEMORY_EMAIL_FROM: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}