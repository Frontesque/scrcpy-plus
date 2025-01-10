<template>
    <div class="p-8">
        <update_check />
        <information />
        <devices @device="set_active_device" />
        <scrcpy_config v-if="active_device" :device="active_device" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            active_device: false
        }
    },
    methods: {
        set_active_device(serial) {
            this.active_device = serial;
        }
    }
}
</script>