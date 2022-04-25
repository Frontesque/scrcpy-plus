<template>
  <div>

    <section>
      <h3>SCRCPY Settings</h3>

      <v-list-item v-for="(item, i) in args" :key="i">
        <div style="display: flex;">
          <v-checkbox v-model="selectedArgs" :value="item" />

          <div style="display: block; transform: translateY(25%);">
            <v-list-item-title v-text="item.arg.replace(/-/g,' ')" />
            <p v-text="item.description" class="grey--text" />
          </div>
        </div>
      </v-list-item>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="scrcpy()" color="primary" class="rounded-xl" :disabled=loading :loading=loading>Start SCRCPY</v-btn>
      </v-card-actions>
    </section>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey darken-1">An error has occured</v-card-title>

        <v-card-text v-text="dialogText" style="margin-top: 2em;" />

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
export default {
  
  methods: {

    async scrcpy() {
        this.loading = true; // Disable 'Start' Button

        let flags = new String();
        for (const i in this.selectedArgs) {
          flags += ' '+this.selectedArgs[i].arg;
        }
        //console.log("scrcpy"+flags);

        this.$scrcpy.execute("scrcpy"+flags)
          .catch((err) => {
            this.dialog = true;
            this.dialogText = err;
          })

        setTimeout(() => { this.loading = false; }, 2000) // Enable 'Start' Button
        
    }

  },
  
  data() {
    return {
      loading: false,

      dialog: false,
      dialogText: null,

      selectedArgs: [],

      args: [
        {
          arg: "--turn-screen-off",
          description: "Turn off the screen on the physical device"
        },
        {
          arg: "--stay-awake",
          description: "Prevent the device from sleeping"
        },
        {
          arg: "--no-control",
          description: "Disable mouse/keyboard passthrough"
        },
        {
          arg: "--otg",
          description: "(LINUX ONLY) Simulate physical hardware connections for input devices"
        },
        {
          arg: "--forward-all-clicks",
          description: "Pass all mouse actions to the device"
        },
        {
          arg: "--disable-screensaver",
          description: "What it says"
        },
        {
          arg: "--show-touches",
          description: "Show physical touches and clicks"
        },
        {
          arg: "--power-off-on-close",
          description: "Turn off the screen when exiting the application"
        },
        {
          arg: "--always-on-top",
          description: "Make scrcpy always the foreground window"
        },
        {
          arg: "--prefer-text",
          description: "By default, letters are injected using key events, so that the keyboard behaves as expected in games (typically for WASD keys). But this may cause issues."
        },
        {
          arg: "--raw-key-events",
          description: "The opposite of 'prefer text'"
        },
        {
          arg: "--no-key-repeat",
          description: "By default, holding a key down generates repeated key events. This can cause performance problems in some games, where these events are useless anyway."
        },
      ]
    }
  },
}
</script>
