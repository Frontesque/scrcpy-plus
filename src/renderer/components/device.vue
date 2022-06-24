<template>
  <section>
    <h2>Device</h2>

    <!--   No Device Notice   -->
    <center v-show="!device">
      <v-icon size="50px">mdi-devices</v-icon>
      <h1>No Device Found</h1>
      <p style="color: #999;">You may need to plug in your device or enable 'USB Debugging'</p>
      <p>or</p>
      <v-btn rounded color="primary" @click="$router.push('/wirelessSetup')">Connect Wirelessly</v-btn>
    </center>

    <!--   Show Device Information   -->
    <v-list-item v-for="(item, i) in deviceInfo" :key="i" v-show="device">
      <div>
        <v-list-item-title v-text="item.title" />
        <p v-text="item.data" class="grey--text" />
      </div>
    </v-list-item>

  </section>
</template>

<script>
  export default {
    data() {
      return {

        device: false,

        deviceInfo: [{
            title: "Model",
            command: "adb shell getprop ro.product.model",
            data: null,
          },
          {
            title: "Device Codename",
            command: "adb shell getprop ro.product.device",
            data: null,
          },
          {
            title: "Android Version",
            command: "adb shell getprop ro.build.version.release",
            data: null,
          },
          {
            title: "Build",
            command: "adb shell getprop ro.build.id",
            data: null,
          },
          {
            title: "SDK Version",
            command: "adb shell getprop ro.build.version.sdk",
            data: null,
          },
          {
            title: "Fingerprint",
            command: "adb shell getprop ro.build.fingerprint",
            data: null,
          }
        ]
      }
    },

    methods: {
      refreshList() {
        for (const i in this.deviceInfo) {
          this.$scrcpy.execute(this.deviceInfo[i].command)
            .then((data) => {
              this.deviceInfo[i].data = data;
            })
        }
      },

      checkDevice() {
          this.$scrcpy.execute("adb devices -l")
            .then((data) => {
                if (data.includes("device product:")) { // Device Detected
                    if (data.includes("device product:") != this.device) {
                        this.refreshList();
                    }
                    this.device = true;
                    this.$emit('update:device', true);
                } else {
                    this.device = false;
                    this.$emit('update:device', false);
                }
            })
      }

    },

    mounted() {

      setInterval(() => {
        this.checkDevice()
      }, process.env.devicePollRate);
      this.checkDevice()

    }

  }

</script>
