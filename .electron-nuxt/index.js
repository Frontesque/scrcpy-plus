
const path = require('path')
const webpack = require('webpack')
const electron = require('electron')

const { Pipeline, Logger } = require('@xpda-dev/core')
const { ElectronLauncher } = require('@xpda-dev/electron-launcher')
const { ElectronBuilder } = require('@xpda-dev/electron-builder')
const { Webpack } = require('@xpda-dev/webpack-step')
const resourcesPath = require('./resources-path-provider')
const { DIST_DIR, MAIN_PROCESS_DIR, SERVER_HOST, SERVER_PORT } = require('./config')
const NuxtApp = require('./renderer/NuxtApp')

const isDev = process.env.NODE_ENV === 'development'

const electronLogger = new Logger('Electron', 'teal')
electronLogger.ignore(text => text.includes('nhdogjmejiglipccpnnnanhbledajbpd')) // Clear vue devtools errors

const launcher = new ElectronLauncher({
  logger: electronLogger,
  electronPath: electron,
  entryFile: path.join(DIST_DIR, 'main/index.js')
})

function hasConfigArgument (array) {
  for (const el of array) if (el === '--config' || el === '-c') return true
  return false
}
const argumentsArray = process.argv.slice(2)
if (!hasConfigArgument(argumentsArray)) argumentsArray.push('--config', 'builder.config.js')

const builder = new ElectronBuilder({
  processArgv: argumentsArray
})

const webpackConfig = Webpack.getBaseConfig({
  entry: isDev
    ? path.join(MAIN_PROCESS_DIR, 'boot/index.dev.js')
    : path.join(MAIN_PROCESS_DIR, 'boot/index.prod.js'),
  output: {
    filename: 'index.js',
    path: path.join(DIST_DIR, 'main')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.resourcesPath': resourcesPath.mainProcess(),
      'process.env.DEV_SERVER_URL': `'${SERVER_HOST}:${SERVER_PORT}'`
    })
  ]
})

const webpackMain = new Webpack({
  logger: new Logger('Main', 'olive'),
  webpackConfig,
  launcher // need to restart launcher after compilation
})

const nuxt = new NuxtApp(new Logger('Nuxt', 'green'))

const pipe = new Pipeline({
  title: 'Electron-nuxt',
  isDevelopment: isDev,
  steps: [webpackMain, nuxt],
  launcher,
  builder
})

pipe.run()
