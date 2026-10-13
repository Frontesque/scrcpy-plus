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
                    <div>
                        <p class="text-white">{{ $t('custom_flags') }}</p>
                        <input type="text" class="input input-bordered w-full" placeholder="--max-size=1024 --crop=1224:1440:0:0" v-model="custom_flags" />
                    </div>
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
        const bitrate = useState("scrcpy_bitrate", () => 8);
        return { running, bitrate };
    },
    data() {
        return {
            active_args: [],
            custom_flags: "",

            basic_options: [
                { arg: "--turn-screen-off" },
                { arg: "--no-audio" },
                { arg: "--stay-awake" },
                { arg: "--no-control" },
                { arg: "--keyboard=uhid" },
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
    watch: {
        active_args() { this.save_config(); },
        custom_flags() { this.save_config(); },
        bitrate() { this.save_config(); },
    },
    created() {
        this.load_config();
    },
    methods: {
        set_bitrate(event) {
            // Ignore events fired while the collapsed drawer hides the slider
            if (event.target.offsetWidth === 0) return;
            this.bitrate = Number(event.target.value);
        },
        remember_enabled() {
            return localStorage.getItem("setting.save_scrcpy_config") == "true";
        },
        save_config() {
            if (!this.remember_enabled()) {
                localStorage.removeItem("scrcpyplus.scrcpy_config");
                return;
            }
            localStorage.setItem("scrcpyplus.scrcpy_config", JSON.stringify({
                active_args: this.active_args,
                custom_flags: this.custom_flags,
                bitrate: this.bitrate,
            }));
        },
        load_config() {
            if (!this.remember_enabled()) return;
            try {
                const saved = JSON.parse(localStorage.getItem("scrcpyplus.scrcpy_config"));
                if (!saved) return;
                const known = [...this.basic_options, ...this.advanced_options].map(o => o.arg);
                if (Array.isArray(saved.active_args)) this.active_args = saved.active_args.filter(a => known.includes(a));
                if (typeof saved.custom_flags == "string") this.custom_flags = saved.custom_flags;
                if (saved.bitrate >= 1 && saved.bitrate <= 32) this.bitrate = saved.bitrate;
            } catch (e) {}
        },
        async start_scrcpy() {
            let scrcpy_start_args = ["-s", this.device];

            scrcpy_start_args.push(...this.active_args);
            // Split on whitespace, keeping quoted segments together
            for (const m of this.custom_flags.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)) {
                scrcpy_start_args.push(m[1] ?? m[2] ?? m[3]);
            }
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