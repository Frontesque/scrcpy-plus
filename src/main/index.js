import { app } from 'electron';

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  //require('../renderer/plugins/modules/execute')('adb kill-server');
  app.quit();
})

// Load here all startup windows
require('./mainWindow')
