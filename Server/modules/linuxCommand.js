const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function linuxCommand(command) {
  try {
    const { error, stdout, stderr } = await exec(command);
    if (stderr) {
      return;
    }
    //console.log(stdout);
    return stdout;
  } catch (e) {
    return;
  }
}

//linuxCommand("pwd");

module.exports = { linuxCommand };
