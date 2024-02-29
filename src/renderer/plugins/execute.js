const execute = (cmd) => {
  return new Promise((resolve, reject) => {

    require('./modules/execute')(cmd)
    .then(res => resolve(res))
    .catch(err => reject(err))

  })
}

export default ({ app }, inject) => {
  inject('execute', execute)
}
