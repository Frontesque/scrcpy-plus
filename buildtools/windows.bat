@echo off
setlocal

pushd "%~dp0..\application" || exit /b 1
if not exist "%~dp0dist" mkdir "%~dp0dist"

call npm install
if errorlevel 1 exit /b %errorlevel%

@REM amd64
call npm run tauri build
if errorlevel 1 exit /b %errorlevel%
robocopy "src-tauri\target\release\bundle" "%~dp0dist\bundle" /E
if errorlevel 8 exit /b %errorlevel%
popd

@REM aarch64
@REM  npm run tauri build -- --target aarch64-pc-windows-msvc
@REM  robocopy "../application/src-tauri/target/release/" "../buildtools/dist/" "scrcpy-plus.exe"

exit /b 0