// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: false }, // Disables Nuxt DevTools
    ssr: false, // Required for Tauri (SPA)
    modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'], // UI and Translation
    i18n: {
        vueI18n: './i18n/i18n.config.ts', // i18n config path
        strategy: 'no_prefix', // Fixed 404 in production
        defaultLocale: 'en', // Default language
        locales: [ // List of available languages
            { code: 'en', file: 'en.json' },
            { code: 'it', file: 'it.json' },
        ]
    }
})