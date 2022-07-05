<template>
  <div style="scrollbar-width: thin;">
    <!--   Import Modules   -->
    <scrcpyPlusInfo />
    <device :device.sync="deviceConnected" style="margin-bottom: 0;" v-show="settings.device == 'true' || !deviceConnected" />
    
    <div style="display: flex; width: 100%;">
      <tools v-if="deviceConnected && settings.tools == 'true'" />
      <adb v-if="deviceConnected && settings.adb == 'true'" />
    </div>

    <scrcpy v-if="deviceConnected" />

    <updateNotice />
    <!--   End Import Modules   -->
  </div>
</template>

<script>
import scrcpyPlusInfo from '../components/scrcpyPlusInfo.vue'
export default {
  components: { scrcpyPlusInfo },
  data() {
    return {
      deviceConnected: false,

      settings: {}
    }
  },

  mounted() {
    this.settings = {
      device: localStorage.getItem("deviceInformation") || true,
      tools: localStorage.getItem("tools") || true,
      adb: localStorage.getItem("adbQuickActions") || true,
    }
    console.log(this.settings)
  }

}
</script>
