<template>
    <div>
        <!--   Add Flag Dialog (Modal)   -->
        <dialog id="flag_builder_modal" class="modal">
            <div class="modal-box bg-base-300">
                <h3 class="text-lg font-bold">Add Flag</h3>
                
                <select class="select select-bordered w-full" id="select_arg">
                    <option disabled selected>Select a flag...</option>
                    <option v-for="item, i in args" :value="i">
                        <span>{{ item.arg }}:</span>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span>{{ item.description }}</span>
                    </option>
                </select>

                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn mr-2">Close</button>
                        <button class="btn btn-primary text-white" @click="add_flag()">Add</button>
                    </form>
                </div>
            </div>
        </dialog>

        <!--   Main Card   -->
        <div class="card bg-base-200 w-full mb-8">
            <div class="card-body">
                <p class="card-title text-white">SCRCPY</p>

                <!--   Active Flags Renderer   -->
                <p class="mt-8 text-white">Flags</p>
                <div v-for="arg, i in active_args">
                    <div v-if="arg.type === 'boolean'" class="flex">
                        <input type="checkbox" checked="checked" class="checkbox checkbox-primary" @change="remove_flag(i)" />
                        <div class="ml-2">
                            <p class="text-white">{{ arg.arg }}</p>
                            <p>{{ arg.description }}</p>
                        </div>
                    </div>
                </div>

                <!--   Add Flag Button   -->
                <button class="btn bg-base-300 text-white" onclick="flag_builder_modal.showModal()">
                    <icon name="plus" size="20x20" />
                    <span>Add Flag</span>
                </button>

                <!--   Start Button   -->
                <button class="btn btn-primary text-white mt-16" @click="start_scrcpy">
                    <icon name="play" size="20x20" />
                    <span>{{ $t('start') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { invoke } from "@tauri-apps/api/core";
export default {
    props: ["device"],
    data() {
        return {
            active_args: new Array(),

            args: [
                { type: "boolean", arg: "--turn-screen-off",         description: "Turn off the screen on the physical device" },
                { type: "boolean", arg: "--no-audio",                description: "Disable streaming audio from the device" },
                { type: "boolean", arg: "--stay-awake",              description: "Prevent the device from sleeping" },
                { type: "boolean", arg: "--no-control",              description: "Disable mouse/keyboard passthrough" },
                { type: "boolean", arg: "--disable-screensaver",     description: "What it says" },
                { type: "boolean", arg: "--otg",                     description: "Simulate physical hardware connections for input devices" },
                { type: "boolean", arg: "--forward-all-clicks",      description: "Pass all mouse actions to the device" },
                { type: "boolean", arg: "--power-off-on-close",      description: "Turn off the screen when exiting the application" },
                { type: "boolean", arg: "--always-on-top",           description: "Make scrcpy always the foreground window" },
                { type: "boolean", arg: "--prefer-text",             description: "By default, letters are injected using key events, so that the keyboard behaves as expected in games (typically for WASD keys). But this may cause issues." },
                { type: "boolean", arg: "--raw-key-events",          description: "The opposite of 'prefer text'" },
                { type: "boolean", arg: "--no-key-repeat",           description: "By default, holding a key down generates repeated key events. This can cause performance problems in some games, where these events are useless anyway." },
                { type: "boolean", arg: "--show-touches",            description: "Show physical touches and clicks" },
                { type: "boolean", arg: "--lock-video-orientation",  description: "Prevent the device screen from rotating." },
            ]
        }
    },
    methods: {
        add_flag() {
            const index_of_arg_to_add = document.getElementById("select_arg").value;
            const arg_to_add = this.args[index_of_arg_to_add];
            this.active_args.push(arg_to_add);
        },
        async remove_flag(index) { // This function is so complicated to prevent graphical issues with how nuxt renders removing items from lists
            let new_list = this.active_args;
            new_list.splice(index, 1);
            this.active_args = new Array();
            await new Promise(r => setTimeout(r, 1));
            this.active_args = new_list;
        },
        async start_scrcpy() {
            let scrcpy_start_args = ["-s", this.device];

            for (const i in this.active_args) {
                scrcpy_start_args.push(this.active_args[i].arg);
            }

            const scrcpy_output = await invoke("run_scrcpy", { args: scrcpy_start_args });
        },
    }
}
</script>