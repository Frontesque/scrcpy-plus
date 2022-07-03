/*
File Manager by GitHub/Frontesque
For SCRCPY+ & ADB compatable devices

This code uses file browsing via the `ls` command
*/

import { Dir } from 'original-fs';

async function shell(cmd) {
    return require('./modules/execute')(`adb shell "${cmd}"`);
}

module = {
    async getDir(dir="/") {
        const files = await shell(`cd ${dir} && ls -d *.*`);
        const directories = await shell(`cd ${dir} && ls -d */`);

        return { files: files.split('\n'), directories: directories.split('\n') }
    }
}

export default ({ app }, inject) => {
    inject('fm', module)
  }