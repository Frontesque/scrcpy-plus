# buildtools
A set of scripts to compile scrcpy-plus for all platforms

## Cross Compiling

### Windows
Prerequisites
```bat
REM Install C compiling for arm64 in visual studio
rustup target add aarch64-pc-windows-msvc
```

### Linux
Prerequisites:
```bash
rustup target add aarch64-unknown-linux-gnu
```

### Mac
Prerequisites:
```zsh
rustup target add aarch64-apple-darwin
```