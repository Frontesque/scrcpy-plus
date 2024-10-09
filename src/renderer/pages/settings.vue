<template>
    <div>

        <section>
            <v-card-title>
                <back />
                Settings
            </v-card-title>
        </section>

        <section>
            <div v-for="item, i in settings" :key="i" style="display: flex;">
                <v-switch inset :label="item.description" style="margin: 0;" @change="updateSetting(item.key, this)" v-model="item.data" />
            </div>
        </section>

    </div>
</template>

<script>
export default {
    data() {
        return {
            settings: [
                //{ key: "setting.mirror", description: "Use 'Mirror' engine" },
                { key: "setting.save_scrcpy_settings", description: "Remember SCRCPY settings", data: false },
            ]
        }
    },

    mounted() {
        const vm = this;
        for (let key of Object.keys(localStorage)) { 
            if(!key.startsWith("setting.")) continue;
            for (const i in this.settings) {
                if (key == this.settings[i].key) {
                    vm.settings[i].data = (localStorage.getItem(key) == 'true' ? true : false);
                    console.log(vm.settings[i])
                }
            }
        };
    },

    methods: {
        updateSetting(key, sw) {
            for (const i in this.settings) {
                if (key == this.settings[i].key) {
                    localStorage.setItem(key, this.settings[i].data)
                    console.log(key, this.settings[i].data)
                }
            }
        }
    }
}
</script>