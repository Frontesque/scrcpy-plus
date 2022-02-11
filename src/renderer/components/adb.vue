<template>
    <section>
        <h2>ADB Quick Actions</h2>

        <v-list-item v-for="(item, i) in cmds" :key="i">
            <div>
                <v-btn v-text="item.title" @click="run(item.cmd)" />
            </div>
        </v-list-item>
        
    </section>
</template>

<script>
const { exec } = require("child_process");

export default {
    data() {
        return {

            cmds: [
                {
                    title: "Physical Keyboard Settings",
                    cmd: "adb shell am start -a android.settings.HARD_KEYBOARD_SETTINGS"
                },
                {
                    title: "Reboot",
                    cmd: "adb reboot"
                },
                {
                    title: "Reboot Bootloader",
                    cmd: "adb reboot bootloader"
                },
                {
                    title: "Press Home button",
                    cmd: "adb shell am start -W -c android.intent.category.HOME -a android.intent.action.MAIN"
                }
            ],

        }
    },

    methods: {
        run(cmd, callback) {
            exec('cd bin/scrcpy&'+cmd, (error, stdout, stderr) => {
                if (error) {
                    return callback("No Device Found");
                }
                return callback(stderr || stdout);
            });
        }
    }

}
</script>