<template>
  <section>
    <h2>Device</h2>

    <!--   No Device Notice   -->
    <center v-show="!device">
      <v-icon size="50px" style="margin: 0;">mdi-devices</v-icon>
      <h1>No Device Found</h1>
      <p class="accent--text">You may need to plug in your device or enable 'USB Debugging'</p>
      <p>or</p>
      <v-btn rounded class="primaryButton" @click="$router.push('/wirelessSetup')"><v-icon>mdi-link-variant</v-icon>Connect Wirelessly</v-btn>
    </center>

    <!--   Show Device Information   -->
    <v-list-item v-for="(item, i) in deviceInfo" :key="i" v-show="device && !loading" style="padding: 0;">
      <div>
        <v-list-item-title>
          <v-icon v-text="item.icon" style="margin-right: 0; transform: translateY(-10%)" small />
          {{item.title}}
        </v-list-item-title>
        <p class="accent--text">{{item.data}} <span v-if="item.subCommand">({{ item.subDataPrepend }}{{ item.subData }})</span></p>
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
            subCommand: "adb shell getprop ro.product.device",
            subData: null,
          },
          {
            title: "Android Version",
            icon: "mdi-android",
            command: "adb shell getprop ro.build.version.release",
            data: null,
            subCommand: "adb shell getprop ro.build.version.sdk",
            subData: null,
            subDataPrepend: "API "
          },
          {
            title: "System Build Number",
            icon: "mdi-wrench",
            command: "adb shell getprop ro.build.id",
            data: null,
          },
          {
            title: "Security Patch",
            icon: "mdi-security",
            command: "adb shell getprop ro.build.version.security_patch",
            data: null,
          },
        ]
      }
    },

    methods: {
      async refreshList() {
        this.loading = true;
        for (const i in this.deviceInfo) {
          const data = await this.$execute(this.deviceInfo[i].command);
          this.deviceInfo[i].data = data.trim();
          if (!this.deviceInfo[i].subCommand) continue;
          const subData = await this.$execute(this.deviceInfo[i].subCommand);
          this.deviceInfo[i].subData = subData.trim();
        }
        this.loading = false;
      },

      checkDevice() {
        this.$execute("adb devices -l")
          .then((data) => {
            if (data.includes("product:")) { // Device Detected
              if (data.includes("product:") != this.device) {
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
