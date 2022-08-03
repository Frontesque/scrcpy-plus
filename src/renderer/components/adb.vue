<template>
    <section>
        <h2>ADB Quick Actions</h2>

        <v-list-item v-for="(item, i) in cmds" :key="i" style="padding: 0;">
            <v-btn rounded v-text="item.title" @click="run(item)" />
        </v-list-item>
        
    </section>
</template>

<script>
export default {
    data() {
        return {

            cmds: [
                {
                    title: "Physical Keyboard Settings",
                    cmd: "adb shell am start -a android.settings.HARD_KEYBOARD_SETTINGS"
                },
                {
                    title: "Press Home button",
                    cmd: "adb shell am start -W -c android.intent.category.HOME -a android.intent.action.MAIN"
                },
                {
                    title: "Reboot",
                    cmd: "adb reboot"
                },
                {
                    title: "Reboot Bootloader",
                    cmd: "adb reboot bootloader"
                },
            ],

        }
    },

    methods: {
        run(item) {
            this.$execute(item.cmd)
                .catch((err) => {
                    console.log(err);
                })
        }
    }

}
</script>