/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */


module.exports = {
  env: {
    version: "1.1.1",
    scrcpyVersion: "1.23",
    adbVersion: "31.0.3-7562133",
    scrcpyPath: "src/extraResources/scrcpy/", //Development
    //scrcpyPath: "resources/scrcpy/", //Production

    devicePollRate: 1250,
  },
  components: true,

  ssr: false,
  target: 'static',
  head: {
    title: 'SCRCPY+',
    meta: [{ charset: "utf-8" }]
  },
  loading: false,
  plugins: ['~/plugins/execute.js','~/plugins/utils.js'],
  buildModules: [],
  modules: [
    '@nuxtjs/vuetify',
  ],
  vuetify: {
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#8867c0',
          secondary: '#b0bec5',
          accent: '#8c9eff',
          error: '#b71c1c',
        },
      },
    }
  }
};
