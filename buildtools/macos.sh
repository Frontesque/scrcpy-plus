#!/bin/zsh
cd ../application
mkdir -p ../buildtools/dist
npm i

# amd64
npm run tauri build
cp -r ../application/src-tauri/target/release/bundle ../buildtools/dist/bundle

# aarch64
npm run tauri build -- --target aarch64-apple-darwin
cp -r ../application/src-tauri/target/aarch64-apple-darwin/release/bundle ../buildtools/dist/bundle