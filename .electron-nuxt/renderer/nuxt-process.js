const { Nuxt, Builder, Generator } = require('nuxt')
const { SERVER_PORT } = require('../config')
const nuxtConfig = require('./nuxt.config.js')

const nuxt = new Nuxt(nuxtConfig)

process.on('message', async ({ action, target }) => {
  if (action !== 'build') {
    console.warn('Unknown action')
    process.send({ status: 'error', err: `Nuxt process: unknown action ('${action}')` })
    return
  }

  await nuxt.ready()

  // https://github.com/nuxt/nuxt.js/blob/dev/packages/builder/src/builder.js
  const builder = new Builder(nuxt)

  // https://github.com/nuxt/nuxt.js/blob/dev/packages/generator/src/generator.js
  const generator = new Generator(nuxt, builder)

  if (target === 'development') {
    builder.build().then(() => {
      nuxt.listen(SERVER_PORT)
      process.send({ status: 'ok' })
    }).catch(err => {
      console.error(err)
      process.send({ status: 'error', err: err.message })
    })
  } else {
    generator.generate({ build: true, init: true }).then(({ errors }) => {
      if (errors.length === 0) process.send({ status: 'ok' })
      else process.send({ status: 'error', err: 'Error occurred while generating pages' })
    }).catch(err => {
      console.error(err)
      process.send({ status: 'error', err: err.message })
    })
  }
})
