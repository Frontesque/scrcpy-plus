const module = {
  openInternal(url) {
    window.open(url, '_blank', 'autoHideMenuBar=true');
  },
  openExternal(url) {
    require("electron").shell.openExternal(url)
  }
}

export default ({ app }, inject) => {
  inject('utils', module)
}