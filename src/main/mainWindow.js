import BrowserWinHandler from './BrowserWinHandler'

const winHandler = new BrowserWinHandler({
  height: 700,
  width: 720,
  minWidth: 720,
  autoHideMenuBar: true,
  titleBarStyle: 'hidden',
  titleBarOverlay: {
    color: '#1C1B1F',
    symbolColor: '#8867c0'
  }
})

winHandler.onCreated(_browserWindow => {
  winHandler.loadPage('/')
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

export default winHandler
