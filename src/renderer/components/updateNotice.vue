<template>
    <v-alert text color="primary" v-model="updateAvailable" style="margin: 2em; border-radius: 1.5em;">
        <h3>Update Available</h3>
        <div style="color: #999;">A new version of SCRCPY+ is ready to be downloaded</div>
        <div>
            <span>{{ currentVersion }}</span>
            <v-icon style="margin-right: 0; transform: translateY(-10%);" color="primary">mdi-arrow-right</v-icon>
            <span>{{ latestVersion }}</span>
        </div>
        <div style="display: flex;">
            <v-spacer />
            <v-btn rounded class="primaryButton" @click="open"><v-icon>mdi-download</v-icon>Download</v-btn>
        </div>
    </v-alert>
</template>

<script>
export default {
    data() {
        return {
            updateAvailable: false,
            currentVersion: new String(),
            latestVersion: new String(),
            repo: []
        }
    },
    async mounted() {
        this.currentVersion = process.env.version;
        this.repo = await this.$axios.$get(process.env.releasesUrl).catch(err => console.log(err));
        this.latestVersion = this.repo[0].name;
        
        const latest = this.latestVersion.split(".");
        const current = this.currentVersion.split(".");
        for (const i in latest) {
            if (latest[i] > current[i]) {
                console.log("UPDATE AVAILABLE")
                return this.updateAvailable = true;
            }
        }
    },

    methods: {
        open() {
            require('electron').shell.openExternal(this.repo[0].html_url)
        }
    }
}
</script>
