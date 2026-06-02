export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: '~/tailwind.config.ts',
    exposeConfig: true,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: '',
    },
  },

  nitro: {
    preset: 'cloudflare-pages',
    compatibilityDate: '2026-05-28',
  },

  app: {
    head: {
      title: 'TutaSnack - Sales Tracker',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#000000' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'TutaSnack' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/img/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
      ],
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  compatibilityDate: '2026-05-28',
})
