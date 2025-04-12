import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  alias: {
    '@': './',
  },
  css: [
    'flowbite/dist/flowbite.min.css',
  ],
  modules: [
    '@pinia/nuxt',
  ],
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.css',
      },
    ],
    script: [
      {
        src: 'https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js',
        type: 'text/javascript',
        body: true,
      },
    ],
  },
  runtimeConfig: {
    public: {
      baseURL: 'http://localhost:8000/api',
    },
  },
  plugins: [
    { src: '~/plugins/pinia-plugin-persistedstate.client.ts', mode: 'client' },
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
});
