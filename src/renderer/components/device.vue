<template>
  <section>
    <h2>Device</h2>

    <!--   No Device Notice   -->
    <center v-show="!device">
      <v-icon size="50px">mdi-devices</v-icon>
      <h1>No Device Found</h1>
      <p class="accent--text">You may need to plug in your device or enable 'USB Debugging'</p>
      <p>or</p>
      <v-btn rounded color="primary" @click="$router.push('/wirelessSetup')">Connect Wirelessly</v-btn>
    </center>

    <!--   Show Device Information   -->
    <v-list-item v-for="(item, i) in deviceInfo" :key="i" v-show="device && !loading" style="padding: 0;">
      <div>
        <v-list-item-title>
          <v-icon v-text="item.icon" style="margin-right: 0;" small />
          {{item.title}}
        </v-list-item-title>
        <p v-text="item.data" class="accent--text" />
      </div>
    </v-list-item>

    <!--   Loading Animation   -->
    <center v-if="loading">
      <wheel />
      <p>Connecting</p>
    </center>

  </section>
</template>

<script>
  export default {
    data() {
      return {

        device: false,
        loading: false,

        deviceInfo: [{
            title: "Model",
            icon: "mdi-devices",
            command: "adb shell getprop ro.product.model",
            data: null,
          },
          {
            title: "Device Codename",
            icon: "mdi-cellphone-key",
            command: "adb shell getprop ro.product.device",
            data: null,
          },
          {
            title: "Android Version",
            icon: "mdi-android",
            command: "adb shell getprop ro.build.version.release",
            data: null,
          },
          {
            title: "Build Number",
            icon: "mdi-wrench",
            command: "adb shell getprop ro.build.id",
            data: null,
          },
          {
            title: "SDK Version",
            icon: "mdi-android-studio",
            command: "adb shell getprop ro.build.version.sdk",
            data: null,
          }
        ]
      }
    },

    methods: {
      async refreshList() {
        this.loading = true;
        for (const i in this.deviceInfo) {
          const data = await this.$execute(this.deviceInfo[i].command);
          this.deviceInfo[i].data = data;
        }
        this.loading = false;
      },

      checkDevice() {
        this.$execute("adb devices -l")
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
      this.interval = setInterval(this.checkDevice, process.env.devicePollRate);
      this.checkDevice();
    },

    beforeDestroy() {
      clearInterval(this.interval); // Prevent Memory Leak
    }

  }

</script>
