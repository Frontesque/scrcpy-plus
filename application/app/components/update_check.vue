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
import { openUrl } from "@tauri-apps/plugin-opener";
export default {
    data() {
        return {
            updateAvailable: false,
            currentVersion: new String(),
            latestVersion: new String(),
            repo: [],
            release_url: ""
        }
    },
    methods: {
        async get_latest_release(env) {
            this.repo = await $fetch(env.releases_url);
            return this.repo.find(release => release.prerelease === false && !release.draft);
        },
        // Compares dotted versions numerically, ignoring a leading "v" and any suffix
        is_newer(latest, current) {
            const parse = v => String(v).replace(/^v/i, "").split(/[.-]/).map(n => parseInt(n, 10) || 0);
            const a = parse(latest), b = parse(current);
            for (let i = 0; i < Math.max(a.length, b.length); i++) {
                const x = a[i] ?? 0, y = b[i] ?? 0;
                if (x !== y) return x > y;
            }
            return false;
        },
        open() {
            openUrl(this.release_url);
        }
    },
    async mounted() {
        if (localStorage.getItem("setting.disable_update_check") == "true") return;
        try {
            const environment = await invoke("environment");
            this.currentVersion = environment.app_version;
            const release = await this.get_latest_release(environment);
            if (!release) return;
            this.latestVersion = release.tag_name;
            this.release_url = release.html_url;
            this.updateAvailable = this.is_newer(this.latestVersion, this.currentVersion);
        } catch (e) {
            // Offline or rate limited: skip the update check
            console.warn("Update check failed", e);
        }
    }
}
</script>
