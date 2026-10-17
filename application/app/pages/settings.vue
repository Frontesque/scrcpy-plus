<template>
    <div class="p-8">
        <!--   Header   -->
        <div class="card bg-base-200 w-full mb-8">
            <div class="p-8 flex">
                <NuxtLink to="/">
                    <button class="btn btn-primary w-12">
                        <icon name="reply" size="45x45" />
                    </button>
                </NuxtLink>
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
                    <option value="ja" :selected="locale == 'ja'">日本語</option>
                </select>
                <p class="opacity-50">
                    <span class="mr-2">{{ $t('translation_credits') }}</span>
                    <span>{{ $t('translation_credits_value') }}</span>
                </p>

                <div class="mt-8 flex" v-for="item, i in settings">
                    <input type="checkbox" class="toggle checkbox-primary mr-2" @change="updateSetting(item.key, $event)" :checked="item.checked" />
                    <p>{{ $t(item.title) }}</p>
                </div>
            </div>
        </div>

        <div class="card bg-base-200 w-full mb-8">
            <div class="card-body">
                <div v-for="bin in binaries" :key="bin.key" class="mb-4">
                    <p>{{ $t(bin.title) }}</p>
                    <div class="flex gap-2">
                        <input type="text" class="input w-full" readonly :value="paths[bin.key]" :placeholder="$t('bundled_default')" />
                        <button class="btn btn-primary text-white" @click="pick_binary(bin)">{{ $t('browse') }}</button>
                    </div>
                </div>
                <NuxtLink to="/scrcpy_manager">
                    <button class="btn btn-primary text-white">{{ $t('manage_versions') }}</button>
                </NuxtLink>
            </div>
        </div>

    </div>
</template>

<script setup>
const { setLocale } = useI18n()
</script>

<script>
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
export default {
    data() {
        return {
            settings: [
                { key: "setting.disable_update_check", title: "dnc_updates" },
                { key: "setting.save_scrcpy_config",   title: "rscrcpy_config"  }
            ],
            is_windows: false,
            binaries: [
                { key: "scrcpy_path", title: "scrcpy_executable" },
                { key: "adb_path",    title: "adb_executable" }
            ],
            paths: {
                scrcpy_path: localStorage.getItem("scrcpyplus.scrcpy_path") || "",
                adb_path:    localStorage.getItem("scrcpyplus.adb_path") || ""
            },
            locale: localStorage.getItem("scrcpyplus.locale") || 'en',
        }
    },
    methods: {
        updateSetting(key, event) {
            localStorage.setItem(key, event.target.checked);
            console.log(key, event.target.checked);
        },
        async apply_binary_paths() {
            await invoke("set_binary_paths", {
                scrcpyPath: this.paths.scrcpy_path || null,
                adbPath: this.paths.adb_path || null
            });
        },
        async pick_binary(bin) {
            const selected = await open({
                multiple: false,
                directory: false,
                filters: this.is_windows ? [{ name: "Executable", extensions: ["exe"] }] : []
            });
            if (typeof selected !== "string") return;
            this.paths[bin.key] = selected;
            localStorage.setItem(`scrcpyplus.${bin.key}`, selected);
            await this.apply_binary_paths();
        },
        async clear_binary(bin) {
            this.paths[bin.key] = "";
            localStorage.removeItem(`scrcpyplus.${bin.key}`);
            await this.apply_binary_paths();
        },
        set_language(event) {
            const new_locale = event.target.value;
            localStorage.setItem("scrcpyplus.locale", new_locale);
            console.log("scrcpyplus.locale", new_locale);
        }
    },
    async mounted() {
        this.is_windows = (await invoke("environment")).is_windows === true;
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