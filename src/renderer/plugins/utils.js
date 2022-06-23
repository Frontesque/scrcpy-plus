const module = {
  

  openInternal(url) {
    window.open(
        url,
        '_blank',
        'autoHideMenuBar=true'
    );
  }


}

export default ({ app }, inject) => {
  inject('utils', module)
}