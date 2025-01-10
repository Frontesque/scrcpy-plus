<template>
    <div class="p-8">
        <!--   Header   -->
        <div class="card bg-base-200 w-full mb-8">
            <div class="p-8 flex">
                <button class="btn btn-primary w-12" @click="$router.go(-1)">
                    <icon name="reply" size="45x45" />
                </button>
                <p class="text-3xl ml-4 mt-1">{{ $t('settings') }}</p>
            </div>
        </div>

        <!--   Content   -->
        <div class="card bg-base-200 w-full mb-8">
            <div class="card-body">
                
                <p>{{ $t('language') }}</p>
                <select class="select w-full" @change="set_language($event); setLocale($event.target.value)">
                    <option value="en" :selected="locale == 'en'">English</option>
                    <option value="it" :selected="locale == 'it'">Italiano</option>
                </select>

                <div class="mt-8 flex" v-for="item, i in settings">
                    <input type="checkbox" class="toggle checkbox-primary mr-2" @change="updateSetting(item.key, $event)" :checked="item.checked" />
                    <p>{{ $t(item.title) }}</p>
                </div>

                
            </div>
        </div>

    </div>
</template>

<script setup>
const { setLocale } = useI18n()
</script>

<script>
export default {
    data() {
        return {
            settings: [
                { key: "setting.disable_update_check", title: "dnc_updates" },
                { key: "setting.save_scrcpy_config",   title: "rscrcpy_config"  }
            ],
            locale: localStorage.getItem("scrcpyplus.locale") || 'en',
        }
    },
    methods: {
        updateSetting(key, event) {
            localStorage.setItem(key, event.target.checked);
            console.log(key, event.target.checked);
        },
        set_language(event) {
            const new_locale = event.target.value;
            localStorage.setItem("scrcpyplus.locale", new_locale);
            console.log("scrcpyplus.locale", new_locale);
        }
    },
    mounted() {
        const vm = this;
        for (let key of Object.keys(localStorage)) { 
            if(!key.startsWith("setting.")) continue;
            for (const i in this.settings) {
                if (key == this.settings[i].key) {
                    vm.settings[i].checked = (localStorage.getItem(key) == 'true' ? true : false);
                }
            }
        };
    },
}
</script>