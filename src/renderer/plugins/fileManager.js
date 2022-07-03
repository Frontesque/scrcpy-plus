/*
File Manager by GitHub/Frontesque
For SCRCPY+ & ADB compatable devices

This code uses file browsing via the `ls` command
*/

async function shell(cmd) {
    return require('./modules/execute')(`adb shell "${cmd}"`);
}

module = {
    async getDir(dir="/") {
        let files = await shell(`cd ${dir} && ls -d *.*`).catch(err => console.log(err));
        let directories = await shell(`cd ${dir} && ls -d */`).catch(err => console.log(err));

        if (files) files = files.replace(/\r/g,"").split('\n');
        if (directories) directories = directories.replace(/\r/g,"").split('\n');

        return { files: files || [], directories: directories || [] }
    }
}

export default ({ app }, inject) => {
    inject('fm', module)
  }