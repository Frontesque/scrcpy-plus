const { exec } = require("child_process");

const module = {
  execute(cmd, callback) {
    let output = {type: undefined, res: undefined};

    exec(`cd ${process.env.scrcpyPath}&`+cmd, (error, stdout, stderr) => {
        if (error) {
          output.type = "error";
        } else if (stderr) {
          output.type = "stderr";
        } else if (stdout) {
          output.type = "stdout";
        }
        output.res = error || stderr || stdout;
        return callback(output);
    });
  }
}

export default ({ app }, inject) => {
  inject('scrcpy', module)
}
