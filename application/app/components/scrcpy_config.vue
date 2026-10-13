<template>
    <div class="card bg-base-200 w-full mb-8">
        <div class="card-body">
            <p class="card-title text-white">SCRCPY</p>

            <p class="mt-8 text-white">{{ $t('launch_options') }}</p>
            <label v-for="option in options" :key="option.arg" class="flex cursor-pointer">
                <input type="checkbox" class="checkbox checkbox-primary" :value="option.arg" v-model="active_args" />
                <div class="ml-2">
                    <p class="text-white">{{ $t(`scrcpy_options.${option.arg}`) }}</p>
                    <p>{{ $t(`scrcpy_flags.${option.arg}`) }}</p>
                </div>
            </label>

            <button class="btn btn-primary text-white mt-16" @click="start_scrcpy">
                <icon name="play" size="20x20" />
                <span>{{ $t('start') }}</span>
            </button>
        </div>
    </div>
</template>

<script>
import { invoke } from "@tauri-apps/api/core";
export default {
    props: ["device"],
    data() {
        return {
            active_args: [],

            options: [
                { arg: "--turn-screen-off" },
                { arg: "--no-audio" },
                { arg: "--stay-awake" },
                { arg: "--no-control" },
                { arg: "--disable-screensaver" },
                { arg: "--otg" },
                { arg: "--forward-all-clicks" },
                { arg: "--power-off-on-close" },
                { arg: "--always-on-top" },
                { arg: "--prefer-text" },
                { arg: "--raw-key-events" },
                { arg: "--no-key-repeat" },
                { arg: "--show-touches" },
                { arg: "--lock-video-orientation" },
            ]
        }
    },
    methods: {
        async start_scrcpy() {
            let scrcpy_start_args = ["-s", this.device];

            scrcpy_start_args.push(...this.active_args);

            const scrcpy_output = await invoke("run_scrcpy", { args: scrcpy_start_args });
        },
    }
}
</script>