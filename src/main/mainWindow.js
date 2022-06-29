import BrowserWinHandler from './BrowserWinHandler'

const winHandler = new BrowserWinHandler({
  height: 700,
  width: 600,
  minWidth: 300,
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
