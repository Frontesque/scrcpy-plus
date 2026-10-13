#!/bin/bash
cd ../application
npm i
npm run tauri build
mkdir -p ../buildtools/dist
cp -r ../application/src-tauri/target/release/bundle ../buildtools/dist/bundle
cp ../application/src-tauri/target/release/scrcpy-plus ../buildtools/dist/