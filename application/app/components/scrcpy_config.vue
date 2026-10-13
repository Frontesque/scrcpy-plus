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
                <div class="collapse-title text-white">{{ $t('display_settings') }}</div>
                <div class="collapse-content space-y-3">
                    <label class="flex cursor-pointer">
                        <input type="checkbox" class="checkbox checkbox-primary" v-model="custom_window_name" />
                        <p class="ml-2 text-white">{{ $t('custom_window_name') }}</p>
                    </label>
                    <input v-if="custom_window_name" type="text" class="input input-bordered w-full" v-model="window_title" />
                    <div>
                        <p class="text-white">{{ $t('video_bitrate') }}: {{ bitrate }} Mbps</p>
                        <input type="range" min="1" max="32" step="1" class="range range-primary range-sm" :value="bitrate" @input="set_bitrate" />
                    </div>
                    <label v-for="option in window_options" :key="option.arg" class="flex cursor-pointer">
                        <input type="checkbox" class="checkbox checkbox-primary" :value="option.arg" v-model="active_args" />
                        <div class="ml-2">
                            <p class="text-white">{{ $t(`scrcpy_options.${option.arg}`) }}</p>
                            <p>{{ $t(`scrcpy_flags.${option.arg}`) }}</p>
                        </div>
                    </label>
                    <label class="flex cursor-pointer">
                        <input type="checkbox" class="checkbox checkbox-primary" v-model="custom_crop" />
                        <p class="ml-2 text-white">{{ $t('custom_crop') }}</p>
                    </label>
                    <div v-if="custom_crop" class="grid grid-cols-2 gap-2">
                        <label v-for="field in ['width', 'height', 'x', 'y']" :key="field">
                            <span class="text-white">{{ $t(`crop_${field}`) }}</span>
                            <input type="number" min="0" step="1" class="input input-bordered w-full" v-model="crop[field]" />
                        </label>
                    </div>
                    <label class="flex cursor-pointer">
                        <input type="checkbox" class="checkbox checkbox-primary" :disabled="virtual_display" v-model="custom_display_id" />
                        <p class="ml-2 text-white">{{ $t('custom_display_id') }}</p>
                    </label>
                    <input v-if="custom_display_id && !virtual_display" type="number" min="0" step="1" class="input input-bordered w-full" v-model="display_id" />
                    <label class="flex cursor-pointer">
                        <input type="checkbox" class="checkbox checkbox-primary" v-model="virtual_display" />
                        <div class="ml-2">
                            <p class="text-white">{{ $t('virtual_display') }}</p>
                            <p>{{ $t('virtual_display_desc') }}</p>
                        </div>
                    </label>
                    <input v-if="virtual_display" type="text" class="input input-bordered w-full" placeholder="1920x1080/420" v-model="virtual_display_size" />
                </div>
            </div>

            <div class="collapse collapse-arrow bg-base-300">
                <input type="checkbox" />
                <div class="collapse-title text-white">{{ $t('advanced') }}</div>
                <div class="collapse-content space-y-3">
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
            custom_window_name: false,
            window_title: "",
            custom_display_id: false,
            custom_crop: false,
            crop: { width: "", height: "", x: "0", y: "0" },
            display_id: "",
            virtual_display: false,
            virtual_display_size: "",

            basic_options: [
                { arg: "--turn-screen-off" },
                { arg: "--no-audio" },
                { arg: "--stay-awake" },
                { arg: "--no-control" },
                { arg: "--keyboard=uhid" },
            ],
            window_options: [
                { arg: "--lock-video-orientation" },
            ],
            advanced_options: [
                { arg: "--no-video" },
                { arg: "--disable-screensaver" },
                { arg: "--otg" },
                { arg: "--forward-all-clicks" },
                { arg: "--power-off-on-close" },
                { arg: "--always-on-top" },
                { arg: "--prefer-text" },
                { arg: "--raw-key-events" },
                { arg: "--no-key-repeat" },
                { arg: "--show-touches" },
            ]
        }
    },
    watch: {
        active_args() { this.save_config(); },
        custom_flags() { this.save_config(); },
        custom_window_name() { this.save_config(); },
        custom_display_id() { this.save_config(); },
        custom_crop() { this.save_config(); },
        crop: { handler() { this.save_config(); }, deep: true },
        window_title() { this.save_config(); },
        display_id() { this.save_config(); },
        virtual_display() { this.save_config(); },
        virtual_display_size() { this.save_config(); },
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
                custom_window_name: this.custom_window_name,
                custom_display_id: this.custom_display_id,
                custom_crop: this.custom_crop,
                crop: this.crop,
                window_title: this.window_title,
                display_id: this.display_id,
                virtual_display: this.virtual_display,
                virtual_display_size: this.virtual_display_size,
                bitrate: this.bitrate,
            }));
        },
        load_config() {
            if (!this.remember_enabled()) return;
            try {
                const saved = JSON.parse(localStorage.getItem("scrcpyplus.scrcpy_config"));
                if (!saved) return;
                const known = [...this.basic_options, ...this.window_options, ...this.advanced_options].map(o => o.arg);
                if (Array.isArray(saved.active_args)) this.active_args = saved.active_args.filter(a => known.includes(a));
                if (typeof saved.custom_flags == "string") this.custom_flags = saved.custom_flags;
                this.custom_window_name = saved.custom_window_name === true;
                this.custom_display_id = saved.custom_display_id === true;
                this.custom_crop = saved.custom_crop === true;
                if (saved.crop && typeof saved.crop == "object") {
                    for (const k of ["width", "height", "x", "y"]) {
                        if (saved.crop[k] === "" || Number.isInteger(Number(saved.crop[k]))) this.crop[k] = String(saved.crop[k]);
                    }
                }
                if (typeof saved.window_title == "string") this.window_title = saved.window_title;
                if (saved.display_id === "" || Number.isInteger(Number(saved.display_id))) this.display_id = saved.display_id;
                if (typeof saved.virtual_display == "boolean") this.virtual_display = saved.virtual_display;
                if (typeof saved.virtual_display_size == "string") this.virtual_display_size = saved.virtual_display_size;
                if (saved.bitrate >= 1 && saved.bitrate <= 32) this.bitrate = saved.bitrate;
            } catch (e) {}
        },
        async start_scrcpy() {
            let scrcpy_start_args = ["-s", this.device];

            scrcpy_start_args.push(...this.active_args);
            if (this.custom_window_name && this.window_title.trim()) scrcpy_start_args.push(`--window-title=${this.window_title.trim()}`);
            const crop = this.crop;
            if (this.custom_crop && [crop.width, crop.height, crop.x, crop.y].every(v => v !== "" && v !== null)) {
                scrcpy_start_args.push(`--crop=${crop.width}:${crop.height}:${crop.x}:${crop.y}`);
            }
            if (this.virtual_display) {
                const size = this.virtual_display_size.trim();
                scrcpy_start_args.push(size ? `--new-display=${size}` : "--new-display");
            } else if (this.custom_display_id && this.display_id !== "" && this.display_id !== null) {
                scrcpy_start_args.push(`--display-id=${this.display_id}`);
            }
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