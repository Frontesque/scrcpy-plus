# Building
## Intro
This is the guide to building the latest version of SCRCPY+ for all operating systems. Note: ***PREREQUISITES FOR RUNNING SCRCPY+ ARE DIFFERENT THAN BUILDING***

## Prerequisites
- Windows, Linux & MacOS
    - [Node v20](https://nodejs.org/en/)
    - [Rust](https://rustup.rs/)
- Linux only
    - **Debian/Ubuntu-based:**
      ```bash
      sudo apt install libgtk-3-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev libwebkit2gtk-4.1-dev
      ```
    - **Fedora/RHEL-based:**
      ```bash
      sudo dnf install webkit2gtk4.1-devel openssl-devel curl wget file libappindicator-gtk3-devel librsvg2-devel
      sudo dnf group install "c-development"
      ```
    - **Arch-based:**
      ```bash
      sudo pacman -S gtk3 libsoup webkit2gtk
      ```
  \* More information available at https://v2.tauri.app/start/prerequisites/

## Build
***ALL COMMANDS ARE RUN IN THE 'application' FOLDER OF THE PROJECT***

- Linux & MacOS
    - run `npm install`
    - run `NO_STRIP=true npm run tauri build`
    - 🎉 The compiled project should be in the `application/src-tauri/target/release` folder

- Windows
    - run `npm install`
    - run `npm run tauri build`
    - 🎉 The compiled project should be in the `application/src-tauri/target/release` folder

