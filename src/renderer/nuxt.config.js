/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */


module.exports = {
  env: {
    version: "2.2.0",
    scrcpyPath: "resources/scrcpy/",
    releasesUrl: "https://api.github.com/repos/Frontesque/scrcpy-plus/releases",
    devicePollRate: 1250,
  },
  components: true,
  plugins: ['~/plugins/execute.js','~/plugins/utils.js','~/plugins/fileManager.js', '~/plugins/mirror.js'],


  ssr: false,
  target: 'static',
  head: {
    title: 'SCRCPY+',
    meta: [{ charset: "utf-8" }]
  },
  loading: false,
  buildModules: [],
  modules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/axios'
  ],
  vuetify: {
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#8867c0',
          accent: '#999',
          
          secondary: '#b0bec5',
          error: '#b71c1c',
        },
      },
    }
  }
};
