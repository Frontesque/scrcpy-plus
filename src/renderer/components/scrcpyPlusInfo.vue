<template>
    <div>

        <section>
        <h1>SCRCPY+ ({{ version }})</h1>
        <h4>SCRCPY ({{ scrcpyVersion }})</h4>
        <h4>ADB ({{ adbVersion }})</h4>
        <v-btn style="margin-top: 1em;" rounded color="primary" to="/changelog">SCRCPY+ Changelog</v-btn>
        </section>

        <!--   Error Dialog   -->
        <v-dialog v-model="dialog" width="500" persistent>
            <v-card>
                <v-card-title class="text-h5 grey darken-3">Error Starting SCRCPY+</v-card-title>
                <v-card-text v-text="error" style="margin-top: 2em;" />
                <v-alert text type="error" style="margin: 0 2em 0 2em;">This error could be caused by {{ reason }} not being properly installed on your OS.</v-alert>
                <br />
            </v-card>
        </v-dialog>
        <!--   End Error Dialog   -->

    </div>
</template>

<script>
const env = process.env;

export default {
  data() {
    return {
      version: env.version,
      scrcpyVersion: new String(),
      adbVersion: new String(),

      dialog: false,
      error: new String(),
      reason: "SCRCPY or ADB"
    }
  },
  async mounted() {
    await this.$scrcpy.execute("adb --version")
    .then(data => {
        this.adbVersion = data.split('\n')[1].split(" ")[1].trim();
    })
    .catch(err => this.errHandler(err));

    await this.$scrcpy.execute("scrcpy --version")
    .then(data => {
        this.scrcpyVersion = data.split('\n')[0].split(" ")[1].trim();
    })
    .catch(err => this.errHandler(err));
  },

  methods: {
    errHandler(err) {
        this.dialog = true;
        this.error = err;

        if (err.toString().includes("scrcpy")) return this.reason = "SCRCPY";
        if (err.toString() .includes("adb")) return this.reason = "ADB";
    }
  }

}
</script>