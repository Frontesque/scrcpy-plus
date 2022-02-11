/*
  This module cannot contain any external libraries!
 */

const {engines} = require('../package');

const RESET = "\x1b[0m";
const FG_RED = "\x1b[31m";

function checkNodeVersion(){
  if(engines.node === undefined) return;
  const requiredMinVersion = engines.node.replace(/[=<>]/g, '');
  const installedVersion = process.versions.node;
  if(compare(requiredMinVersion, installedVersion) === 1){

    console.log(FG_RED);
    console.log(`\tYou are running version v${installedVersion} of Node.js, which is not supported by Electron-nuxt.`);
    console.log(`\tThe official Node.js version that is supported is ${requiredMinVersion} or greater.`);
    console.log(RESET);
    console.log('\n\tPlease visit https://nodejs.org/en/ to find instructions on how to update Node.js.\n')

    throw new Error('Invalid node version');
  }
}

//https://github.com/yarnpkg/yarn/issues/5063
function disallowNpm() {
  const execPath = process.env.npm_execpath;
  if(!execPath.includes('yarn')){

    console.log(FG_RED);
    console.log(`\tElectron-nuxt supports only Yarn package manager.`);
    console.log(RESET);
    console.log('\n\tPlease visit https://legacy.yarnpkg.com/en/docs/install to find instructions on how to install Yarn.\n')

    throw new Error('Invalid package manager');
  }
}


//https://stackoverflow.com/questions/6832596/how-to-compare-software-version-number-using-js-only-number
// Return 1 if a > b
// Return -1 if a < b
// Return 0 if a == b
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  const a_components = a.split(".");
  const b_components = b.split(".");

  const len = Math.min(a_components.length, b_components.length);

  // loop while the components are equal
  for (let i = 0; i < len; i++) {
    // A bigger than B
    if (parseInt(a_components[i]) > parseInt(b_components[i])) {
      return 1;
    }

    // B bigger than A
    if (parseInt(a_components[i]) < parseInt(b_components[i])) {
      return -1;
    }
  }

  // If one's a prefix of the other, the longer one is greater.
  if (a_components.length > b_components.length) {
    return 1;
  }

  if (a_components.length < b_components.length) {
    return -1;
  }

  // Otherwise they are the same.
  return 0;
}

try{
  checkNodeVersion();
  disallowNpm();
  // https://stackoverflow.com/questions/6398196/detect-if-called-through-require-or-directly-by-command-line
  if (require.main === module) process.exit(0);
}catch (e) {
  process.exit(1);
}

