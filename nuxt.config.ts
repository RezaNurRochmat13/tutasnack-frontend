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

  nitro: {
    preset: 'cloudflare-pages',
    compatibilityDate: '2026-05-28',
  },

  app: {
    head: {
      title: 'TutaSnack - Sales Tracker',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  compatibilityDate: '2026-05-28',
})
