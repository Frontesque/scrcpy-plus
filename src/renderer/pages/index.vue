<template>
  <div style="scrollbar-width: thin;">
    <!--   Import Modules   -->
    <scrcpyPlusInfo />
    <device :device.sync="deviceConnected" style="margin-bottom: 0;" />
    
    <div style="display: flex; width: 100%;" v-if="deviceConnected">
      <tools />
      <adb />
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
    }
  },

}
</script>
