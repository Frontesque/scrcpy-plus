<template>
    <div>
        
        <!--   Actions Menu   -->
        <v-card class="actions grey darken-4">
            <v-card-title>
                <back />
                Package Manager
            </v-card-title>
            <v-card-actions>
                <div v-for="(item, i) in actions" :key="i" style="margin-right: 0.5em;">
                    <v-btn :style="selected ? `border: 2px solid ${item.color};` : ''" rounded @click="item.action()" :disabled="selected == null && item.requireSelected != false"><v-icon v-text="item.icon" style="margin-right: 0.5em;" />{{ item.name }}</v-btn>
                </div>
            </v-card-actions>
            <v-checkbox v-model="showSystem" label="Show System Apps" style="margin-left: 1em;" />
        </v-card>
        <!--   End Actions Menu   -->

        <!--   Loading Wheel   -->
        <wheel class="loading" v-if="loading" />
        <!--   End Loading Wheel   -->

        <!--   Package Selector   -->
        <v-list-item-group v-model="selected" color="primary" style="margin-top: 12em;">
            <v-list-item v-for="(item, i) in apps" :key="i">
                
                
                <v-list-item-icon>
                    <v-icon v-text="item.icon || 'mdi-package'" style="margin-right: 0;"/>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>
                        {{ item.name }}
                        <v-chip v-if="item.disabled" style="height: 1.75em;">Disabled</v-chip>
                    </v-list-item-title>
                </v-list-item-content>



            </v-list-item>
        </v-list-item-group>
        <!--   End Package Selector   -->

        <!--   Notification Dialog   -->
        <v-dialog v-model="dialog" width="500">
            <v-card>
                <v-card-title class="text-h5 grey darken-3">Complete</v-card-title>
                <v-card-text v-text="dialogMessage" style="margin-top: 2em;" />
                <v-divider />
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" text @click="dialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!--   End Notification Dialog   -->


    </div>
</template>

<style scoped>
.actions {
    position: fixed;
    top: 2em;
    width: 100%;
    z-index: 10;
}

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>

<script>
export default {
    data() {
        return {
            apps: new Array(),
            selected: null,
            disabledApps: new Array(),
            showSystem: false,
            loading: true,
            dialog: false,
            dialogMessage: "",

            actions: [
                {
                    name: "Enable",
                    icon: "mdi-plus",
                    color: "green",
                    action: this.enable,
                },
                {
                    name: "Disable",
                    icon: "mdi-minus",
                    color: "yellow",
                    action: this.disable,
                },
                {
                    name: "Uninstall",
                    icon: "mdi-delete",
                    color: "red",
                    action: this.uninstall,
                },
                /*
                {
                    name: "Install",
                    icon: "mdi-download",
                    color: "green",
                    requireSelected: false,
                    action: this.install,
                },
                */
            ],

            icons: [
                { package: "com.android", icon:"mdi-android" },
                { package: "com.google",  icon:"mdi-google" },
                { package: "theme",  icon:"mdi-brush-variant" },
                { package: "font",  icon:"mdi-format-font" },
            ]
        }
    },

   watch: {
    showSystem() {
        this.rebuild();
    }
   },

    async mounted() {
        this.rebuild();
    },

    methods: {
        // http://adbcommand.com/adbshell/pm
        async getInstalled(flags="") {
            let apps = new Array();

            let data = await this.$execute("adb shell pm list packages "+flags);
            data = data.split('\r\n');
            for (const i in data) {
                const packageName = data[i].split("package:")[1];
                if (packageName == "" || packageName == undefined) continue;
                apps.push(packageName);
            }
            return apps;
        },

        icon(packageName) {
            let iconName;
            for (const i in this.icons) {
                const icon = this.icons[i];
                if (packageName.includes(icon.package)) iconName = icon.icon;
            }
            return iconName
        },

        isDisabled(packageName) {
            if (this.disabledApps.includes(packageName)) {
                return true;
            } else {
                return false;
            }
        },

        addApps(list) {
            for (const i in list) {
                const app = list[i];
                this.apps.push({
                    name: app,
                    icon: this.icon(app),
                    disabled: this.isDisabled(app)
                })
            };
        },

        async rebuild() {
            this.loading = true;
            this.apps = new Array();
            this.disabledApps = await this.getInstalled("-d");

            const thirdParty = await this.getInstalled("-3");
            const system     = await this.getInstalled("-s");
            
            this.addApps(thirdParty);
            if (this.showSystem) this.addApps(system);
            this.loading = false;
        },


        showMsg(msg) {
            this.dialog = true;
            this.dialogMessage = msg;
        },

        async enable() {
            const app = this.apps[this.selected];
            const output = await this.$execute(`adb shell pm enable ${app.name}`)
            this.showMsg(output);
        },
        async disable() {
            const app = this.apps[this.selected];
            const output = await this.$execute(`adb shell pm disable-user --user 0 ${app.name}`)
            this.showMsg(output);
        },
        async install() {
            const app = this.apps[this.selected];

            console.log("install", app);
        },
        async uninstall() {
            const app = this.apps[this.selected];
            const output = await this.$execute(`adb shell pm uninstall -k --user 0 ${app.name}`)
            this.showMsg(output);
        }
    }
}
</script>