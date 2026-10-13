cd ../application
mkdir "../buildtools/dist"
npm i

@REM amd64
npm run tauri build
robocopy "../application/src-tauri/target/release/bundle" "../buildtools/dist/" /E

@REM aarch64
@REM  npm run tauri build -- --target aarch64-pc-windows-msvc
@REM  robocopy "../application/src-tauri/target/release/" "../buildtools/dist/" "scrcpy-plus.exe"