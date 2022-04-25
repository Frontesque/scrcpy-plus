const { exec } = require("child_process");

const module = {
  

  execute(cmd) {
    return new Promise((resolve, reject) => {

      exec(`cd ${process.env.scrcpyPath}&`+cmd, (error, stdout, stderr) => {
          if (error || stderr) reject(error || stderr);
          resolve(stdout);
      });

    });
  }


}

export default ({ app }, inject) => {
  inject('scrcpy', module)
}
