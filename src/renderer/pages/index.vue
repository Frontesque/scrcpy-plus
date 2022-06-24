<template>
  <div>
    <!--   Import Modules   -->
    <scrcpyPlusInfo />
    <device :device.sync="deviceConnected" />
    <adb v-if="deviceConnected" />
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
  }
}
</script>
