<template>
    <div class="card bg-base-200 w-full mb-8">
        <div class="card-body">
            <p class="card-title text-white">SCRCPY</p>

            <p class="mt-8 text-white">{{ $t('launch_options') }}</p>
            <label v-for="option in basic_options" :key="option.arg" class="flex cursor-pointer">
                <input type="checkbox" class="checkbox checkbox-primary" :value="option.arg" v-model="active_args" />
                <div class="ml-2">
                    <p class="text-white">{{ $t(`scrcpy_options.${option.arg}`) }}</p>
                    <p>{{ $t(`scrcpy_flags.${option.arg}`) }}</p>
                </div>
            </label>

            <div class="collapse collapse-arrow bg-base-300">
                <input type="checkbox" />
                <div class="collapse-title text-white">{{ $t('advanced') }}</div>
                <div class="collapse-content space-y-3">
                    <div>
                        <p class="text-white">{{ $t('video_bitrate') }}: {{ bitrate }} Mbps</p>
                        <input type="range" min="1" max="32" step="1" class="range range-primary range-sm" :value="bitrate" @input="set_bitrate" />
                    </div>
                    <label v-for="option in advanced_options" :key="option.arg" class="flex cursor-pointer">
                        <input type="checkbox" class="checkbox checkbox-primary" :value="option.arg" v-model="active_args" />
                        <div class="ml-2">
                            <p class="text-white">{{ $t(`scrcpy_options.${option.arg}`) }}</p>
                            <p>{{ $t(`scrcpy_flags.${option.arg}`) }}</p>
                        </div>
                    </label>
                </div>
            </div>

            <button class="btn btn-primary text-white mt-16" :disabled="running[device]" @click="start_scrcpy">
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
    setup() {
        // Shared state so running sessions survive navigating between pages
        const running = useState("scrcpy_running", () => ({}));
        const bitrate = useState("scrcpy_bitrate", () => {
            const saved = Number(localStorage.getItem("scrcpyplus.bitrate"));
            return saved >= 1 && saved <= 32 ? saved : 8;
        });
        return { running, bitrate };
    },
    data() {
        return {
            active_args: [],

            basic_options: [
                { arg: "--turn-screen-off" },
                { arg: "--no-audio" },
                { arg: "--stay-awake" },
                { arg: "--no-control" },
            ],
            advanced_options: [
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
        set_bitrate(event) {
            // Ignore events fired while the collapsed drawer hides the slider
            if (event.target.offsetWidth === 0) return;
            this.bitrate = Number(event.target.value);
            localStorage.setItem("scrcpyplus.bitrate", this.bitrate);
        },
        async start_scrcpy() {
            let scrcpy_start_args = ["-s", this.device];

            scrcpy_start_args.push(...this.active_args);
            if (this.bitrate !== 8) scrcpy_start_args.push(`--video-bit-rate=${this.bitrate}M`);

            const device = this.device;
            this.running[device] = true;
            try {
                await invoke("run_scrcpy", { args: scrcpy_start_args });
            } finally {
                this.running[device] = false;
            }
        },
    }
}
</script>