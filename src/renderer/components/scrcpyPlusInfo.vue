<template>
    <div>

      <!--   Error Alert   -->
      <v-alert text color="error" v-model="startupError" style="margin: 2em; border-radius: 1em;">
        <h3>Error Starting SCRCPY+</h3>
        <div style="color: #999;">This error could be caused by <b>{{ reason }}</b> not being properly installed on your OS.</div>
        <div style="color: #999; margin-top: 1em;">
          <b>More Details</b>
          <p style="white-space: pre-wrap;">{{ error }}</p>
        </div>
      </v-alert>

      <section>
        <h1>SCRCPY+ <span style="color: #999">{{ version }}</span></h1>
        <h4>SCRCPY <span style="color: #999">{{ scrcpyVersion }}</span></h4>
        <h4>ADB <span style="color: #999">{{ adbVersion }}</span></h4>
        <v-card-actions style="padding: 0.5em 0 0 0;">
          <v-btn rounded @click="$utils.openExternal('https://discord.gg/APQyKz9e9w')" class="primaryButton">
            <img src="@/assets/discord-icon.svg" style="width: 1.8em; margin-right: 1em;" />
            Discord
          </v-btn>
          <v-btn rounded to="/settings" class="primaryButton">
            <v-icon>mdi-cog</v-icon>
            Settings
          </v-btn>
        </v-card-actions>
      </section>

    </div>
</template>

<script>
const env = process.env;

export default {
  data() {
    return {
      version: env.version,
      scrcpyVersion: localStorage.getItem("scrcpyVersion"),
      adbVersion: localStorage.getItem("adbVersion"),

      startupError: false,
      error: new String(),
      reason: "SCRCPY or ADB"
    }
  },
  async mounted() {
    await this.$execute("adb --version")
    .then(data => {
      const version = data.split('\n')[1].split(" ")[1].trim();
      this.adbVersion = version;
      localStorage.setItem("adbVersion", version);
    })
    .catch(err => this.errHandler(err));

    await this.$execute("scrcpy --version")
    .then(data => {
      const version = data.split('\n')[0].split(" ")[1].trim();
      this.scrcpyVersion = version;
      localStorage.setItem("scrcpyVersion", version);
    })
    .catch(err => this.errHandler(err));
  },

  methods: {
    errHandler(err) {
        this.startupError = true;
        this.error = err;

        if (err.toString().includes("scrcpy")) return this.reason = "SCRCPY";
        if (err.toString() .includes("adb")) return this.reason = "ADB";
    }
  }

}
</script>
