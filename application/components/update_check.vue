<template>
    <div class="card bg-base-200 w-full mb-8" v-if="updateAvailable">
        <div class="card-body">
            <p class="card-title">{{ $t('update_available') }}</p>
            <div>{{ $t('new_version') }}</div>

            <div class="flex text-white">
                <span>{{ currentVersion }}</span>
                <icon class="mx-4" size="25x25" name="arrow-right" />
                <span>{{ latestVersion }}</span>
            </div>

            <button class="btn btn-primary text-white" @click="open">
                <icon class="mr-2" size="20x20" name="download" />
                <span>{{ $t('download') }}</span>
            </button>

        </div>
    </div>
</template>

<script>
import { invoke } from "@tauri-apps/api/core";
export default {
    data() {
        return {
            updateAvailable: false,
            currentVersion: new String(),
            latestVersion: new String(),
            repo: []
        }
    },
    methods: {
        async get_latest_release(env) {
            this.repo = await $fetch(env.releases_url);
            for (const i in this.repo) {
                if (this.repo[i].prerelease === false) {
                    return this.repo[i];
                }
            }
        },
        open() {
            require('electron').shell.openExternal(this.repo[0].html_url)
        }
    },
    async mounted() {
        if (localStorage.getItem("setting.disable_update_check") == "true") return;
        const environment = await invoke("environment");
        this.currentVersion = environment.app_version;
        const release = await this.get_latest_release(environment);
        this.latestVersion = release.tag_name;

        const latest = this.latestVersion.split(".");
        const current = this.currentVersion.split(".");
        for (const i in latest) {
            if (latest[i] > current[i]) {
                console.log("UPDATE AVAILABLE")
                return this.updateAvailable = true;
            }
        }
    }
}
</script>
