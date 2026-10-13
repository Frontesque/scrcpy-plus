// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2026-10-13',
    devtools: { enabled: false },
    ssr: false,
    modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
    i18n: {
        vueI18n: 'i18n.config.ts',
        defaultLocale: 'en',
        strategy: 'no_prefix',
        detectBrowserLanguage: false,
        locales: [
            { code: 'en', file: 'en.json' },
            { code: 'it', file: 'it.json' },
            { code: 'ja', file: 'ja.json' },
        ]
    }
})