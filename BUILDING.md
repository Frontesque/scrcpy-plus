# Building
## Intro
This is the guide to building the latest version of SCRCPY+ for all operating systems. Note: ***PREREQUISITES FOR RUNNING SCRCPY+ ARE DIFFERENT THAN BUILDING***

## Prerequisites 
- Windows, Linux & MacOS
    - [Node v20](https://nodejs.org/en/)
    - [Rust](https://rustup.rs/)

## Build
***ALL COMMANDS ARE RUN IN THE 'application' FOLDER OF THE PROJECT***

- Windows, Linux & MacOS
    - run `npm install`
    - run `npm run tauri build`
    - 🎉 The compiled project should be in the `application/src-tauri/target/release` folder
