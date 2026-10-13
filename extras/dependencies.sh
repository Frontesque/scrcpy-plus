#!/bin/bash
# curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
sudo dnf install -y \
    gcc \
    gcc-c++ \
    make \
    glibc-devel \
    openssl-devel \
    dbus-devel \
    javascriptcoregtk4.1-devel \
    curl \
    wget \
    file \
    libappindicator-gtk3-devel \
    librsvg2-devel \
    libxdo-devel \
    libsoup3-devel \
    webkit2gtk4.1-devel