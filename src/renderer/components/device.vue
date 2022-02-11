<template>
    <section>
        <h2>Device</h2>

        <h1 v-show="!device">No Device Found</h1>

        <v-list-item v-for="(item, i) in deviceInfo" :key="i" v-show="device">
            <div>
                <v-list-item-title v-text="item.title" />
                <v-list-item-title v-text="item.data" class="grey--text" />
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
                    command: "adb shell getprop ro.product.vendor.device",
                    data: "",
                },
                {
                    title: "Android Version",
                    command: "adb shell getprop ro.system.build.version.release",
                    data: "",
                },
                {
                    title: "Build",
                    command: "adb shell getprop ro.system.build.id",
                    data: "",
                },
                {
                    title: "SDK Version",
                    command: "adb shell getprop ro.system.build.version.sdk",
                    data: "",
                },
                {
                    title: "Fingerprint",
                    command: "adb shell getprop ro.system.build.fingerprint",
                    data: "",
                }
            ]
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
        },

        refreshList() {
            for (const i in this.deviceInfo) {
            const command = this.deviceInfo[i].command;
                this.run(command, (data) => {
                    if (data == "No Device Found") return this.device = false;
                    this.deviceInfo[i].data = data;
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