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
      sudo dnf install gtk3-devel libsoup3-devel javascriptcoregtk4.1-devel webkit2gtk4.1-devel
      ```
    - **Arch-based:**
      ```bash
      sudo pacman -S gtk3 libsoup webkit2gtk
      ```

## Build
***ALL COMMANDS ARE RUN IN THE 'application' FOLDER OF THE PROJECT***

- Windows, Linux & MacOS
    - run `npm install`
    - run `npm run tauri build`
    - 🎉 The compiled project should be in the `application/src-tauri/target/release` folder

