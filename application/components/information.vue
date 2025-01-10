<template>
    <div class="card bg-base-200 w-full mb-8">
        <div class="card-body">
            <!--   Version Information   -->
            <p class="card-title"><span class="font-bold">SCRCPY+</span> <span>{{ version.scrcpy_plus }}</span></p>
            <p><span class="font-bold">SCRCPY</span>  <span>{{ version.scrcpy }}</span></p>
            <p><span class="font-bold">ADB</span>  <span>{{ version.adb }}</span></p>

            <!--   Buttons   -->
            <div class="card-actions">
                <button class="btn btn-primary text-white">
                    <icon name="discord" size="22x22" />
                    <span>Discord</span>
                </button>
                <NuxtLink to="/settings">
                    <button class="btn btn-primary text-white">
                        <icon name="gear" size="20x20" />
                        <span>{{  $t('settings') }}</span>
                    </button>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script>
import { invoke } from "@tauri-apps/api/core";
export default {
    data() {
        return {
            version: {
                scrcpy_plus: "",
                scrcpy: "",
                adb: "",
            }
        }
    },
    async mounted() {
        this.version = await invoke("get_dependency_versions");
    }
}
</script>