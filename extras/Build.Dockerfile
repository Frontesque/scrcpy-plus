FROM alpine:latest
###   Install Dependencies   ###
RUN apk add nodejs npm build-base curl wget file openssl libayatana-appindicator-dev librsvg webkit2gtk-4.1-dev libsoup3 gcc
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
###   Copy Application Into Container   ###
COPY ../application /application
WORKDIR /application
###   Build   ###
RUN npm install
RUN export PATH="$HOME/.cargo/bin:$PATH"; PKG_CONFIG_PATH= NO_STRIP=true npm run tauri build
# Tauri fails to link with cc in the above build ^
RUN mv /application/src-tauri/target/release /sprelease

# Allow the container to run infinitely when started
# This lets us extract the build folder easily
ENTRYPOINT ['sleep', 'infinity']