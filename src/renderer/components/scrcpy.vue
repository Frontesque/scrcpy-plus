<template>
  <div>

    <section>
      <h3>SCRCPY Settings</h3>

      <v-list-item v-for="(item, i) in args" :key="i">
        <div style="display: flex;">
          <v-checkbox v-model="selectedArgs" :value="item" />

          <div style="display: block; transform: translateY(25%);">
            <v-list-item-title v-text="item.arg.replace(/-/g,' ')" />
            <v-list-item-title v-text="item.description" class="grey--text" />
          </div>
        </div>
      </v-list-item>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="scrcpy()" color="primary" class="rounded-xl">Start SCRCPY</v-btn>
      </v-card-actions>
    </section>

  </div>
</template>

<script>
const { exec } = require("child_process");

export default {
  
  methods: {
    run(cmd, callback) {
        exec('cd bin/scrcpy&'+cmd, (error, stdout, stderr) => {
            return callback(error || stderr || stdout);
        });
    },

    scrcpy() {
        let flags = new String();
        for (const i in this.selectedArgs) {
            flags += ' '+this.selectedArgs[i].arg;
        }
        console.log("scrcpy.exe"+flags)

        this.run("scrcpy.exe"+flags, (data) => {
            console.log(data);
        })
    }

  },
  
  data() {
    return {

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
      ]
    }
  },
}
</script>