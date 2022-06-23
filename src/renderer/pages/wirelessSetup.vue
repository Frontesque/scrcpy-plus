<template>
    <div>
        <section>
            <h1>Wireless Connection Setup</h1>
            <div style="color: #999">Android 11+ is required for a wireless connection to be established.</div>
            <a @click="$utils.openInternal('https://developer.android.com/studio/command-line/adb')">View More Information on Pairing Here</a>
            <v-alert text type="warning">Wireless Connection is still under development and may not work properly on your device.</v-alert>
            <v-btn style="margin-top: 1em;" rounded color="primary" @click="$router.go(-1)">Cancel</v-btn>
        </section>

        <section v-if="step == 0">
            <h1>Pairing</h1>
            <center><h3 style="margin-top: 1em;">Wi-Fi pairing code</h3></center>
            <v-otp-input length="6" v-model="pairCode" :disabled="pairingLoading" />
            <v-text-field
                style="margin-top: 1em;"
                label="IP address & Port"
                placeholder="ex. 192.168.1.10:42801"
                outlined
                rounded
                v-model="ip"
                :disabled="pairingLoading"
            />
            <v-alert text type="error" v-if="pairingNotice">{{ pairingNotice }}</v-alert>
            <v-card-actions>
                <v-spacer />
                <v-btn rounded :disabled="pairingLoading" @click="step++">Skip</v-btn>
                <v-btn rounded :loading="pairingLoading" color="primary" @click="pair">Connect</v-btn>
            </v-card-actions>
        </section>

        <section v-if="step == 1">
            <h1>Connecting</h1>
            <v-text-field
                style="margin-top: 1em;"
                label="IP address & Port"
                placeholder="ex. 192.168.1.10:42801"
                outlined
                rounded
                v-model="ip2"
                :disabled="connectingLoading"
            />
            <v-alert text type="error" v-if="connectingNotice">{{ connectingNotice }}</v-alert>
            <v-card-actions>
                <v-spacer />
                <v-btn rounded :disabled="connectingLoading" @click="step--">Back</v-btn>
                <v-btn rounded :loading="connectingLoading" color="primary" @click="connect">Connect</v-btn>
            </v-card-actions>
        </section>

        <section v-if="step == 2">
            <center>
                <v-icon size="5em">mdi-cellphone-check</v-icon>
                <h1>Success!</h1>
                <v-btn style="margin-top: 1em;" rounded color="primary" @click="$router.go(-1)">Return Home</v-btn>
            </center>
        </section>

    </div>
</template>

<style>
.v-input__slot {
    background: rgba(0,0,0,0) !important;
}
</style>

<script>
export default {
    data() {
        return {
            pairCode: "",
            ip: "",
            pairingLoading: false,
            pairingNotice: null,
            step: 2,

            ip2: "",
            connectingLoading: false,
            connectingNotice: ""
        }
    },

    methods: {
        async pair() {
            this.pairingLoading = true;
            const data = await this.$scrcpy.execute(`adb pair ${this.ip} ${this.pairCode}`);
            this.pairingNotice = data;
            this.pairingLoading = false;
            if (data.includes("Successfully")) return this.step++;
        },

        async connect() {
            this.connectingLoading = true;
            const data = await this.$scrcpy.execute(`adb connect ${this.ip2}`);
            this.connectingNotice = data;
            this.connectingLoading = false;
            if (data.includes("connected")) return this.step++;
        }
    }
}
</script>