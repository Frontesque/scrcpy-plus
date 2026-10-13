<template>
    <div class="p-8">

        <!--   Header   -->
        <div class="card bg-base-200 w-full mb-8">
            <div class="p-8">
                <div class="flex">
                    <button class="btn btn-primary w-12" @click="$router.go(-1)">
                        <icon name="reply" size="45x45" />
                    </button>
                    <p class="text-3xl ml-4 mt-1">{{ $t('wcs_title') }}</p>
                </div>

                <p class="mt-8">{{ $t('wcs_subtitle') }}</p>
                <a class="text-primary" href="https://developer.android.com/tools/adb#connect-to-a-device-over-wi-fi" target="_blank">{{ $t('pairing_info') }}</a>
            </div>
        </div>

        <div class="card bg-base-200 w-full mb-8" v-if="step == 0">
            <div class="p-8">
                
                <p class="card-title">{{ $t('wifi_pairing') }}</p>
                <input type="text" id="pair_code" :placeholder="$t('code')" class="input input-bordered w-full mt-2" />
                <input type="text" id="pair_ip_port" :placeholder="$t('ip_and_port')" class="input input-bordered w-full my-2" />

                <div class="card-actions justify-end">
                    <button class="btn" rounded :disabled="pairingLoading" @click="step++">{{ $t('skip') }}</button>
                    <button class="btn btn-primary" :loading="pairingLoading" @click="pair">{{ $t('connect') }}</button>
                </div>

            </div>
        </div>

        <div class="card bg-base-200 w-full mb-8" v-if="step == 1">
            <div class="p-8">
                
                <p class="card-title">{{ $t('connecting') }}</p>
                <input type="text" id="connect_ip_port" :placeholder="$t('ip_and_port')" class="input input-bordered w-full my-2" />

                <div class="card-actions justify-end">
                    <button class="btn" rounded :disabled="pairingLoading" @click="step--">{{ $t('back') }}</button>
                    <button class="btn btn-primary" :loading="pairingLoading" @click="connect">{{ $t('connect') }}</button>
                </div>

            </div>
        </div>

        <div class="card bg-base-200 w-full mb-8" v-if="step == 2">
            <div class="p-8">
                <center>
                    <icon name="link" size="50x50" />
                    <h1 class="text-2xl">{{ $t('success') }}</h1>
                </center>
            </div>
        </div>

    </div>
</template>

<style>
.v-input__slot {
    background: rgba(0,0,0,0) !important;
}
</style>

<script>
import { invoke } from "@tauri-apps/api/core";
export default {
    data() {
        return {
            notice: null,
            step: 0,
            connectingLoading: false,
        }
    },

    methods: {
        async pair() {
            const ip = document.getElementById("pair_ip_port").value;
            const pair_code = document.getElementById("pair_code").value;
            if (ip == "" || pair_code == "") return; // Ensure No Error

            const data = await invoke("exec_adb", { args: ["pair", ip, pair_code] });
            console.log(data);
            this.notice = data;
            if (data.includes("Successfully")) return this.step++;
        },

        async connect() {
            const ip = document.getElementById("connect_ip_port").value;
            if (ip == "") return; // Ensure No Error

            const data = await invoke("exec_adb", { args: ["connect", ip] });
            console.log(data);
            this.notice = data;
            if (data.includes("connected")) {
                this.step++;
                setTimeout(() => {
                    this.$router.go(-1)
                }, 2000)
            };
        }
    }
}
</script>