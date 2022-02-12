<template>
    <section>
        <h2>Device</h2>

        <h1 v-show="!device">No Device Found</h1>

        <v-list-item v-for="(item, i) in deviceInfo" :key="i" v-show="device">
            <div>
                <v-list-item-title v-text="item.title" />
                <p v-text="item.data" class="grey--text" />
            </div>
        </v-list-item>
        
    </section>
</template>

<script>
const { exec } = require("child_process");

export default {
    data() {
        return {

            device: false,

            deviceInfo: [
                {
                    title: "Model",
                    command: "adb shell getprop ro.product.model",
                    data: "",
                },
                {
                    title: "Device Codename",
                    command: "adb shell getprop ro.product.device",
                    data: "",
                },
                {
                    title: "Android Version",
                    command: "adb shell getprop ro.build.version.release",
                    data: "",
                },
                {
                    title: "Build",
                    command: "adb shell getprop ro.build.id",
                    data: "",
                },
                {
                    title: "SDK Version",
                    command: "adb shell getprop ro.build.version.sdk",
                    data: "",
                },
                {
                    title: "Fingerprint",
                    command: "adb shell getprop ro.build.fingerprint",
                    data: "",
                }
            ]
        }
    },

    methods: {
        refreshList() {
            for (const i in this.deviceInfo) {
            const command = this.deviceInfo[i].command;
                this.$scrcpy.execute(command, (data) => {
                    if (data.type == "error") return this.device = false;
                    this.deviceInfo[i].data = data.res;
                    this.device = true;
                })
            }
        }

    },

    mounted() {

        setInterval(() => {
            this.refreshList()
        }, 10000);
        this.refreshList()
        
    }

}
</script>
