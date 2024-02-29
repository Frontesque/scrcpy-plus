<template>
    <div>
        
        <!--   Actions Menu   -->
        <v-card class="actions grey darken-4">
            <v-card-title>
                <back />
                File Manager
            </v-card-title>
            <v-text-field outlined rounded v-model="path" label="Path" style="margin: 0 1em -1.5em 1em" disabled />
            <v-card-actions>
                <div v-for="(item, i) in actions" :key="i" style="margin-right: 0.5em;">
                    <v-btn :style="selected ? `border: 2px solid ${item.color};` : ''" rounded @click="item.action()" :disabled="selected == null && item.requireSelected != false"><v-icon v-text="item.icon" style="margin-right: 0.5em;" />{{ item.name }}</v-btn>
                </div>
            </v-card-actions>
            
        </v-card>
        <!--   End Actions Menu   -->

        <!--   Loading Wheel   -->
        <wheel class="loading" v-if="loading" />
        <!--   End Loading Wheel   -->

        <!--   Empty Notice   -->
        <div class="loading" v-if="loading == false && files.length == 0">
            No files or directories
        </div>
        <!--   End Empty Notice   -->

        <!--   File Selector   -->
        <v-list> <!--   nav rounded   -->
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
        </v-list>
        <!--   End File Selector   -->


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
            path: "/sdcard/",
            files: new Array(),
            selected: null,
            loading: true,

            actions: [
                {
                    name: "Back",
                    icon: "mdi-arrow-up",
                    action: this.back,
                    requireSelected: false,
                },
                {
                    name: "Download",
                    icon: "mdi-download",
                    color: "green",
                    action: this.download,
                },
                {
                    name: "Delete",
                    icon: "mdi-delete",
                    color: "red",
                    action: this.delete,
                }
            ]
        }
    },

    async mounted() {
        this.rebuild();
    },

    watch: {
        selected() {
            const sel = this.files[this.selected];
            if (!sel) return;

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
            
            const dir = await this.$fm.getDir(this.path).catch(err => console.log(err));
            if (dir.directories) {
                for (const i in dir.directories) {
                    const name = dir.directories[i];
                    if (name == "" || name == "*/: No such file or directory") continue;
                    this.files.push({
                        name: name,
                        icon: "mdi-folder",
                        type: "directory"
                    })
                }
            }
            if (dir.files) {
                for (const i in dir.files) {
                    const name = dir.files[i]
                    if (name == "" || name == "*.*: No such file or directory") continue;
                    this.files.push({
                        name: name,
                        icon: "mdi-file",
                        type: "file"
                    })
                }
            }

            this.loading = false;
        },

        back() {
            this.path = this.path.slice(0, this.path.slice(0, -1).lastIndexOf('/')) + "/";
            this.rebuild();
        },

        download() {
            this.$fm.download(this.path + this.files[this.selected].name);
        },

        async delete() {
            await this.$fm.delete(this.path + this.files[this.selected].name);
            this.rebuild();
        }
    }
}
</script>