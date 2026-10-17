<template>
    <div class="p-8">
        <div class="card bg-base-200 w-full mb-8">
            <div class="p-8 flex">
                <NuxtLink to="/settings">
                    <button class="btn btn-primary w-12">
                        <icon name="reply" size="45x45" />
                    </button>
                </NuxtLink>
                <p class="text-3xl ml-4 mt-1">{{ $t('scrcpy_manager') }}</p>
            </div>
        </div>

        <div class="card bg-base-200 w-full mb-8">
            <div class="card-body">
                <p v-if="loading">{{ $t('loading') }}</p>
                <p v-else-if="error" class="text-error">{{ $t('fetch_failed') }}: {{ error }}</p>

                <div v-for="rel in releases" :key="rel.tag_name" class="flex items-center justify-between gap-4">
                    <div>
                        <p class="text-lg">{{ rel.tag_name }}</p>
                        <p v-if="!rel.asset" class="opacity-50">{{ $t('no_build_available') }}</p>
                    </div>
                    <span v-if="is_active(rel)" class="badge badge-primary text-white">{{ $t('using_this_version') }}</span>
                    <button v-else class="btn btn-primary text-white" :disabled="!rel.asset || busy" @click="install(rel)">
                        <icon class="mr-2" size="20x20" name="download" />
                        <span>{{ busy === rel.tag_name ? $t('downloading') : $t('download_install') }}</span>
                    </button>
                </div>

                <p v-if="install_error" class="text-error">{{ install_error }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { invoke } from "@tauri-apps/api/core";

const RELEASES_URL = "https://api.github.com/repos/Genymobile/scrcpy/releases";

export default {
    data() {
        return {
            releases: [],
            loading: true,
            error: "",
            install_error: "",
            busy: "",
            os: "",
            arch: "",
            active_path: localStorage.getItem("scrcpyplus.scrcpy_path") || ""
        }
    },
    methods: {
        // Release assets look like scrcpy-win64-vX.zip or scrcpy-linux-x86_64-vX.tar.gz
        find_asset(assets) {
            let prefix;
            if (this.os === "windows") prefix = this.arch === "x86" ? "scrcpy-win32-" : "scrcpy-win64-";
            else prefix = `scrcpy-${this.os}-${this.arch}-`;
            return assets.find(a => a.name.startsWith(prefix) && /\.(zip|tar\.gz)$/.test(a.name));
        },
        is_active(rel) {
            const sep = this.os === "windows" ? "\\" : "/";
            return this.active_path.includes(`${sep}${rel.tag_name}${sep}`);
        },
        async install(rel) {
            this.busy = rel.tag_name;
            this.install_error = "";
            try {
                const paths = await invoke("download_scrcpy", { url: rel.asset.browser_download_url, version: rel.tag_name });
                localStorage.setItem("scrcpyplus.scrcpy_path", paths.scrcpy_path);
                localStorage.setItem("scrcpyplus.adb_path", paths.adb_path);
                this.active_path = paths.scrcpy_path;
                await invoke("set_binary_paths", { scrcpyPath: paths.scrcpy_path, adbPath: paths.adb_path });
            } catch (e) {
                this.install_error = String(e);
            } finally {
                this.busy = "";
            }
        }
    },
    async mounted() {
        try {
            const env = await invoke("environment");
            this.os = env.os;
            this.arch = env.arch;
            const data = await $fetch(RELEASES_URL);
            this.releases = data
                .filter(r => !r.draft && !r.prerelease)
                .map(r => ({ tag_name: r.tag_name, asset: this.find_asset(r.assets) }));
        } catch (e) {
            this.error = String(e);
        } finally {
            this.loading = false;
        }
    }
}
</script>
