<template>
    <div>

        <section>
            <v-card-title>
                <back />
                Settings
            </v-card-title>
        </section>

        <section>
            <v-switch inset label="Disable Device Information" v-model="deviceInformation" />
            <v-switch inset label="Disable Tools" v-model="tools" />
            <v-switch inset label="Disable ADB Quick Actions" v-model="adbQuickActions" />
        </section>

    </div>
</template>

<script>
export default {
    data() {
        return {
            deviceInformation: false,
            tools: false,
            adbQuickActions: false,
        }
    },

    watch: {
        deviceInformation(newVal) { localStorage.setItem("deviceInformation", !newVal); },
        tools(newVal) { localStorage.setItem("tools", !newVal); },
        adbQuickActions(newVal) { localStorage.setItem("adbQuickActions", !newVal); }
    },

    mounted() {
        this.deviceInformation = localStorage.getItem("deviceInformation") == 'true' ? false : true;
        this.tools = localStorage.getItem("tools") == 'true' ? false : true;
        this.adbQuickActions =  localStorage.getItem("adbQuickActions") == 'true' ? false : true;
    }

}
</script>