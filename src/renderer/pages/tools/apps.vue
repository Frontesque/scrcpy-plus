<template>
    <div>
        

        <v-card class="actions grey darken-4">
            <v-card-title>
                <back style="margin-right: 1em;" />Package Manager
            </v-card-title>
            <v-card-actions>
                <div v-for="(item, i) in actions" :key="i" style="margin-right: 0.5em;">
                    <v-btn rounded :color="item.color" @click="item.action()" :disabled="selected == null && item.requireSelected != false"><v-icon v-text="item.icon" style="margin-right: 0.5em;" />{{ item.name }}</v-btn>
                </div>
            </v-card-actions>
            <v-alert text type="warning" style="margin: 0.5em;">Modifying system apps may cause your device to break!</v-alert>
        </v-card>
        
        <v-list-item-group v-model="selected" color="primary" style="margin-top: 12em;">
            <v-list-item v-for="(item, i) in apps" :key="i">
                
                
                <v-list-item-icon>
                    <v-icon v-text="item.icon || 'mdi-package'" />
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>



            </v-list-item>
        </v-list-item-group>


    </div>
</template>

<style scoped>
.actions {
    position: fixed;
    top: 2em;
    width: 100%;
    z-index: 10;
}
</style>

<script>
export default {
    data() {
        return {
            apps: new Array(),
            selected: null,

            actions: [
                {
                    name: "Enable",
                    icon: "mdi-plus",
                    color: "primary",
                    action: this.enable,
                },
                {
                    name: "Disable",
                    icon: "mdi-minus",
                    color: "primary",
                    action: this.disable,
                },
                {
                    name: "Install",
                    icon: "mdi-download",
                    color: "green",
                    requireSelected: false,
                    action: this.install,
                },
                {
                    name: "Uninstall",
                    icon: "mdi-delete",
                    color: "red",
                    action: this.uninstall,
                },
            ],

            icons: [
                { package: "com.android", icon:"mdi-android" },
                { package: "com.google",  icon:"mdi-google" },
                { package: "theme",  icon:"mdi-brush-variant" },
                { package: "font",  icon:"mdi-format-font" },
            ]
        }
    },

    /*
    List Installed: pm list packages -f
    Delete: pm uninstall -k –user 0 com.facebook.appmanager
    Disable: pm disable-user --user 0 com.miui.cleanmaster
    Enable: pm enable com.facebook.system
    */

    async mounted() {
        this.apps = await this.getInstalled()
    },

    methods: {
        async getInstalled() {
            let apps = new Array();

            let data = await this.$scrcpy.execute("adb shell pm list packages -f");
            data = data.split('\r\n');
            for (const i in data) {
                const packageName = data[i].split("=")[1];
                if (packageName == "" || packageName == undefined) continue;
                
                let iconName;
                for (const i in this.icons) {
                    const icon = this.icons[i];
                    if (packageName.includes(icon.package)) iconName = icon.icon;
                }


                apps.push({
                    name: packageName,
                    icon: iconName
                });
            }
            return apps;
        },



        async enable() {
            const app = this.apps[this.selected];
            await this.$scrcpy.execute(`adb shell pm enable ${app.name}`)
        },
        async disable() {
            const app = this.apps[this.selected];
            await this.$scrcpy.execute(`adb shell pm disable-user --user 0  ${app.name}`)
        },
        async install() {
            const app = this.apps[this.selected];

            console.log("install", app);
        },
        async uninstall() {
            const app = this.apps[this.selected];
            await this.$scrcpy.execute(`adb shell pm uninstall -k –user 0 ${app.name}`)
        }
    }
}
</script>