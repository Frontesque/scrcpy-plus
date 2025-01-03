const { exec } = require("child_process");
const os = require('os');

module.exports = (cmd) => {
    const isWindows = os.type() == "Windows_NT";
    const isMac = os.type() == "Darwin";

    return new Promise((resolve, reject) => {
        let command = cmd
        let opts = {};
        // CD to PreInstalled SCRCPY On Windows
        if (isWindows) {
            command = 'cd '+process.env.scrcpyPath+ '&' + command;
        }
        if (isMac) {
            opts["shell"] = "/bin/zsh"
            opts["env"] = process.env
            opts["env"]["PATH"] += ":/opt/homebrew/bin"
        }
        exec(
            command, 
            opts,
            (error, stdout, stderr) => {
                if (error || stderr) reject(error || stderr);
                resolve(stdout);
            }
        );
    
    });
}
