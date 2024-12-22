<template>
    <div>
        <section>
            <v-card-title><back />Wireless Connection Setup</v-card-title>
            <div class="accent--text">Android 11+ is required for a wireless connection to be established.</div>
            <a @click="$utils.openInternal('https://developer.android.com/studio/command-line/adb')">More information on pairing</a>
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
                @keydown.enter="pair"
            />
            <v-alert text type="error" v-if="pairingNotice">{{ pairingNotice }}</v-alert>
            <v-card-actions>
                <v-spacer />
                <v-btn rounded :disabled="pairingLoading" @click="pairQR">Pair with QRcode</v-btn>
                <v-btn rounded :disabled="pairingLoading" @click="step++">Skip</v-btn>
                <v-btn rounded :loading="pairingLoading" class="primaryButton" @click="pair">Connect</v-btn>
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
                @keydown.enter="connect()"
            />
            <v-alert text type="error" v-if="connectingNotice">{{ connectingNotice }}</v-alert>
            <v-card-actions>
                <v-spacer />
                <v-btn rounded :disabled="connectingLoading" @click="step--">Back</v-btn>
                <v-btn rounded :loading="connectingLoading" class="primaryButton" @click="connect">Connect</v-btn>
            </v-card-actions>
        </section>

        <section v-if="step == 2">
            <center>
                <v-icon size="5em">mdi-cellphone-check</v-icon>
                <h1>Success!</h1>
                <v-progress-linear color="primary" indeterminate style="margin-top: 1em;" />
            </center>
        </section>

        <section v-if="step == 3">
            <h1>Pairing</h1>
            <center class="mb-2">
                <h3 style="margin-top: 1em;">Wi-Fi pairing QR code</h3>
            </center>
            <QrCode :key="qrKey" :qrText="qrText" />
            <v-card-actions>
                <v-spacer />
                <v-btn rounded @click="refreshqrPairing">Refresh Code</v-btn>
                <v-btn rounded @click="qrPairing = false">Back</v-btn>
            </v-card-actions>
        </section>
    </div>
</template>

<style>
.v-input__slot {
    background: rgba(0,0,0,0) !important;
}
</style>

<script>
import QRCode from '../components/qrCode.vue'
export default {
    components: { QRCode },
    data() {
        const uniqueId = Math.floor(Math.random() * 1000000);
        const name = 'ADB_WIFI_' + uniqueId;
        const password = uniqueId;
        const qrText = `WIFI:T:ADB;S:${name};P:${password};;`;

        return {
            pairCode: "",
            ip: "",
            pairingLoading: false,
            pairingNotice: null,
            step: 0,

            ip2: "",
            connectingLoading: false,
            connectingNotice: "",

            qrText: qrText,
            qrKey: 0,
            qrPairing: false,
            qrPassword: password
        }
    },

    methods: {
        async pair() {
            if (this.ip == "" || this.pairCode == "") return; // Ensure No Error

            this.pairingLoading = true;
            const data = await this.$execute(`adb pair ${this.ip} ${this.pairCode}`);
            this.pairingNotice = data;
            this.pairingLoading = false;
            if (data.includes("Successfully")) return this.step++;
        },
        async pairQR() {
            this.step = 3;
            
            const devices = await this.mdnsSearch();
            if (this.qrPairing === false) return this.step = 0;

            const device = devices[0];
            const { ip, port } = device;

            await this.$execute("adb disconnect");
            const data = await this.$execute(`adb pair ${ip}:${port} ${this.qrPassword}`);
            if (data.includes("Successfully")) return this.step = 1;
        },
        async mdnsSearch() {
            this.qrPairing = true;
            const regex = /_adb-tls-pairing\._tcp\.\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d+)/g;

            while (this.qrPairing) {
                const data = await this.$execute(`adb mdns services`);

                const results = Array.from(data.matchAll(regex), match => ({
                    ip: match[1],
                    port: match[2]
                }));
                if (results.length) {
                    return results;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        },
        async refreshqrPairing() {
            this.qrPassword = Math.floor(Math.random() * 1000000);
            this.qrText = `WIFI:T:ADB;S:${'ADB_WIFI_' + this.qrPassword};P:${this.qrPassword};;`;
            this.qrKey++; 
        },
        async connect() {
            if (this.ip2 == "") return; // Ensure No Error

            this.connectingLoading = true;
            await this.$execute("adb disconnect"); // Prevent "Multiple Device" Connections
            const data = await this.$execute(`adb connect ${this.ip2}`);
            this.connectingNotice = data;
            this.connectingLoading = false;
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
