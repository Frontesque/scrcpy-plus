<template>
    <div class="card bg-base-200 w-full mb-8">
        <div class="card-body">
            <!--   Version Information   -->
            <p class="card-title">SCRCPY</p>

            <button class="btn btn-primary" @click="start_scrcpy">{{ $t('start') }}</button>
        </div>
    </div>
</template>

<script>
import { invoke } from "@tauri-apps/api/core";
export default {
    props: ["device"],
    methods: {
        async start_scrcpy() {
            const scrcpy_output = await invoke("run_scrcpy", { args: ["-s", this.device] });
        }
    }
}
</script>