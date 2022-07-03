# Building
## Intro
This is the guide to building the latest version of SCRCPY+ for all operating systems. Note: ***PREREQUISITES FOR RUNNING SCRCPY+ ARE DIFFERENT THAN BUILDING***

## Prerequisites 
- Windows
    - [Node v16](https://nodejs.org/en/)
    - NPM (Comes with Node)
    - Yarn for Node // run `npm i -g yarn`
- Linux / Mac
    - [Node v16](https://nodejs.org/en/)
    - NPM (Comes with Node)
    - Yarn Package Manager // [Download](https://yarnpkg.com/) OR RUN `sudo npm i -g yarn`

## Build
- Windows
    - Edit `src/renderer/nuxt.config.js` & comment the line that says `//Development` by adding 2 slashes `//` in front of the line. Uncomment the line that says `//Production` by removing the 2 slashes at the start of the line.
    - run `yarn install`
    - run `yarn install`
    - run `yarn build`
    - the output files should be in the `build` folder
- Linux / Mac
    - Edit `src/renderer/nuxt.config.js` & comment the line that says `//Development` by adding 2 slashes `//` in front of the line. Uncomment the line that says `//Production` by removing the 2 slashes at the start of the line.
    - Edit `src/renderer/nuxt.config.js` & change the line that says `os: "windows",` to say `os: "linux",` 
    ***NOTE: IF YOU ARE ON MACOS, IT SHOULD STILL SAY LINUX, NOT MACOS***
    - run `yarn install`
    - run `yarn build`
    - the output files should be in the `build` folder
