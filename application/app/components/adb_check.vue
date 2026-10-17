<template>
    <div class="card bg-base-200 w-full mb-8" v-if="missing">
        <div class="card-body">
            <p class="card-title">{{ $t('adb_missing') }}</p>
            <div>{{ $t('adb_missing_desc') }}</div>

            <button class="btn btn-primary text-white" :disabled="downloading" @click="download">
                <icon class="mr-2" size="20x20" name="download" />
                <span>{{ $t('download') }}</span>
            </button>
            <p v-if="error" class="text-error">{{ error }}</p>
        </div>
    </div>

    <div v-if="downloading" class="modal modal-open">
        <div class="modal-box text-center">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="text-xl mt-4">{{ $t('downloading') }}</p>
        </div>
    </div>
</template>

<script>
import { invoke } from "@tauri-apps/api/core";
export default {
    data() {
        return {
            missing: false,
            downloading: false,
            error: ""
        }
    },
    methods: {
        async download() {
            this.downloading = true;
            this.error = "";
            try {
                await install_latest_scrcpy();
                this.missing = false;
                location.reload();
            } catch (e) {
                this.error = String(e);
            } finally {
                this.downloading = false;
            }
        }
    },
    async mounted() {
        try {
            // adb() returns an empty string when the executable can't be launched
            const output = await invoke("exec_adb", { args: ["--version"] });
            this.missing = !output || !output.toLowerCase().includes("android debug bridge");
        } catch (e) {
            console.warn("ADB check failed", e);
        }
    }
}
</script>
