#!/bin/bash
RUNNER="podman"

###############################################################################
## It may seem silly to compile in a container but I have my reasons.        ##
## Alpine creates static binaries that don't rely on system libraries.       ##
## This is nice because it can run on any linux distro.                      ##
## It accomplishes the same thing as an appimage,                            ##
## without having to directly bundle all libraries.                          ##
## AppImages are fairly large (~100MB)                                       ##
## I'd like to avoid distributing AppImages as they're close to              ##
## the same size as an Electron app, which SCRCPY+ just switched from.       ##
###############################################################################

rm -rf application/node_modules
rm -rf application/src-tauri/target
$RUNNER build -t scrcpy_plus_runner -f extras/Build.Dockerfile .
$RUNNER run --name scrcpy_plus_runner_extract scrcpy_plus_runner:latest
$RUNNER cp scrcpy_plus_runner_extract:/sprelease ./build
# $RUNNER rmi scrcpy_plus_runner