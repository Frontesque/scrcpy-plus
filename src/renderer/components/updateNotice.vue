<template>
    <v-dialog v-model="updateAvailable" width="500">
        <v-card>
            <v-card-title class="text-h5 grey darken-3">Update Available</v-card-title>
            <v-card-text style="margin-top: 2em;">A new version of SCRCPY+ is ready to be downloaded at your next convenience!</v-card-text>
            <v-card-text>
                <center>
                    <span>{{ currentVersion }}</span>
                    <v-icon>mdi-arrow-right</v-icon>
                    <span>{{ latestVersion }}</span>
                </center>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn text @click="updateAvailable = false">Later</v-btn>
                <v-btn text color="primary" @click="open">Download</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
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