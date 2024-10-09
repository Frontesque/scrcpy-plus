<template>
  <div>

    <section style="margin-top: 0;" v-if="running">
      <h2>SCRCPY Settings</h2>
      <center>SCRCPY is currently running</center>
    </section>

    <section style="margin-top: 0;" v-if="!running">
      <h2>SCRCPY Settings</h2>


      <!--   Standard Actions   -->
      <v-list-item v-for="(item, i) in args" :key="i">
        <div style="display: flex;">
          
          <v-checkbox
            v-model="selectedArgs"
            :value="item"
            :label="item.arg.replace(/-/g,' ')"
            persistent-hint
            :hint="item.description"
          />

        </div>
      </v-list-item>
      <!--   End Standard Actions   -->

      <!--   Advanced Actions Wrapper   -->
      <v-expansion-panels style="margin-top: 1em;">
        <v-expansion-panel class="rounded-xl" style="background-color: rgba(0,0,0, 0.25);">
          <v-expansion-panel-header>Advanced</v-expansion-panel-header>
          <v-expansion-panel-content>



            <!--   Sliders   -->
            <div>Video Bitrate {{ bitrate }}M</div>
            <v-slider v-model="bitrate" max="64" min="1" hint="A higher bitrate creates a clearer image but may increase lag"      dense persistent-hint />
            <!--   End Sliders   -->




            <!--   Advanced Actions   -->
            <v-list-item v-for="(item, i) in advArgs" :key="i" style="padding: 0;">
              <div style="display: flex;">

                <v-checkbox
                  v-model="selectedArgs"
                  :value="item"
                  :label="item.arg.replace(/-/g,' ')"
                  persistent-hint
                  :hint="item.description"
                />

              </div>
            </v-list-item>
            <!--   End Advanced Actions   -->

          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!--   End Advanced Actions Wrapper   -->


      <v-card-actions style="margin-top: 1em;">
        <v-spacer />
        <v-btn @click="scrcpy()" rounded class="primaryButton" :disabled="loading" :loading="loading">Start SCRCPY</v-btn>
      </v-card-actions>
    </section>


    <!--   Error Dialog   -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey darken-3">An error has occurred</v-card-title>

        <v-card-text v-text="dialogText" style="margin-top: 2em;" />

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn rounded class="primaryButton" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--   End Error Dialog   -->

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
        
        //---   Save SCRCPY Flags   ---//
        if (localStorage.getItem("setting.save_scrcpy_settings") == 'true') localStorage.setItem('scrcpy_settings', JSON.stringify(this.selectedArgs));
        //-----------------------------//

        this.$execute(`scrcpy --video-bit-rate ${this.bitrate}M`+flags)
          .catch(err => {
            //if (typeof err != "object" && err.startsWith("INFO:")) return; // Catch information outputs
            if (err.startsWith("WARN:")) return; // Catch default close
            console.log(err)
            this.dialog = true;
            this.dialogText = err;
          })
          .then(e => {
            this.running = false;
          });

          setTimeout(() => {
            this.loading = false;
            this.running = true;
          }, 1000);
        
    }
  },

  mounted() {
    if (localStorage.getItem("setting.save_scrcpy_settings") == 'true') {
      const data = JSON.parse(localStorage.getItem("scrcpy_settings") || '[]');
      for (const i in data) {
        this.selectedArgs.push(data[i]);
      }
    }
  },
  
  data() {
    return {
      loading: false,
      running: false,

      dialog: false,
      dialogText: null,

      selectedArgs: [],

      bitrate: 8,

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
          arg: "--disable-screensaver",
          description: "What it says"
        }
      ],
      advArgs: [
        {
          arg: "--otg",
          description: "Simulate physical hardware connections for input devices"
        },
        {
          arg: "--forward-all-clicks",
          description: "Pass all mouse actions to the device"
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
        {
          arg: "--show-touches",
          description: "Show physical touches and clicks"
        },
        {
          arg: "--lock-video-orientation",
          description: "Prevent the device screen from rotating."
        },
      ]
    }
  },
}
</script>
