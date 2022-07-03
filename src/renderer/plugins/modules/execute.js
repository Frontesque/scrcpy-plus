const { exec } = require("child_process");

module.exports = (cmd) => {
    return new Promise((resolve, reject) => {

        exec(
          (process.env.os === "windows" ? ('cd '+process.env.scrcpyPath+ '&') : ('')) + cmd, // CD to PreInstalled SCRCPY On Windows
          (error, stdout, stderr) => {
            if (error || stderr) reject(error || stderr);
            resolve(stdout);
          }
        );
    
    });
}