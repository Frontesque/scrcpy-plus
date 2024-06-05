function execute(data) {
  console.log(data)
}

// This file is the 'SCRCPY Plus Bridge' that bridges the electron app to the host system, be it Windows, Linux or MacOS.
export default {
  install: (app, options) => {
    app.spb = {
      execute
    }
  },
};
