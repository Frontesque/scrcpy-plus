<template>
    <div>
        
        <!--   Actions Menu   -->
        <v-card class="actions grey darken-4">
            <v-card-title>
                <back />
                File Manager
            </v-card-title>
            <v-card-actions>
                <div v-for="(item, i) in actions" :key="i" style="margin-right: 0.5em;">
                    <v-btn rounded :color="item.color" @click="item.action()" :disabled="selected == null && item.requireSelected != false"><v-icon v-text="item.icon" style="margin-right: 0.5em;" />{{ item.name }}</v-btn>
                </div>
            </v-card-actions>
            <div>Path: {{ path }}</div>
        </v-card>
        <!--   End Actions Menu   -->

        <!--   Loading Wheel   -->
        <v-progress-circular indeterminate color="primary" size="50" class="loading" v-if="loading" />
        <!--   End Loading Wheel   -->

        <!--   Package Selector   -->
        <v-list-item-group v-model="selected" color="primary" style="margin-top: 12em;">
            <v-list-item v-for="(item, i) in files" :key="i">
                
                
                <v-list-item-icon>
                    <v-icon v-text="item.icon || 'mdi-package'" />
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
            path: "/",
            files: new Array(),
            selected: null,
            loading: true,

            actions: [
                {
                    name: "Download",
                    icon: "mdi-download",
                    color: "primary",
                    action: this.enable,
                },
                {
                    name: "Delete",
                    icon: "mdi-delete",
                    color: "red",
                    action: this.uninstall,
                }
            ],

            icons: [
                { package: "com.android", icon:"mdi-android" },
                { package: "com.google",  icon:"mdi-google" },
                { package: "theme",  icon:"mdi-brush-variant" },
                { package: "font",  icon:"mdi-format-font" },
            ]
        }
    },

    async mounted() {
        this.rebuild();
    },

    watch: {
        selected() {
            if (!this.selected) return;

            const sel = this.files[this.selected];
            if (sel.type == "directory") {
                this.selected = null;
                this.path += sel.name;
                this.rebuild();
            }
        }
    },

    methods: {
        async rebuild() {
            this.loading = true;
            this.files = new Array();
            
            const dir = await this.$fm.getDir(this.path);
            for (const i in dir.directories) {
                this.files.push({
                    name: dir.directories[i],
                    icon: "mdi-folder",
                    type: "directory"
                })
            }
            for (const i in dir.files) {
                this.files.push({
                    name: dir.files[i],
                    icon: "mdi-file",
                    type: "file"
                })
            }

            this.loading = false;
        },

        async enable() {
            const app = this.apps[this.selected];
            const output = await this.$execute(`adb shell pm enable ${app.name}`)
            this.showMsg(output);
        },
        async uninstall() {
            const app = this.apps[this.selected];
            const output = await this.$execute(`adb shell pm uninstall -k --user 0 ${app.name}`)
            this.showMsg(output);
        }
    }
}
</script>