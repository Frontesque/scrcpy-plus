const execute = (cmd) => {
  return new Promise((resolve, reject) => {
    require('./modules/execute')(cmd)
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}


const module = {
  start(settings, callback) {

    execute(`adb exec-out screenrecord --output-format=h264 file.mp4`);

    callback();
  }
}

export default ({ app }, inject) => {
  inject('mirror', module)
}