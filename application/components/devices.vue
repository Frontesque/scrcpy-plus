<template>
    <div class="card bg-base-200 w-full mb-8">
        <div class="card-body">
            <!--   Version Information   -->
            <div class="flex">
                <p class="card-title">{{ $t('devices') }}</p>
                <NuxtLink to="/wireless_setup">
                    <button class="btn btn-primary text-white max-h-8 min-h-8 h-8">
                        <icon size="18x18" name="wifi" />
                        <span>{{ $t('connect_wirelessly') }}</span>
                    </button>
                </NuxtLink>
            </div>

            <div v-if="devices.length > 0">
                <div role="tablist" class="tabs tabs-boxed">
                    <a role="tab" class="tab" :class="active_device == device ? 'tab-active' : ''" v-for="device in devices" @click="set_active(device)">{{ device }}</a>
                </div>

                <div v-if="active_device">
                    <p class="mt-4 text-white flex"><icon class="mt-1 mr-2" size="18x18" name="mobile" /> {{ $t('model') }}</p>
                    <p>{{ active_device_information.model }} ({{ active_device_information.model_id.trim() }})</p>
                    <p class="mt-4 text-white flex"><icon class="mt-1 mr-2" size="18x18" name="android" /> {{ $t('android_version') }}</p>
                    <p>{{ active_device_information.version }} (API {{ active_device_information.sdk.trim() }})</p>
                    <p class="mt-4 text-white flex"><icon class="mt-1 mr-2" size="18x18" name="wrench" /> {{ $t('build_number') }}</p>
                    <p>{{ active_device_information.build }}</p>
                    <p class="mt-4 text-white flex"><icon class="mt-1 mr-2" size="18x18" name="shield" /> {{ $t('security_patch') }}</p>
                    <p>{{ active_device_information.security_patch }}</p>
                </div>
                <p v-else>{{ $t('no_device') }}</p>
            </div>
            <div v-else>
                <p>{{ $t('no_device2') }}</p>
            </div>

        </div>
    </div>
</template>

<script>
import { invoke } from "@tauri-apps/api/core";
export default {
    emits: ['device'],
    data() {
        return {
            devices: new Array(),
            active_device: undefined,
            active_device_information: {
                model: "",
                model_id: "",
                version: "",
                sdk: "",
                build: "",
                security_patch: ""
            }
        }
    },
    methods: {

        async set_active(device) {
            await this.get_device_info(device);
            this.$emit('device', device);
            this.active_device = device;
        },

        // The majority of this function should be converted to rust
        // It is currently a javascript function to allow this program to be written faster
        async get_device_info(serial) {
            this.active_device_information.model            = await invoke("exec_adb", { args: ["-s", serial, "shell", "getprop", "ro.product.model"] });
            this.active_device_information.model_id         = await invoke("exec_adb", { args: ["-s", serial, "shell", "getprop", "ro.product.device"] });
            this.active_device_information.version          = await invoke("exec_adb", { args: ["-s", serial, "shell", "getprop", "ro.build.version.release"] });
            this.active_device_information.sdk              = await invoke("exec_adb", { args: ["-s", serial, "shell", "getprop", "ro.build.version.sdk"] });
            this.active_device_information.build            = await invoke("exec_adb", { args: ["-s", serial, "shell", "getprop", "ro.build.id"] });
            this.active_device_information.security_patch   = await invoke("exec_adb", { args: ["-s", serial, "shell", "getprop", "ro.build.version.security_patch"] });
            return;
        },

        // The majority of this function should be converted to rust
        // It is currently a javascript function to allow this program to be written faster
        async refresh_devices() {
            const devices = await invoke("exec_adb", { args: ["devices"] });
            const raw_devices_array = devices.split("\n");
            let devices_output = new Array();
            for (const i in raw_devices_array) {
                const entry = raw_devices_array[i];
                if (i == 0) continue;
                if (entry == "") continue;
                if (entry == "\r") continue;
                if (entry.includes("\t")) {
                    devices_output.push(entry.split("\t")[0]);
                } else {
                    devices_output.push(entry);
                }
            }
            this.devices = devices_output;
        }
    },
    mounted() {
        this.refresh_devices();
        this.interval = setInterval(this.refresh_devices, 5000);
    },
    beforeDestroy() {
      clearInterval(this.interval); // Prevent Memory Leak
    }
}
</script>