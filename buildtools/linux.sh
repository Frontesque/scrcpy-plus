#!/bin/bash
cd ../application
mkdir -p ../buildtools/dist
npm i

# amd64
npm run tauri build
cp -r ../application/src-tauri/target/release/bundle ../buildtools/dist/bundle
cp ../application/src-tauri/target/release/scrcpy-plus ../buildtools/dist/scrcpy-plus-amd64

# aarch64
# npm run tauri build -- --target aarch64-unknown-linux-gnu
# cp -r ../application/src-tauri/target/aarch64-unknown-linux-gnu/release/bundle ../buildtools/dist/
# cp ../application/src-tauri/target/aarch64-unknown-linux-gnu/release/scrcpy-plus ../buildtools/dist/scrcpy-plus-aarch64