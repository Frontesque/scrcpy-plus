const { RESOURCES_DIR } = require('./config')

const RESOURCES_DIR_PATH = RESOURCES_DIR.replace(/\\/g, '/')

const isProduction = process.env.NODE_ENV === 'production'

function devPath () {
  return `'${RESOURCES_DIR_PATH}'` // Overwrite path
}

function productionPath () {
  return `process.resourcesPath`; // Keep path provided by Electron
}

module.exports = {

  // MAIN PROCESS

  mainProcess () {
    return isProduction ? productionPath() : devPath()
  },

  // RENDERER PROCESS

  nuxtClient () {
    return isProduction ? productionPath() : devPath()
  },

  nuxtServer: devPath

}
