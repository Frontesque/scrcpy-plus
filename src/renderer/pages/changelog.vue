<template>
    <div>

        <section>
            <h1>Changelog</h1>
            <v-btn style="margin-top: 1em;" rounded color="primary" @click="$router.go(-1)">Back</v-btn>
        </section>

        <section>
            <h3>1.2.0</h3>
            <ul>
                <li>Refactored some of the app to be more modular</li>
                <li>Dynamically get the installed version of SCRCPY</li>
                <li>Dynamically get the installed version of ADB</li>
                <li>Minor UI Tweaks</li>
                <li>Multiplatform / Linux Support</li>
                <li>Some Bug Fixes</li>
                <li>Take 'Wireless Connection' Development Warning Away</li>
            </ul>
        </section>

        <section>
            <h3>1.1.2</h3>
            <ul>
                <li>Added wireless pairing gui</li>
                <li>Added support for ADB over Wi-Fi</li>
                <li>(KNOWN BUG) having multiple devices connected crashes the app</li>
            </ul>
        </section>

        <section>
            <h3>1.1.1</h3>
            <ul>
                <li>Fix error being thrown when closing the SCRCPY window</li>
                <li>Increased device information/recognition polling rate 8x</li>
                <li>Optimized device recognition to use less system resources</li>
                <li>Fixed causing some devices to lag badly while having the main window open</li>
            </ul>
        </section>

        <section>
            <h3>1.1.0</h3>
            <ul>
                <li>Bump SCRCPY Version (1.22 -> 1.23)</li>
                <li>General UI layout improvements</li>
                <li>Huge memory optimization</li>
                <li>Added loading icon on the 'Start SCRCPY' button to prevent the user from opening multiple SCRCPY instances</li>
                <li>Changed "Device Not Found" notice</li>
                <li>When a device isn't detected, all device options are now hidden</li>
                <li>Added SCRCPY Option: "--lock-video-orientation"</li>
            </ul>
        </section>

        <section>
            <h3>1.0.4</h3>
            <ul>
                <li>Improved error handling: Errors now show a popup box</li>
                <li>Added SCRCPY Option: "--always-on-top"</li>
                <li>Added SCRCPY Option: "--prefer-text"</li>
                <li>Added SCRCPY Option: "--raw-key-events"</li>
                <li>Added SCRCPY Option: "--no-key-repeat"</li>
            </ul>
        </section>

        <section>
            <h3>1.0.3</h3>
            <ul>
                <li>Wrapped text / Text doesn't leave the window without giving the option to scroll</li>
                <li>Fixed a lot of issues with running or using ADB on the previous version</li>
            </ul>
        </section>

        <section>
            <h3>1.0.2</h3>
            <ul>
                <li>Removed unused files</li>
                <li>Moved SCRCPY files to /resources instead of /bin as per a standard Electron application</li>
                <li>Update windows binary information</li>
                <li>Added optional windows installer file</li>
                <li>General software cleanup</li>
            </ul>
        </section>
        
        <section>
            <h3>1.0.1</h3>
            <ul>
                <li>Added changelog</li>
                <li>Added support for more devices in the "Devices" section</li>
                <li>Changed a few backend things</li>
                <li>Generally smoothed out the experience</li>
            </ul>
        </section>

        <section>
            <h3>1.0</h3>
            <ul>
                <li>Made the app :)</li>
            </ul>
        </section>

    </div>
</template>
