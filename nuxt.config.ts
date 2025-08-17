export default defineNuxtConfig({
  compatibilityDate: '2025-07-27',
  app: {
    head: {
      title: 'Berkah Laris - Solusi Elektronik Terpercaya',
      htmlAttrs: {
        lang: 'id'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Berkah Laris - Menjual barang elektronik baru & bekas berkualitas serta layanan servis profesional'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
        }
      ]
    }
  },

  css: [
    '~/assets/css/tailwind.css',
    '@fortawesome/fontawesome-free/css/all.min.css'
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || 'http://localhost:8000/api',
      midtransClientKey: process.env.MIDTRANS_CLIENT_KEY || 'Mid-client-24PEmc-anspQS7Rn'
    }
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  },

  devtools: {
    enabled: true
  }
})
